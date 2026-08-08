import React from "react";
import { FiCheck, FiClock, FiTruck } from "react-icons/fi";
import ShipmentSuppliesTable from "./ShipmentSuppliesTable";

const carrierStyles = {
  DHL: "bg-amber-100 text-amber-700",
  FedEx: "bg-purple-100 text-purple-700",
  UPS: "bg-orange-100 text-orange-700",
  Purolator: "bg-red-100 text-red-700",
};

export default function SelectQuote({
  quotes,
  selectedQuote,
  onSelect,
}) {
  return (
    <div className="space-y-4">
      {/* CARRIER QUOTES SECTION */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-base font-bold text-slate-900">Select a Carrier Quote</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Compare estimated shipping rates and delivery times.
          </p>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {quotes.map((quote) => {
            const isSelected = selectedQuote?.id === quote.id;

            return (
              <button
                key={quote.id}
                type="button"
                onClick={() => onSelect(quote)}
                className={`relative rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-200"
                }`}
              >
                {isSelected && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                    <FiCheck size={12} />
                  </span>
                )}
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-black ${carrierStyles[quote.carrier]}`}>
                  {quote.carrier.slice(0, 2).toUpperCase()}
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900">{quote.carrier}</h3>
                <p className="text-[11px] text-slate-500">{quote.service}</p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  ${quote.price.toFixed(2)}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><FiClock /> {quote.deliveryDays} days</span>
                  <span className="flex items-center gap-1"><FiTruck /> Tracked</span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="px-4 pb-4 text-[10px] text-slate-400">
          Demo estimates only. Final carrier rates may differ when connected to a live rating API.
        </p>
      </section>

      {/* SHIPMENT SUPPLIES TABLE SECTION */}
      <ShipmentSuppliesTable />
    </div>
  );
}
