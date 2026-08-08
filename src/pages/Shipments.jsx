import React, { useState, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiEye,
  FiFileText,
  FiPrinter,
  FiX,
  FiMapPin,
  FiPackage,
  FiColumns,
  FiPlus,
} from "react-icons/fi";
import { fetchShipments } from "../utils/shipmentStorage";
import HajexBoltInvoice from "../componants/invoice/HajexBoltInvoice";

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

const ALL_SHIPMENT_COLUMNS = [
  { id: "id", label: "#" },
  { id: "carrier", label: "Carrier" },
  { id: "type", label: "Type" },
  { id: "service", label: "Service" },
  { id: "status", label: "Status" },
  { id: "ticket", label: "Ticket" },
  { id: "referenceId", label: "Reference ID" },
  { id: "pickupId", label: "Pickup ID" },
  { id: "boltTrackingId", label: "Bolt Tracking ID" },
  { id: "carrierTrackingId", label: "Carrier Tracking ID" },
  { id: "deliveryDate", label: "Delivery" },
  { id: "pickupDate", label: "Pickup" },
  { id: "estDeliveryDate", label: "Est. Delivery Date" },
  { id: "paymentStatus", label: "Payment Status" },
  { id: "weight", label: "Weight" },
  { id: "customerName", label: "Customer Name" },
  { id: "pickupCity", label: "Pickup City" },
  { id: "pickupAddress", label: "Pickup Address" },
];

const MOCK_HAJEX_SHIPMENTS = [
  {
    id: "1071",
    carrier: "Vitran",
    type: "Hajex",
    service: "Regular",
    status: "Creation",
    referenceId: "HR62878516U165",
    pickupId: "MTL20260727P00016",
    boltTrackingId: "HB62878516U165",
    carrierTrackingId: "MTL20250727P00016",
    deliveryDate: "2026-08-02",
    pickupDate: "2026-07-29 09:00-16:00",
    estDeliveryDate: "2026-08-02",
    paymentStatus: "Paid",
    internalStatus: "—",
    weight: 489,
    customerName: "Hajex Delta",
    pickupCity: "Anjou",
    pickupAddress: "Hajex Fitness Montreal, Chemin Saint Francois, QC, Canada",
    total: 345.50,
  },
  {
    id: "1070",
    carrier: "Vitran",
    type: "Hajex",
    service: "Regular",
    status: "Creation",
    referenceId: "HR62878516U166",
    pickupId: "MTL20260727P00015",
    boltTrackingId: "HB62878516U166",
    carrierTrackingId: "MTL20250727P00015",
    deliveryDate: "2026-08-02",
    pickupDate: "2026-07-28 09:00-16:00",
    estDeliveryDate: "2026-08-02",
    paymentStatus: "Paid",
    internalStatus: "—",
    weight: 489,
    customerName: "Hajex Delta",
    pickupCity: "Anjou",
    pickupAddress: "Hajex Fitness Montreal, Chemin Saint Francois, QC, Canada",
    total: 280.00,
  },
  {
    id: "1068",
    carrier: "Vitran",
    type: "Hajex",
    service: "Regular",
    status: "Creation",
    referenceId: "HR94754632U165",
    pickupId: "MTL20260727P00013",
    boltTrackingId: "HB94754632U165",
    carrierTrackingId: "MTL20250727P00013",
    deliveryDate: "2026-08-02",
    pickupDate: "2026-07-28 09:00-16:00",
    estDeliveryDate: "2026-08-02",
    paymentStatus: "Paid",
    internalStatus: "—",
    weight: 489,
    customerName: "Hajex Delta",
    pickupCity: "Anjou",
    pickupAddress: "Hajex Fitness Montreal, Chemin Saint Francois, QC, Canada",
    total: 512.20,
  },
  {
    id: "1057",
    carrier: "M-O",
    type: "Hajex",
    service: "REGULAR DRY",
    status: "Creation",
    referenceId: "HR96759272U348",
    pickupId: "F7780732",
    boltTrackingId: "HB96759272U348",
    carrierTrackingId: "F7780732",
    deliveryDate: "2026-08-05",
    pickupDate: "2026-07-28 09:00-16:00",
    estDeliveryDate: "2026-08-05",
    paymentStatus: "Paid",
    internalStatus: "—",
    weight: 20,
    customerName: "Hajex Delta",
    pickupCity: "Anjou",
    pickupAddress: "Hajex Fitness Montreal, Chemin Saint Francois, QC, Canada",
    total: 195.00,
  },
  {
    id: "1055",
    carrier: "UPS",
    type: "Hajex",
    service: "UPS Standard",
    status: "Creation",
    referenceId: "small test 11",
    pickupId: "—",
    boltTrackingId: "HB23376423U165",
    carrierTrackingId: "1ZXXXXXXXXXXXXXXXX",
    deliveryDate: "2026-08-04",
    pickupDate: "Arrange Pickup ✏️",
    estDeliveryDate: "2026-08-04",
    paymentStatus: "Paid",
    internalStatus: "—",
    weight: 10,
    customerName: "Hajex Delta",
    pickupCity: "Anjou",
    pickupAddress: "Hajex Fitness Montreal, Chemin Saint Francois, QC, Canada",
    total: 124.80,
  },
];

