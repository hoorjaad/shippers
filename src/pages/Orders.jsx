import React, { useEffect, useMemo, useState } from "react";
import {
  FiPackage,
  FiSearch,
  FiEye,
  FiFileText,
  FiX,
  FiMapPin,
  FiColumns,
  FiPlus,
  FiImage,
  FiUploadCloud,
  FiCheckCircle,
  FiFilter,
  FiRotateCcw,
} from "react-icons/fi";
import { fetchShipments, loadShipments, saveShipmentRecord } from "../utils/shipmentStorage";
import HajexBoltInvoice from "../componants/invoice/HajexBoltInvoice";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const ALL_COLUMNS = [
  { id: "orderId", label: "Order ID" },
  { id: "type", label: "Type" },
  { id: "customer", label: "Customer" },
  { id: "orderStatus", label: "Order" },
  { id: "marketplace", label: "Marketplace" },
  { id: "carrier", label: "Carrier" },
  { id: "tracking", label: "Tracking" },
  { id: "reference", label: "Reference" },
  { id: "status", label: "Status" },
  { id: "total", label: "Total" },
  { id: "warehouse", label: "Warehouse" },
  { id: "fulfillment", label: "Fulfillment" },
  { id: "itemTotal", label: "Item Total" },
  { id: "billing", label: "Billing" },
  { id: "attachments", label: "Attachments" },
  { id: "createdBy", label: "Created By" },
  { id: "createdAt", label: "Created At" },
];

const MOCK_HAJEX_ORDERS = [
  {
    id: "1224",
    orderIdNumber: "#1224",
    subId: "HR62878516U165",
    type: "Manual",
    customer: "Hajex Delta",
    orderStatus: "Confirmed",
    marketplace: "—",
    carrier: "Vitran",
    tracking: "MTL20260727P00016",
    reference: "HB62878516U165",
    status: "Creation",
    total: "—",
    warehouse: "—",
    fulfillment: "Pending / New",
    itemTotal: "—",
    billing: "Unpaid",
    attachments: true,
    createdBy: "Shopify",
    createdAt: "2026-07-27 01:47 PM",
  },
  {
    id: "1223",
    orderIdNumber: "#1223",
    subId: "086857814U165",
    type: "Manual",
    customer: "Hajex Delta",
    orderStatus: "Confirmed",
    marketplace: "—",
    carrier: "Vitran",
    tracking: "MTL20260727P00015",
    reference: "HB62878516U165",
    status: "Creation",
    total: "—",
    warehouse: "—",
    fulfillment: "Pending / New",
    itemTotal: "—",
    billing: "Unpaid",
    attachments: true,
    createdBy: "Shopify",
    createdAt: "2026-07-27 01:03 PM",
  },
  {
    id: "1222",
    orderIdNumber: "#1222",
    subId: "097879405U165",
    type: "Manual",
    customer: "Hajex Delta",
    orderStatus: "Confirmed",
    marketplace: "—",
    carrier: "Vitran",
    tracking: "MTL20260727P00014",
    reference: "HB07722877U165",
    status: "Creation",
    total: "—",
    warehouse: "—",
    fulfillment: "Pending / New",
    itemTotal: "—",
    billing: "Unpaid",
    attachments: true,
    createdBy: "Shopify",
    createdAt: "2026-07-27 01:03 PM",
  },
  {
    id: "1210",
    orderIdNumber: "#1210",
    subId: "041543450U348",
    type: "Manual",
    customer: "Hajex Delta",
    orderStatus: "Confirmed",
    marketplace: "—",
    carrier: "M-O",
    tracking: "F7780732",
    reference: "HB96759272U348",
    status: "Creation",
    total: "—",
    warehouse: "—",
    fulfillment: "Pending / New",
    itemTotal: "—",
    billing: "Unpaid",
    attachments: true,
    createdBy: "Shopify",
    createdAt: "2026-07-27 04:20 AM",
  },
  {
    id: "1208",
    orderIdNumber: "#1208",
    subId: "email test 11",
    type: "Manual",
    customer: "Hajex Delta",
    orderStatus: "Confirmed",
    marketplace: "—",
    carrier: "UPS",
    tracking: "1ZXXXXXXXXXXXXXXXX",
    reference: "email test 11",
    status: "Creation",
    total: "—",
    warehouse: "Yousafzai420",
    fulfillment: "Pending / New",
    itemTotal: "15.00 CAD",
    billing: "Unpaid",
    attachments: true,
    createdBy: "Shopify",
    createdAt: "2026-07-26 12:15 PM",
  },
  {
    id: "1207",
    orderIdNumber: "#1207",
    subId: "email test 10",
    type: "Manual",
    customer: "email test 10",
    orderStatus: "Confirmed",
    marketplace: "—",
    carrier: "UPS",
    tracking: "—",
    reference: "—",
    status: "Delivered",
    total: "0 $",
    warehouse: "Yousafzai420",
    fulfillment: "Fulfilled",
    itemTotal: "0.00 CAD",
    billing: "Paid",
    attachments: true,
    createdBy: "Shopify",
    createdAt: "2026-07-26 12:14 PM",
  },
];

