import { supabase } from "./supabaseClient";

export const SHIPMENTS_STORAGE_KEY = "hajex-shipments";

// Fetch all shipments from Supabase (or fallback to LocalStorage if offline/unconfigured)
export async function fetchShipments() {
  try {
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch error, using LocalStorage fallback:", error.message);
      return loadLocalShipments();
    }

    return data && data.length > 0 ? data : loadLocalShipments();
  } catch (err) {
    console.warn("Error fetching shipments from database:", err);
    return loadLocalShipments();
  }
}

// Save a new shipment to Supabase (and LocalStorage as backup)
export async function saveShipmentRecord(formData, supplies = []) {
  const createdAt = new Date().toISOString();
  const suffix = `${Date.now()}`.slice(-8);

  const record = {
    order_number: `HX-${suffix}`,
    tracking_number: `TRK${suffix}`,
    created_at: createdAt,
    status: "Booked",
    pickup_address: formData.pickupAddress,
    delivery_address: formData.deliveryAddress,
    services: formData.services,
    packages: formData.packages,
    supplies: supplies,
    quote: formData.selectedQuote,
    supplies_total: Number(
      supplies.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    ),
    total: Number(
      (
        (formData.selectedQuote?.price || 0) +
        supplies.reduce((total, item) => total + item.price * item.quantity, 0)
      ).toFixed(2)
    )
  };

  // 1. Try saving to Supabase Database
  try {
    const { data, error } = await supabase.from("shipments").insert([record]).select();
    if (error) {
      console.error("Supabase insert error:", error.message);
    } else if (data && data.length > 0) {
      console.log("Successfully saved to Supabase:", data[0]);
    }
  } catch (err) {
    console.error("Failed to insert into Supabase:", err);
  }

  // 2. Also save to LocalStorage as a client fallback
  saveLocalShipmentRecord(record);

  return record;
}

// Fallback helper functions for LocalStorage
export function loadLocalShipments() {
  if (typeof window === "undefined") return [];
  try {
    const records = JSON.parse(localStorage.getItem(SHIPMENTS_STORAGE_KEY));
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

// Backwards compatibility aliases
export const loadShipments = loadLocalShipments;
export const createShipmentRecord = saveShipmentRecord;

function saveLocalShipmentRecord(record) {
  if (typeof window === "undefined") return;
  const existing = loadLocalShipments();
  localStorage.setItem(SHIPMENTS_STORAGE_KEY, JSON.stringify([record, ...existing]));
}
