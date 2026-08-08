import React, { useEffect, useRef } from "react";
import { FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";
import { City, Country, State } from "country-state-city";

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50";
const labelClass = "mb-1 block text-[10px] font-medium text-slate-500";
let googleMapsPromise;

function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (googleMapsPromise) return googleMapsPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return Promise.reject(new Error("Google Maps API key is missing"));

  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
    script.async = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function GoogleAddressInput({ address, saved, updateAddress }) {
  const inputRef = useRef(null);
  const updateAddressRef = useRef(updateAddress);

  useEffect(() => {
    updateAddressRef.current = updateAddress;
  }, [updateAddress]);

  useEffect(() => {
    let listener;
    let cancelled = false;

    loadGoogleMaps()
      .then(async () => {
        await window.google.maps.importLibrary("places");
        if (cancelled || !inputRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["address"], fields: ["formatted_address", "address_components"] },
        );

        listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const components = place.address_components || [];
          const getPart = (type) =>
            components.find((component) => component.types.includes(type))
              ?.long_name || "";

          updateAddressRef.current({
            address: place.formatted_address || inputRef.current.value,
            country: getPart("country"),
            state: getPart("administrative_area_level_1"),
            city:
              getPart("locality") ||
              getPart("postal_town") ||
              getPart("administrative_area_level_2"),
            postalCode: getPart("postal_code"),
          });
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      listener?.remove();
    };
  }, [saved]);

  return (
    <label>
      <span className={labelClass}>Full Address *</span>
      <input
        ref={inputRef}
        type="text"
        name="address"
        value={address.address}
        onChange={(event) => updateAddress({ address: event.target.value })}
        placeholder="Start typing an address"
        disabled={saved}
        autoComplete="off"
        className={inputClass}
      />
    </label>
  );
}

export default function AddressCard({
  type,
  address,
  updateAddress,
  saved,
  saveAddress,
  editAddress,
  clearAddress,
  collapsed,
  toggleCollapsed,
  savedAddresses,
  selectSavedAddress,
}) {
  const isPickup = type === "pickup";
  const canSave = Boolean(address.address.trim());
  const countries = Country.getAllCountries();
  const selectedCountry = countries.find((country) => country.name === address.country);
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];
  const selectedState = states.find((state) => state.name === address.state);
  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      : [];

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "country") {
      updateAddress({ country: value, state: "", city: "" });
      return;
    }

    if (name === "state") {
      updateAddress({ state: value, city: "" });
      return;
    }

    updateAddress({ [name]: value });
  };

  const selectField = (name, label, options, placeholder, disabled = false) => (
    <label>
      <span className={labelClass}>{label}</span>
      <select
        name={name}
        value={address[name]}
        onChange={handleChange}
        disabled={saved || disabled}
        className={inputClass}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );

  const field = (name, label, placeholder, typeName = "text") => (
    <label>
      <span className={labelClass}>{label}</span>
      <input
        type={typeName}
        name={name}
        value={address[name]}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={saved}
        className={inputClass}
      />
    </label>
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className={`text-xs font-bold uppercase tracking-wide ${isPickup ? "text-blue-700" : "text-emerald-700"}`}>
            {isPickup ? "Pickup Address (Shipper)" : "Delivery Address (Consignee)"}
          </h2>
        </div>
        <button type="button" onClick={toggleCollapsed} className="flex items-center gap-1 text-[10px] font-medium text-slate-500 hover:text-slate-800">
          {collapsed ? "Expand" : "Collapse"}
          {collapsed ? <FiChevronDown /> : <FiChevronUp />}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <GoogleAddressInput
            address={address}
            saved={saved}
            updateAddress={updateAddress}
          />
        </div>
        {selectField(
          "country",
          "Country *",
          countries.map((country) => ({ value: country.name, label: country.name })),
          "Select country",
        )}
        {selectField(
          "state",
          "State / Province *",
          states.map((state) => ({ value: state.name, label: state.name })),
          "Select state / province",
          !address.country,
        )}
        {selectField(
          "city",
          "City / Town *",
          cities.map((city) => ({ value: city.name, label: city.name })),
          "Select city",
          !address.state,
        )}
        {field("postalCode", "ZIP / Postal *", "Postal code")}
      </div>

      {!collapsed && (
        <>
          <div className="mt-2.5 grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-2.5 sm:grid-cols-2">
            {field("company", "Company", "Company name")}
            {field("name", "Attention / Contact *", "Contact name")}
            {field("phone", "Phone *", "Phone number", "tel")}
            {field("email", "Email", "Email address", "email")}
            <div className="grid grid-cols-2 gap-2 sm:col-span-2 sm:grid-cols-3">
              {field("timeOpen", `${isPickup ? "Pickup" : "Delivery"} Time Open`, "--:--", "time")}
              {field("timeClose", `${isPickup ? "Pickup" : "Delivery"} Time Close`, "--:--", "time")}
              {field("date", isPickup ? "Pickup Date" : "Preferred Delivery Date", "", "date")}
            </div>
            <label>
              <span className={labelClass}>Instructions</span>
              <textarea name="instructions" value={address.instructions} onChange={handleChange} disabled={saved} rows="2" placeholder="Special instructions" className={`${inputClass} resize-none`} />
            </label>
            <label>
              <span className={labelClass}>{isPickup ? "Reference" : "Order ID / Reference"}</span>
              <textarea name="reference" value={address.reference} onChange={handleChange} disabled={saved} rows="2" placeholder="Reference" className={`${inputClass} resize-none`} />
            </label>
          </div>
        </>
      )}

      <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-h-7 min-w-0 flex-wrap gap-1.5">
              {savedAddresses.map((entry, index) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => selectSavedAddress(entry.address)}
                  title={`Use ${entry.address.address}`}
                  className="inline-flex max-w-48 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                >
                  <FiCheck size={12} className="shrink-0" />
                  <span className="truncate">
                    {entry.address.company || entry.address.name || `Address ${index + 1}`}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button type="button" onClick={saveAddress} disabled={!canSave || saved} className="rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
                {saved ? "Saved to Address Book" : "Save to Address Book"}
              </button>
              <button type="button" onClick={editAddress} disabled={!saved} className="rounded-md bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40">
                Edit
              </button>
              <button type="button" onClick={clearAddress} className="rounded-md bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-900">
                Delete
              </button>
            </div>
      </div>
    </div>
  );
}