export default function Orders() {
  const [rawOrders, setRawOrders] = useState(loadShipments);
  const [search, setSearch] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Filter States
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [statusFilter, setStatusFilter] = useState("All");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [carrierFilter, setCarrierFilter] = useState("All");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("All");
  const [billingFilter, setBillingFilter] = useState("All");

  // Column visibility state
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );

  // Modals state
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewOrderModal, setViewOrderModal] = useState(null);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchShipments();
      if (data && data.length > 0) {
        setRawOrders(data);
      }
    }
    loadData();
  }, []);

  // Close dropdown menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".actions-dropdown-container") && !e.target.closest(".columns-dropdown-container")) {
        setActiveDropdown(null);
        setShowColumnsMenu(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const orders = useMemo(() => {
    const dbMapped = rawOrders.map((item, index) => ({
      id: String(1225 + index),
      orderIdNumber: `#${1225 + index}`,
      subId: item.order_number || item.orderNumber || `HR${Date.now().toString().slice(-8)}`,
      type: "Manual",
      customer: item.delivery_address?.name || item.deliveryAddress?.name || "Hajex Delta",
      orderStatus: "Confirmed",
      marketplace: "—",
      carrier: item.quote?.carrier || "Vitran",
      tracking: item.tracking_number || item.trackingNumber || `MTL20260727P00${index + 10}`,
      reference: `HB${Date.now().toString().slice(-8)}`,
      status: item.status || "Creation",
      total: formatMoney(item.total || item.quote?.price || 0),
      warehouse: "Yousafzai420",
      fulfillment: "Pending / New",
      itemTotal: formatMoney(item.supplies_total || item.suppliesTotal || 0),
      billing: "Unpaid",
      attachments: true,
      createdBy: "Shopify",
      createdAt: new Date(item.created_at || item.createdAt || Date.now()).toLocaleString(),
      pickupAddress: item.pickup_address || item.pickupAddress || {},
      deliveryAddress: item.delivery_address || item.deliveryAddress || {},
      quote: item.quote || { carrier: "Vitran", service: "Regular", price: item.total || 0 },
      packages: item.packages || [],
      supplies: item.supplies || [],
    }));

    return [...dbMapped, ...MOCK_HAJEX_ORDERS];
  }, [rawOrders]);

  // Robust Flexible Multi-Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search Query
      const query = search.trim().toLowerCase();
      if (query) {
        const matchesSearch = [
          order.orderIdNumber,
          order.subId,
          order.customer,
          order.carrier,
          order.tracking,
          order.reference,
          order.createdBy,
          order.warehouse,
          order.status,
          order.orderStatus,
        ].some((value) => String(value || "").toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // 2. Status Filter
      if (statusFilter !== "All") {
        const targetStatus = statusFilter.toLowerCase();
        const st = String(order.status || "").toLowerCase();
        const ordSt = String(order.orderStatus || "").toLowerCase();
        if (!st.includes(targetStatus) && !ordSt.includes(targetStatus)) {
          return false;
        }
      }

      // 3. Warehouse Filter
      if (warehouseFilter !== "All") {
        const wh = String(order.warehouse || "").trim();
        if (warehouseFilter === "Unassigned") {
          if (wh !== "—" && wh !== "-" && wh !== "") return false;
        } else {
          if (!wh.toLowerCase().includes(warehouseFilter.toLowerCase())) return false;
        }
      }

      // 4. Carrier Filter
      if (carrierFilter !== "All") {
        const car = String(order.carrier || "").toLowerCase();
        if (!car.includes(carrierFilter.toLowerCase())) return false;
      }

      // 5. Fulfillment Filter
      if (fulfillmentFilter !== "All") {
        const ful = String(order.fulfillment || "").toLowerCase();
        if (!ful.includes(fulfillmentFilter.toLowerCase())) return false;
      }

      // 6. Billing Filter
      if (billingFilter !== "All") {
        const bill = String(order.billing || "").toLowerCase();
        if (!bill.includes(billingFilter.toLowerCase())) return false;
      }

      return true;
    });
  }, [orders, search, statusFilter, warehouseFilter, carrierFilter, fulfillmentFilter, billingFilter]);

  // Live Metrics
  const pendingCount = orders.filter((o) => String(o.fulfillment).includes("Pending")).length;
  const fulfilledCount = orders.filter((o) => String(o.fulfillment).includes("Fulfilled")).length;
  const deliveredCount = orders.filter((o) => String(o.status).includes("Delivered")).length;
  const unpaidCount = orders.filter((o) => String(o.billing).toLowerCase().includes("unpaid")).length;

  const activeFilterCount = [
    statusFilter !== "All",
    warehouseFilter !== "All",
    carrierFilter !== "All",
    fulfillmentFilter !== "All",
    billingFilter !== "All",
    search.trim() !== "",
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setStatusFilter("All");
    setWarehouseFilter("All");
    setCarrierFilter("All");
    setFulfillmentFilter("All");
    setBillingFilter("All");
    setSearch("");
  };

  const toggleColumn = (colId) => {
    setVisibleColumns((prev) => ({ ...prev, [colId]: !prev[colId] }));
  };

  const activeColumnCount = Object.values(visibleColumns).filter(Boolean).length;

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAddOrder = async (newOrderData) => {
    const suffix = `${Date.now()}`.slice(-6);
    const newRecord = {
      order_number: `HX-${suffix}`,
      tracking_number: `TRK${suffix}`,
      status: "Creation",
      pickupAddress: { address: "Hajex Fitness Montreal, QC, Canada", city: "Anjou" },
      deliveryAddress: { name: newOrderData.customer, address: newOrderData.address || "Destination" },
      services: [],
      packages: [{ weight: newOrderData.weight || 10 }],
      supplies: [],
      selectedQuote: { carrier: newOrderData.carrier, service: "Standard", price: Number(newOrderData.total) || 45 },
    };

    await saveShipmentRecord(newRecord, []);
    const updated = await fetchShipments();
    if (updated) setRawOrders(updated);
    setShowAddModal(false);
  };

  return (
    <section className="mx-auto w-full font-sans text-xs">
      {/* Top Metric Cards Bar */}
      <div className="mb-3 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FILTER BY DATE</div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm cursor-pointer hover:border-blue-300 transition" onClick={resetAllFilters}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ORDERS</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xs font-bold text-blue-600">Total Orders <strong className="text-sm font-black text-slate-900">{orders.length}</strong></span>
            <span className="text-[11px] text-slate-500">Total Fulfillment <strong>$55</strong></span>
          </div>
          <p className="mt-1 text-[10px] font-bold text-red-500">Unpaid Fulfillment {unpaidCount}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm cursor-pointer hover:border-blue-300 transition" onClick={() => setStatusFilter("Delivered")}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SHIPMENTS</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xs font-bold text-blue-600">Total Shipments <strong className="text-sm font-black text-slate-900">{orders.length}</strong></span>
          </div>
          <p className="mt-1 text-[10px] font-bold text-emerald-600">Delivered Shipments {deliveredCount}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm cursor-pointer hover:border-blue-300 transition" onClick={resetAllFilters}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ORDER TYPE</div>
          <p className="mt-1 text-xs font-bold text-purple-600">Manual <span className="text-sm font-black text-slate-900">{orders.length}</span></p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FULFILLMENT STATUS</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 cursor-pointer hover:underline" onClick={() => setFulfillmentFilter("Pending / New")}>
              Pending / New <strong className="text-sm font-black text-slate-900">{pendingCount}</strong>
            </span>
            <span className="text-xs font-bold text-emerald-600 cursor-pointer hover:underline" onClick={() => setFulfillmentFilter("Fulfilled")}>
              Fulfilled <strong className="text-sm font-black text-slate-900">{fulfilledCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROL BAR (Status, Warehouse, Carrier, Fulfillment, Billing) */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-1">
          <FiFilter className="text-blue-600" size={15} />
          <span>Filter Orders:</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Creation">Creation</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Delivered">Delivered</option>
            <option value="Booked">Booked</option>
          </select>
        </div>

        {/* Warehouse Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Warehouse:</span>
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Warehouses</option>
            <option value="Yousafzai420">Yousafzai420</option>
            <option value="Unassigned">Unassigned (—)</option>
          </select>
        </div>

        {/* Carrier Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Carrier:</span>
          <select
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Carriers</option>
            <option value="Vitran">Vitran</option>
            <option value="M-O">M-O</option>
            <option value="UPS">UPS</option>
            <option value="DHL">DHL</option>
            <option value="FedEx">FedEx</option>
          </select>
        </div>

        {/* Fulfillment Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Fulfillment:</span>
          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Fulfillment</option>
            <option value="Pending / New">Pending / New</option>
            <option value="Fulfilled">Fulfilled</option>
          </select>
        </div>

        {/* Billing Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Billing:</span>
          <select
            value={billingFilter}
            onChange={(e) => setBillingFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Billing</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {/* Reset Button */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-100 transition ml-auto"
          >
            <FiRotateCcw size={12} />
            Reset ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Toolbar with Columns Dropdown, Import, and Add Buttons */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-slate-900">Orders</h1>

          {/* COLUMNS DROPDOWN BUTTON */}
          <div className="columns-dropdown-container relative">
            <button
              type="button"
              onClick={() => setShowColumnsMenu((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <FiColumns size={13} className="text-slate-500" />
              Columns <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-700">{activeColumnCount}</span>
            </button>

            {showColumnsMenu && (
              <div className="absolute left-0 top-full mt-1.5 z-40 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-slate-900/5">
                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-1.5 px-2">
                  <span className="text-[11px] font-bold text-slate-700">Toggle Columns</span>
                  <button
                    type="button"
                    onClick={() => setVisibleColumns(ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {}))}
                    className="text-[10px] font-semibold text-blue-600 hover:underline"
                  >
                    Select All
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 px-1">
                  {ALL_COLUMNS.map((col) => (
                    <label key={col.id} className="flex items-center justify-between rounded px-2 py-1 text-xs hover:bg-slate-50 cursor-pointer">
                      <span className="text-slate-700">{col.label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(visibleColumns[col.id])}
                        onChange={() => toggleColumn(col.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* IMPORT BUTTON */}
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition active:scale-95"
          >
            📥 IMPORT
          </button>

          {/* ADD BUTTON */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition active:scale-95"
          >
            <FiPlus size={14} /> ADD
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Orders By Order ID"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 shadow-sm transition"
          />
        </div>
      </div>

      {/* Main Dynamic Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] leading-snug">
            <thead className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-2.5 py-2">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300"
                  />
                </th>
                {visibleColumns.orderId && <th className="px-2.5 py-2">Order ID</th>}
                {visibleColumns.type && <th className="px-2.5 py-2">Type</th>}
                {visibleColumns.customer && <th className="px-2.5 py-2">Customer</th>}
                {visibleColumns.orderStatus && <th className="px-2.5 py-2">Order</th>}
                {visibleColumns.marketplace && <th className="px-2.5 py-2">Marketplace</th>}
                {visibleColumns.carrier && <th className="px-2.5 py-2">Carrier</th>}
                {visibleColumns.tracking && <th className="px-2.5 py-2">Tracking</th>}
                {visibleColumns.reference && <th className="px-2.5 py-2">Reference</th>}
                {visibleColumns.status && <th className="px-2.5 py-2">Status</th>}
                {visibleColumns.total && <th className="px-2.5 py-2">Total</th>}
                {visibleColumns.warehouse && <th className="px-2.5 py-2">Warehouse</th>}
                {visibleColumns.fulfillment && <th className="px-2.5 py-2">Fulfillment</th>}
                {visibleColumns.itemTotal && <th className="px-2.5 py-2">Item Total</th>}
                {visibleColumns.billing && <th className="px-2.5 py-2">Billing</th>}
                {visibleColumns.attachments && <th className="px-2.5 py-2 text-center">Attachments</th>}
                {visibleColumns.createdBy && <th className="px-2.5 py-2">Created By</th>}
                {visibleColumns.createdAt && <th className="px-2.5 py-2">Created At</th>}
                <th className="px-2.5 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="20" className="py-12 text-center text-slate-400">
                    <p className="font-bold text-slate-600 text-sm">No orders match the selected filters</p>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="mt-2 inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
                    >
                      <FiRotateCcw size={12} /> Clear All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const isSelected = selectedOrders.includes(o.id);

                  return (
                    <tr key={o.id} className={`hover:bg-slate-50/80 transition ${isSelected ? "bg-blue-50/40" : ""}`}>
                      <td className="px-2.5 py-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(o.id)}
                          className="rounded border-slate-300"
                        />
                      </td>

                      {visibleColumns.orderId && (
                        <td className="px-2.5 py-2">
                          <p className="font-bold text-blue-600">{o.orderIdNumber}</p>
                          <p className="text-[9px] font-mono text-slate-400">{o.subId}</p>
                        </td>
                      )}

                      {visibleColumns.type && (
                        <td className="px-2.5 py-2">
                          <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                            {o.type}
                          </span>
                        </td>
                      )}

                      {visibleColumns.customer && (
                        <td className="px-2.5 py-2 font-semibold text-slate-900 whitespace-nowrap">{o.customer}</td>
                      )}

                      {visibleColumns.orderStatus && (
                        <td className="px-2.5 py-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {o.orderStatus}
                          </span>
                        </td>
                      )}

                      {visibleColumns.marketplace && <td className="px-2.5 py-2 text-slate-400">{o.marketplace}</td>}

                      {visibleColumns.carrier && (
                        <td className="px-2.5 py-2">
                          <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-black text-white uppercase">
                            {o.carrier}
                          </span>
                        </td>
                      )}

                      {visibleColumns.tracking && <td className="px-2.5 py-2 font-mono text-blue-600 font-bold whitespace-nowrap">{o.tracking}</td>}
                      {visibleColumns.reference && <td className="px-2.5 py-2 font-mono text-slate-600 whitespace-nowrap">{o.reference}</td>}

                      {visibleColumns.status && (
                        <td className="px-2.5 py-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            o.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              o.status === "Delivered" ? "bg-emerald-500" : "bg-slate-400"
                            }`} />
                            {o.status}
                          </span>
                        </td>
                      )}

                      {visibleColumns.total && <td className="px-2.5 py-2 font-semibold text-slate-800">{o.total}</td>}
                      {visibleColumns.warehouse && <td className="px-2.5 py-2 text-slate-600">{o.warehouse}</td>}

                      {visibleColumns.fulfillment && (
                        <td className="px-2.5 py-2">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                            o.fulfillment === "Fulfilled" ? "text-emerald-700" : "text-slate-600"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              o.fulfillment === "Fulfilled" ? "bg-emerald-500" : "bg-amber-500"
                            }`} />
                            {o.fulfillment}
                          </span>
                        </td>
                      )}

                      {visibleColumns.itemTotal && <td className="px-2.5 py-2 font-bold text-slate-900">{o.itemTotal}</td>}

                      {visibleColumns.billing && (
                        <td className="px-2.5 py-2">
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            o.billing === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                          }`}>
                            {o.billing}
                          </span>
                        </td>
                      )}

                      {visibleColumns.attachments && (
                        <td className="px-2.5 py-2 text-center">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-blue-50 text-blue-600" title="1 Attachment">
                            <FiImage size={11} />
                          </span>
                        </td>
                      )}

                      {visibleColumns.createdBy && <td className="px-2.5 py-2 font-semibold text-slate-700">{o.createdBy}</td>}
                      {visibleColumns.createdAt && <td className="whitespace-nowrap px-2.5 py-2 text-[10px] text-slate-500">{o.createdAt}</td>}

                      {/* Actions Dropdown */}
                      <td className="px-2.5 py-2 text-right">
                        <div className="actions-dropdown-container relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() => setActiveDropdown(activeDropdown === o.id ? null : o.id)}
                            className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                          >
                            ⋮ More
                          </button>

                          {activeDropdown === o.id && (
                            <div className="absolute right-0 top-full mt-1 z-30 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5">
                              <button
                                type="button"
                                onClick={() => {
                                  setViewOrderModal(o);
                                  setActiveDropdown(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                              >
                                <FiEye size={13} className="text-blue-500" />
                                View Order
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setViewInvoiceModal(o);
                                  setActiveDropdown(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition"
                              >
                                <FiFileText size={13} className="text-emerald-500" />
                                View Invoice
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-1 font-semibold">
            <button type="button" className="rounded px-2 py-0.5 hover:bg-slate-200">&lt;</button>
            <span className="rounded bg-blue-600 px-2 py-0.5 font-bold text-white">1</span>
            <button type="button" className="rounded px-2 py-0.5 hover:bg-slate-200">2</button>
            <button type="button" className="rounded px-2 py-0.5 hover:bg-slate-200">3</button>
            <span>...</span>
            <button type="button" className="rounded px-2 py-0.5 hover:bg-slate-200">11</button>
            <button type="button" className="rounded px-2 py-0.5 hover:bg-slate-200">&gt;</button>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span>Rows per page: <strong>40</strong></span>
            <span>Total: <strong>{filteredOrders.length}</strong></span>
          </div>
        </div>
      </div>

      {/* IMPORT ORDERS MODAL */}
      {showImportModal && (
        <ImportOrdersModal onClose={() => setShowImportModal(false)} />
      )}

      {/* ADD NEW ORDER MODAL */}
      {showAddModal && (
        <AddNewOrderModal onSubmit={handleAddOrder} onClose={() => setShowAddModal(false)} />
      )}

      {/* VIEW ORDER MODAL */}
      {viewOrderModal && (
        <ViewOrderModal order={viewOrderModal} onClose={() => setViewOrderModal(null)} />
      )}

      {/* VIEW INVOICE MODAL (HAJEX BOLT OFFICIAL DESIGN) */}
      {viewInvoiceModal && (
        <HajexBoltInvoice invoiceData={viewInvoiceModal} onClose={() => setViewInvoiceModal(null)} />
      )}
    </section>
  );
}

/* IMPORT ORDERS MODAL */
function ImportOrdersModal({ onClose }) {
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImportSubmit = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2">
            <FiUploadCloud size={20} className="text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Import Orders CSV / Excel</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200">
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700">
          {success ? (
            <div className="py-6 text-center">
              <FiCheckCircle size={44} className="mx-auto text-emerald-500" />
              <p className="mt-3 text-sm font-bold text-slate-900">Import Completed Successfully!</p>
              <p className="text-xs text-slate-500">Your imported orders have been added to the database.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-blue-400 transition">
                <FiUploadCloud size={36} className="text-slate-400" />
                <p className="mt-2 text-xs font-bold text-slate-700">Click to upload or drag & drop CSV file</p>
                <p className="text-[10px] text-slate-400">Supports .CSV, .XLSX (Max 10MB)</p>
                <input type="file" accept=".csv, .xlsx" className="mt-3 text-xs" />
              </div>

              <div className="rounded-lg bg-blue-50/70 p-3 text-[11px] text-blue-900">
                <p className="font-bold mb-1">Need a sample file?</p>
                <a href="#download" onClick={(e) => e.preventDefault()} className="font-bold underline text-blue-700">
                  Download Sample CSV Template
                </a>
              </div>
            </>
          )}
        </div>

        {!success && (
          <div className="flex justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleImportSubmit}
              disabled={importing}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 font-bold text-white hover:bg-blue-700 shadow-sm disabled:opacity-50"
            >
              {importing ? "Importing..." : "Upload & Process"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ADD NEW ORDER MODAL */
function AddNewOrderModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    customer: "",
    carrier: "Vitran",
    total: "45.00",
    weight: "15",
    address: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2">
            <FiPlus size={20} className="text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Add New Manual Order</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3 text-xs text-slate-700">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Customer / Consignee Name *</label>
            <input
              type="text"
              required
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              placeholder="e.g. Hajex Delta / John Doe"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Carrier</label>
              <select
                value={formData.carrier}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 bg-white"
              >
                <option>Vitran</option>
                <option>M-O</option>
                <option>UPS</option>
                <option>DHL</option>
                <option>FedEx</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Destination Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="100 Main Street, Suite 200, Montreal"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 mt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700">
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white shadow hover:bg-emerald-700">
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* VIEW ORDER MODAL */
function ViewOrderModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FiPackage size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Order Summary {order.orderIdNumber}</h2>
              <p className="text-xs text-slate-500">Ref: {order.reference} · Tracking: {order.tracking}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200">
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-blue-600 mb-2">
                <FiMapPin /> Shipper / Origin
              </p>
              <p className="font-bold text-slate-900">HAJEX Logistics Dept</p>
              <p className="mt-1">100 Logistics Way, Suite 400</p>
              <p className="text-slate-500">Montreal, QC, Canada</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-600 mb-2">
                <FiMapPin /> Customer Consignee
              </p>
              <p className="font-bold text-slate-900">{order.customer}</p>
              <p className="mt-1">Destination Address</p>
              <p className="text-slate-500">Created: {order.createdAt}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Fulfillment Metadata</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-lg bg-slate-50 p-2"><span className="block text-[9px] text-slate-400 font-bold">CARRIER</span><span className="font-bold">{order.carrier}</span></div>
              <div className="rounded-lg bg-slate-50 p-2"><span className="block text-[9px] text-slate-400 font-bold">STATUS</span><span className="font-bold">{order.orderStatus}</span></div>
              <div className="rounded-lg bg-slate-50 p-2"><span className="block text-[9px] text-slate-400 font-bold">WAREHOUSE</span><span className="font-bold">{order.warehouse}</span></div>
              <div className="rounded-lg bg-slate-50 p-2"><span className="block text-[9px] text-slate-400 font-bold">CREATED BY</span><span className="font-bold">{order.createdBy}</span></div>
            </div>
          </div>

          {/* Shipment Supplies Detail */}
          <div className="rounded-xl border border-slate-200 p-4 bg-white">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Shipment Supplies</h3>
            {order.supplies && order.supplies.length > 0 ? (
              <div className="space-y-1.5">
                {order.supplies.map((sup, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded text-xs">
                    <span className="font-bold text-slate-800">{sup.name || "Wooden Pallet"}</span>
                    <span className="text-slate-500">Qty: <strong>{sup.quantity || 1}</strong></span>
                    <span className="font-bold text-slate-900">${(Number(sup.price || 15) * Number(sup.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-between items-center bg-slate-50 p-2 rounded text-xs">
                <span className="font-bold text-slate-800">Standard Wooden Pallet (48x40)</span>
                <span className="text-slate-500">Qty: <strong>1</strong></span>
                <span className="font-bold text-slate-900">$15.00</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-3">
          <button type="button" onClick={onClose} className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

