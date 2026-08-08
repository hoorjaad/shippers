import React from "react";
import { FiCheckCircle, FiPackage, FiTrash2, FiTruck } from "react-icons/fi";

export default function BookShipment({ formData, onSubmit, supplies, removeSupply }) {
  const totalWeight = formData.packages.reduce(
    (total, item) => total + (Number(item.weight) || 0),
    0,
  );
  const booking = formData.booking;
  const suppliesTotal = supplies.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const billTotal = formData.selectedQuote.price + suppliesTotal;

  return (
    <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-900">Book Shipment</h2>
        <p className="text-xs text-slate-500">Review the shipment before submitting it.</p>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Pickup</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{formData.pickupAddress.address}</p>
          <p className="text-xs text-slate-500">{[formData.pickupAddress.city, formData.pickupAddress.state, formData.pickupAddress.country].filter(Boolean).join(", ")}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Delivery</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{formData.deliveryAddress.address}</p>
          <p className="text-xs text-slate-500">{[formData.deliveryAddress.city, formData.deliveryAddress.state, formData.deliveryAddress.country].filter(Boolean).join(", ")}</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
          <FiPackage className="text-blue-600" size={20} />
          <div><p className="text-xs font-bold text-slate-800">{formData.packages.length} package(s)</p><p className="text-[11px] text-slate-500">{totalWeight.toFixed(2)} lb total</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
          <FiTruck className="text-blue-600" size={20} />
          <div><p className="text-xs font-bold text-slate-800">{formData.selectedQuote.carrier}</p><p className="text-[11px] text-slate-500">{formData.selectedQuote.service} · ${formData.selectedQuote.price.toFixed(2)}</p></div>
        </div>
      </div>

      <div className="mx-5 mb-5 overflow-hidden rounded-lg border border-slate-200">
        <div className="grid grid-cols-[1fr_auto] bg-slate-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          <span>Bill summary</span><span>Amount</span>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between px-3 py-2.5"><span className="text-slate-600">{formData.selectedQuote.carrier} shipping</span><span className="font-semibold text-slate-900">${formData.selectedQuote.price.toFixed(2)}</span></div>
          {supplies.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <span className="min-w-0 truncate text-slate-600">{item.name} × {item.quantity}</span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                {!booking && (
                  <button type="button" onClick={() => removeSupply(item.id)} title="Remove from shipment bill" className="flex h-6 w-6 items-center justify-center rounded text-red-500 hover:bg-red-50">
                    <FiTrash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between bg-blue-50 px-3 py-3"><span className="font-bold text-blue-800">Total</span><span className="text-base font-black text-blue-800">${billTotal.toFixed(2)}</span></div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
        {booking ? (
          <div className="flex items-center gap-2 text-emerald-600">
            <FiCheckCircle size={20} />
            <div><p className="text-xs font-bold">Shipment booked</p><p className="text-[10px]">{booking.orderNumber} · {booking.trackingNumber}</p></div>
          </div>
        ) : <span className="text-xs text-slate-500">The shipment will appear in Orders and Shipments.</span>}
        <button type="button" onClick={onSubmit} disabled={Boolean(booking)} className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:bg-emerald-100 disabled:text-emerald-700">
          {booking ? "Submitted" : "Submit Shipment"}
        </button>
      </div>
    </section>
  );
}