export default function Shipments() {
  const [dbShipments, setDbShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Carriers");
  const [search, setSearch] = useState("");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    ALL_SHIPMENT_COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );

  const [viewOrderModal, setViewOrderModal] = useState(null);
  const [viewInvoiceModal, setViewInvoiceModal] = useState(null);
  const [viewLabelModal, setViewLabelModal] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchShipments();
      setDbShipments(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  // Close dropdown on outside click
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

  const shipments = useMemo(() => {
    const dbMapped = dbShipments.map((item, index) => ({
      id: String(1080 + index),
      carrier: item.quote?.carrier || "DHL",
      type: "Hajex",
      service: item.quote?.service || "Express Worldwide",
      status: item.status || "Booked",
      referenceId: item.order_number || item.orderNumber || `HX-${Date.now().toString().slice(-6)}`,
      pickupId: `MTL20260727P000${index + 10}`,
      boltTrackingId: item.tracking_number || item.trackingNumber || `HB${Date.now().toString().slice(-8)}`,
      carrierTrackingId: `1Z${Date.now().toString().slice(-12)}`,
      deliveryDate: "2026-08-05",
      pickupDate: "2026-07-29 09:00-16:00",
      estDeliveryDate: "2026-08-05",
      paymentStatus: "Paid",
      internalStatus: "—",
      weight: (item.packages || []).reduce((acc, p) => acc + (Number(p.weight) || 0), 0) || 15,
      customerName: item.delivery_address?.name || item.deliveryAddress?.name || "Hajex Delta",
      pickupCity: item.pickup_address?.city || item.pickupAddress?.city || "Anjou",
      pickupAddress: item.pickup_address?.address || item.pickupAddress?.address || "Hajex Fitness Montreal, QC, Canada",
      total: item.total || item.quote?.price || 150,
      originalData: item,
    }));

    return [...dbMapped, ...MOCK_HAJEX_SHIPMENTS];
  }, [dbShipments]);

  const filteredShipments = useMemo(() => {
    let result = shipments;

    if (activeTab === "Hajex Carriers") {
      result = result.filter((s) => s.type === "Hajex");
    } else if (activeTab === "Custom Carriers") {
      result = result.filter((s) => s.carrier === "Vitran" || s.carrier === "M-O");
    } else if (activeTab === "Truckers") {
      result = result.filter((s) => s.service.toLowerCase().includes("dry") || s.weight > 100);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((s) =>
        [
          s.id,
          s.carrier,
          s.service,
          s.referenceId,
          s.boltTrackingId,
          s.carrierTrackingId,
          s.customerName,
          s.pickupCity,
          s.pickupAddress,
        ].some((val) => String(val || "").toLowerCase().includes(query))
      );
    }

    return result;
  }, [shipments, activeTab, search]);

  const toggleColumn = (colId) => {
    setVisibleColumns((prev) => ({ ...prev, [colId]: !prev[colId] }));
  };

  const activeColumnCount = Object.values(visibleColumns).filter(Boolean).length;

  return (
    <section className="mx-auto w-full font-sans text-xs">
      {/* Sub Navigation Tabs */}
      <div className="mb-3 flex items-center gap-1 border-b border-slate-200 text-xs font-semibold text-slate-600">
        {["All Carriers", "Hajex Carriers", "Custom Carriers", "Truckers"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-3 py-2 transition ${
              activeTab === tab
                ? "border-blue-600 font-bold text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Feature Notice Banner */}
      <div className="mb-3 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-1.5 text-xs text-amber-900 shadow-sm">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-amber-600 font-bold">✨ New feature:</span>
          <span>Upload required documents directly for UPS international shipments.</span>
        </div>
      </div>

      {/* Title Toolbar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold text-slate-900">Shipments</h1>

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
                    onClick={() => setVisibleColumns(ALL_SHIPMENT_COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {}))}
                    className="text-[10px] font-semibold text-blue-600 hover:underline"
                  >
                    Select All
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 px-1">
                  {ALL_SHIPMENT_COLUMNS.map((col) => (
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
        </div>

        <div className="relative min-w-[260px]">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Shipments"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 shadow-sm transition"
          />
        </div>
      </div>

      {/* Dynamic Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading shipments database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] leading-snug">
              <thead className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  {visibleColumns.id && <th className="px-2.5 py-2">#</th>}
                  {visibleColumns.carrier && <th className="px-2.5 py-2">Carrier</th>}
                  {visibleColumns.type && <th className="px-2.5 py-2">Type</th>}
                  {visibleColumns.service && <th className="px-2.5 py-2">Service</th>}
                  {visibleColumns.status && <th className="px-2.5 py-2">Status</th>}
                  {visibleColumns.ticket && <th className="px-2.5 py-2">Ticket</th>}
                  {visibleColumns.referenceId && <th className="px-2.5 py-2">Reference ID</th>}
                  {visibleColumns.pickupId && <th className="px-2.5 py-2">Pickup ID</th>}
                  {visibleColumns.boltTrackingId && <th className="px-2.5 py-2">Bolt Tracking ID</th>}
                  {visibleColumns.carrierTrackingId && <th className="px-2.5 py-2">Carrier Tracking ID</th>}
                  {visibleColumns.deliveryDate && <th className="px-2.5 py-2">Delivery</th>}
                  {visibleColumns.pickupDate && <th className="px-2.5 py-2">Pickup</th>}
                  {visibleColumns.estDeliveryDate && <th className="px-2.5 py-2">Est. Delivery Date</th>}
                  {visibleColumns.paymentStatus && <th className="px-2.5 py-2">Payment Status</th>}
                  {visibleColumns.weight && <th className="px-2.5 py-2">Weight</th>}
                  {visibleColumns.customerName && <th className="px-2.5 py-2">Customer Name</th>}
                  {visibleColumns.pickupCity && <th className="px-2.5 py-2">Pickup City</th>}
                  {visibleColumns.pickupAddress && <th className="px-2.5 py-2">Pickup Address</th>}
                  <th className="px-2.5 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    {visibleColumns.id && <td className="px-2.5 py-2 text-slate-400 font-mono text-[10px]">{s.id}</td>}
                    {visibleColumns.carrier && (
                      <td className="px-2.5 py-2">
                        <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-black text-white uppercase">
                          {s.carrier}
                        </span>
                      </td>
                    )}
                    {visibleColumns.type && <td className="px-2.5 py-2 text-slate-600">{s.type}</td>}
                    {visibleColumns.service && <td className="px-2.5 py-2 font-medium text-slate-800">{s.service}</td>}
                    {visibleColumns.status && (
                      <td className="px-2.5 py-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          s.status === "Delivered" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${s.status === "Delivered" ? "bg-emerald-500" : "bg-amber-500"}`} />
                          {s.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.ticket && (
                      <td className="px-2.5 py-2">
                        <button
                          type="button"
                          onClick={() => setViewLabelModal(s)}
                          className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          <FiPlus size={10} /> Ticket
                        </button>
                      </td>
                    )}
                    {visibleColumns.referenceId && <td className="px-2.5 py-2 font-mono text-blue-600 font-bold">{s.referenceId}</td>}
                    {visibleColumns.pickupId && <td className="px-2.5 py-2 font-mono text-slate-500">{s.pickupId}</td>}
                    {visibleColumns.boltTrackingId && <td className="px-2.5 py-2 font-mono text-blue-600 font-bold">{s.boltTrackingId}</td>}
                    {visibleColumns.carrierTrackingId && <td className="px-2.5 py-2 font-mono text-blue-600">{s.carrierTrackingId}</td>}
                    {visibleColumns.deliveryDate && <td className="px-2.5 py-2 whitespace-nowrap text-slate-600">{s.deliveryDate}</td>}
                    {visibleColumns.pickupDate && <td className="px-2.5 py-2 whitespace-nowrap text-slate-600">{s.pickupDate}</td>}
                    {visibleColumns.estDeliveryDate && <td className="px-2.5 py-2 whitespace-nowrap text-slate-600">{s.estDeliveryDate}</td>}
                    {visibleColumns.paymentStatus && (
                      <td className="px-2.5 py-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {s.paymentStatus}
                        </span>
                      </td>
                    )}
                    {visibleColumns.weight && <td className="px-2.5 py-2 font-mono text-slate-800">{s.weight} lb</td>}
                    {visibleColumns.customerName && <td className="px-2.5 py-2 font-semibold text-slate-900 whitespace-nowrap">{s.customerName}</td>}
                    {visibleColumns.pickupCity && <td className="px-2.5 py-2 text-slate-600">{s.pickupCity}</td>}
                    {visibleColumns.pickupAddress && (
                      <td className="max-w-[200px] truncate px-2.5 py-2 text-slate-500" title={s.pickupAddress}>
                        {s.pickupAddress}
                      </td>
                    )}

                    {/* Actions Dropdown */}
                    <td className="px-2.5 py-2 text-right">
                      <div className="actions-dropdown-container relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === s.id ? null : s.id)}
                          className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                        >
                          ⋮ More
                        </button>

                        {activeDropdown === s.id && (
                          <div className="absolute right-0 top-full mt-1 z-30 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5">
                            <button
                              type="button"
                              onClick={() => {
                                setViewOrderModal(s);
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
                                setViewInvoiceModal(s);
                                setActiveDropdown(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition"
                            >
                              <FiFileText size={13} className="text-emerald-500" />
                              View Invoice
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setViewLabelModal(s);
                                setActiveDropdown(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition"
                            >
                              <FiPrinter size={13} className="text-purple-500" />
                              Print Label
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-1 font-semibold">
            <button type="button" className="rounded px-2 py-0.5 hover:bg-slate-200">&lt;</button>
            <span className="rounded bg-blue-600 px-2 py-0.5 font-bold text-white">1</span>
            <button type="button" className="rounded px-2 py-0.5 hover:bg-slate-200">2</button>
            <button type="button" className="rounded px-2 py-0.5 hover:bg-slate-200">3</button>
            <span>...</span>
            <button type="button" className="rounded px-2 py-0.5 hover:bg-slate-200">9</button>
            <button type="button" className="rounded px-2 py-0.5 hover:bg-slate-200">&gt;</button>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span>Rows per page: <strong>40</strong></span>
            <span>Total: <strong>{filteredShipments.length}</strong></span>
          </div>
        </div>
      </div>

      {/* View Order Modal */}
      {viewOrderModal && (
        <ViewOrderModal shipment={viewOrderModal} onClose={() => setViewOrderModal(null)} />
      )}

      {/* View Invoice Modal (HAJEX BOLT OFFICIAL DESIGN) */}
      {viewInvoiceModal && (
        <HajexBoltInvoice invoiceData={viewInvoiceModal} onClose={() => setViewInvoiceModal(null)} />
      )}

      {/* Print Label Modal */}
      {viewLabelModal && (
        <PrintLabelModal shipment={viewLabelModal} onClose={() => setViewLabelModal(null)} />
      )}
    </section>
  );
}

/* VIEW ORDER MODAL */
function ViewOrderModal({ shipment, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FiPackage size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Shipment Order #{shipment.referenceId}</h2>
              <p className="text-xs text-slate-500">Bolt Tracking: {shipment.boltTrackingId}</p>
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
                <FiMapPin /> Pickup Location
              </p>
              <p className="font-bold text-slate-900">{shipment.customerName}</p>
              <p className="mt-1">{shipment.pickupAddress}</p>
              <p className="text-slate-500">{shipment.pickupCity}, Canada</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-600 mb-2">
                <FiMapPin /> Delivery Location
              </p>
              <p className="font-bold text-slate-900">Destination Address</p>
              <p className="mt-1">Main Fulfillment Center</p>
              <p className="text-slate-500">Scheduled: {shipment.deliveryDate}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Shipment Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-lg bg-slate-50 p-2"><span className="block text-[9px] text-slate-400 font-bold">CARRIER</span><span className="font-bold">{shipment.carrier}</span></div>
              <div className="rounded-lg bg-slate-50 p-2"><span className="block text-[9px] text-slate-400 font-bold">SERVICE</span><span className="font-bold">{shipment.service}</span></div>
              <div className="rounded-lg bg-slate-50 p-2"><span className="block text-[9px] text-slate-400 font-bold">WEIGHT</span><span className="font-bold">{shipment.weight} lb</span></div>
              <div className="rounded-lg bg-slate-50 p-2"><span className="block text-[9px] text-slate-400 font-bold">TOTAL</span><span className="font-black text-slate-900">{formatMoney(shipment.total)}</span></div>
            </div>
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


/* PRINT LABEL MODAL */
function PrintLabelModal({ shipment, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2">
            <FiPrinter className="text-purple-600" size={20} />
            <h2 className="text-base font-bold text-slate-900">Thermal Shipping Label</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200">
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-[360px] rounded-lg border-2 border-slate-900 bg-white p-4 font-mono text-slate-900 shadow-md">
            <div className="flex justify-between border-b-4 border-slate-900 pb-2">
              <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-black text-white">{shipment.carrier}</span>
              <span className="text-xs font-bold uppercase">{shipment.service}</span>
            </div>

            <div className="border-b-2 border-slate-900 py-3 text-[11px] leading-tight">
              <p className="text-[9px] font-bold text-slate-400 uppercase">SHIP TO:</p>
              <p className="font-extrabold">{shipment.customerName}</p>
              <p>{shipment.pickupAddress}</p>
              <p>{shipment.pickupCity}, Canada</p>
            </div>

            <div className="my-3 text-center">
              <p className="text-[9px] text-slate-400 font-bold">BOLT TRACKING</p>
              <p className="text-sm font-black tracking-widest">{shipment.boltTrackingId}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
            Cancel
          </button>
          <button type="button" onClick={handlePrint} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700">
            <FiPrinter size={14} /> Print Label
          </button>
        </div>
      </div>
    </div>
  );
}
