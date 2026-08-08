import React, { useRef } from "react";
import { FiPrinter, FiCheckCircle, FiRotateCcw } from "react-icons/fi";

export default function PrintLabel({ formData, onReset }) {
  const labelRef = useRef(null);
  const booking = formData.booking;

  const trackingNumber = booking?.trackingNumber || booking?.tracking_number || "TRK88492019";
  const orderNumber = booking?.orderNumber || booking?.order_number || "HX-99382104";
  const carrier = formData.selectedQuote?.carrier || "DHL";
  const service = formData.selectedQuote?.service || "Express Worldwide";
  
  const pickup = formData.pickupAddress || {};
  const delivery = formData.deliveryAddress || {};
  const packages = formData.packages || [];
  const totalWeight = packages.reduce((acc, p) => acc + (Number(p.weight) || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Shipment Successfully Booked!</h2>
              <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                Ready to Print
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600">
              Tracking Number: <span className="font-mono font-bold text-slate-900">{trackingNumber}</span> · Order: <span className="font-mono font-bold text-slate-900">{orderNumber}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition"
          >
            <FiPrinter size={15} />
            Print Shipping Label
          </button>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <FiRotateCcw size={13} />
              New Shipment
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Printable Label View Container */}
        <div className="flex flex-col items-center">
          <div className="mb-2 flex w-full max-w-[420px] items-center justify-between text-xs font-semibold text-slate-500">
            <span>Label Preview (4" × 6" Standard Thermal)</span>
            <span className="text-[10px] text-slate-400">100mm × 150mm</span>
          </div>

          {/* Authentic Shipping Label (Target for Print CSS) */}
          <div
            ref={labelRef}
            className="printable-label relative w-full max-w-[420px] select-none rounded-lg border-2 border-slate-900 bg-white p-4 font-mono text-slate-900 shadow-lg"
            style={{ minHeight: "560px" }}
          >
            {/* Top Bar: Carrier Logo & Service Level */}
            <div className="flex items-center justify-between border-b-4 border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-slate-900 px-2 py-1 text-sm font-black tracking-wider text-white">
                  {carrier.toUpperCase()}
                </span>
                <span className="text-xs font-bold uppercase tracking-tight text-slate-700">
                  {service}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-500">POSTAGE PAID</span>
                <span className="text-xs font-black text-slate-900">PRIORITY PARCEL</span>
              </div>
            </div>

            {/* Shipper & Receiver Details */}
            <div className="grid border-b-2 border-slate-900 py-3 text-[11px] leading-tight">
              <div className="border-b border-slate-300 pb-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">FROM (SHIPPER):</p>
                <p className="font-bold text-slate-900">{pickup.name || "HAJEX LOGISTICS DEPT"}</p>
                <p className="text-slate-700">{pickup.address || "100 Logistics Way, Suite 400"}</p>
                <p className="text-slate-700">
                  {[pickup.city, pickup.state, pickup.postalCode, pickup.country].filter(Boolean).join(", ")}
                </p>
                {pickup.phone && <p className="text-[10px] text-slate-500">TEL: {pickup.phone}</p>}
              </div>

              <div className="pt-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">SHIP TO (CONSIGNEE):</p>
                <p className="text-sm font-black text-slate-900">{delivery.name || "RECIPIENT NAME"}</p>
                <p className="text-xs font-bold text-slate-800">{delivery.company || ""}</p>
                <p className="text-xs font-bold text-slate-900">{delivery.address || "Destination Address"}</p>
                <p className="text-xs font-extrabold uppercase text-slate-900">
                  {[delivery.city, delivery.state, delivery.postalCode, delivery.country].filter(Boolean).join(", ")}
                </p>
                {delivery.phone && <p className="text-[10px] text-slate-600">TEL: {delivery.phone}</p>}
              </div>
            </div>

            {/* Shipment Metadata Bar */}
            <div className="grid grid-cols-3 border-b-2 border-slate-900 bg-slate-50 text-center text-[10px] font-bold uppercase divide-x-2 divide-slate-900">
              <div className="py-1.5">
                <span className="block text-[8px] text-slate-400">WEIGHT</span>
                <span>{totalWeight ? `${totalWeight.toFixed(1)} LBS` : "1.0 LBS"}</span>
              </div>
              <div className="py-1.5">
                <span className="block text-[8px] text-slate-400">PACKAGES</span>
                <span>1 OF {packages.length || 1}</span>
              </div>
              <div className="py-1.5">
                <span className="block text-[8px] text-slate-400">DATE</span>
                <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            </div>

            {/* Tracking Barcode Area */}
            <div className="my-4 text-center">
              <p className="mb-1 text-[9px] font-bold tracking-widest text-slate-500">TRACKING NUMBER</p>
              {/* Simulated SVG Barcode Code128 */}
              <div className="mx-auto flex h-16 w-full max-w-[320px] items-center justify-center bg-slate-900 p-1">
                <svg className="h-full w-full fill-white" viewBox="0 0 240 60" preserveAspectRatio="none">
                  {/* Barcode lines */}
                  <rect x="5" y="5" width="4" height="50" />
                  <rect x="12" y="5" width="2" height="50" />
                  <rect x="17" y="5" width="6" height="50" />
                  <rect x="26" y="5" width="2" height="50" />
                  <rect x="31" y="5" width="8" height="50" />
                  <rect x="42" y="5" width="3" height="50" />
                  <rect x="48" y="5" width="5" height="50" />
                  <rect x="56" y="5" width="2" height="50" />
                  <rect x="61" y="5" width="7" height="50" />
                  <rect x="71" y="5" width="3" height="50" />
                  <rect x="77" y="5" width="4" height="50" />
                  <rect x="84" y="5" width="2" height="50" />
                  <rect x="89" y="5" width="8" height="50" />
                  <rect x="100" y="5" width="3" height="50" />
                  <rect x="106" y="5" width="5" height="50" />
                  <rect x="114" y="5" width="2" height="50" />
                  <rect x="119" y="5" width="6" height="50" />
                  <rect x="128" y="5" width="4" height="50" />
                  <rect x="135" y="5" width="2" height="50" />
                  <rect x="140" y="5" width="7" height="50" />
                  <rect x="150" y="5" width="3" height="50" />
                  <rect x="156" y="5" width="5" height="50" />
                  <rect x="164" y="5" width="2" height="50" />
                  <rect x="169" y="5" width="8" height="50" />
                  <rect x="180" y="5" width="3" height="50" />
                  <rect x="186" y="5" width="6" height="50" />
                  <rect x="195" y="5" width="2" height="50" />
                  <rect x="200" y="5" width="7" height="50" />
                  <rect x="210" y="5" width="4" height="50" />
                  <rect x="217" y="5" width="2" height="50" />
                  <rect x="222" y="5" width="6" height="50" />
                  <rect x="231" y="5" width="4" height="50" />
                </svg>
              </div>
              <p className="mt-1 text-sm font-black tracking-widest text-slate-900">{trackingNumber}</p>
            </div>

            {/* QR Code & Routing Information */}
            <div className="flex items-center justify-between border-t-2 border-slate-900 pt-3">
              <div>
                <p className="text-[9px] font-bold text-slate-400">REF: {orderNumber}</p>
                <p className="text-[10px] font-bold text-slate-700">ZONE: INT-A1</p>
                <p className="text-xs font-black text-slate-900">SORT CODE: 90210-HX</p>
              </div>

              {/* Simulated QR Code */}
              <div className="flex h-14 w-14 items-center justify-center rounded border border-slate-900 bg-slate-100 p-1">
                <svg className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm9-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm13-2h3v3h-3v-3zm0 5h3v3h-3v-3zm-5-5h3v8h-3v-8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Next Steps */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Summary & Instructions</h3>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">1</span>
                <span>Print this label on a standard 4" × 6" thermal sticker paper or standard paper.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">2</span>
                <span>Attach the label securely on the largest surface of your package.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">3</span>
                <span>Schedule a carrier pickup or drop off at any authorized {carrier} center.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Shipment Details</h3>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Carrier:</span>
                <span className="font-semibold text-slate-900">{carrier}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-900">{service}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Package Count:</span>
                <span className="font-semibold text-slate-900">{packages.length || 1} Item(s)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Total Weight:</span>
                <span className="font-semibold text-slate-900">{totalWeight.toFixed(2)} lbs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
