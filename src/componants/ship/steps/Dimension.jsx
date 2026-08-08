import React from "react";
import {
  FiCheck,
  FiCopy,
  FiPackage,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import ShipmentSuppliesTable from "./ShipmentSuppliesTable";

const dimensionFields = ["length", "width", "height"];
const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function Dimension({
  packages,
  updatePackage,
  savePackage,
  duplicatePackage,
  deletePackage,
  addPackage,
}) {
  const totalWeight = packages.reduce(
    (total, item) => total + (Number(item.weight) || 0),
    0,
  );

  return (
    <div className="space-y-4">
      {/* PACKAGES SECTION */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <FiPackage size={17} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900">My Packages</h2>
              <p className="text-[11px] text-slate-500">
                Enter package size in inches and weight in pounds.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-right">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Total weight</p>
              <p className="text-xs font-bold text-slate-700">{totalWeight.toFixed(2)} lb</p>
            </div>
            <button
              type="button"
              onClick={addPackage}
              className="flex h-10 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <FiPlus size={15} />
              Add Package
            </button>
          </div>
        </div>

        <div className="hidden grid-cols-[32px_1fr_1.7fr_0.65fr_1fr_1.35fr] gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 md:grid">
          <span>#</span>
          <span>Package name</span>
          <span>Size</span>
          <span>Weight</span>
          <span>Description</span>
          <span>Action</span>
        </div>

        {packages.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-10 text-center">
            <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FiPackage size={20} />
            </span>
            <p className="text-sm font-semibold text-slate-700">No packages added</p>
            <p className="mt-0.5 text-xs text-slate-500">Add a package to enter its size and weight.</p>
            <button type="button" onClick={addPackage} className="mt-3 flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50">
              <FiPlus size={14} /> Add Package
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {packages.map((item, index) => {
              const isValid =
                item.name.trim() &&
                Number(item.length) > 0 &&
                Number(item.width) > 0 &&
                Number(item.height) > 0 &&
                Number(item.weight) > 0;

              return (
                <div
                  key={item.id}
                  className={`relative grid gap-3 p-4 transition-colors md:grid-cols-[32px_1fr_1.7fr_0.65fr_1fr_1.35fr] md:items-end ${
                    item.saved ? "bg-emerald-50/30" : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="hidden h-9 items-center justify-center self-end rounded-lg bg-slate-100 text-xs font-bold text-slate-500 md:flex">
                    {index + 1}
                  </div>

                  <label className="text-[10px] font-medium text-slate-500">
                    <span className="flex items-center justify-between font-bold uppercase md:hidden">
                      Package name
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">
                        #{index + 1}
                      </span>
                    </span>
                    <span className="hidden md:inline">Name</span>
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(event) => updatePackage(item.id, event)}
                      placeholder={`Package ${index + 1}`}
                      className={inputClass}
                    />
                  </label>

                  <div>
                    <div className="mb-1 flex items-center justify-between md:hidden">
                      <span className="text-[10px] font-bold uppercase text-slate-500">Size</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {dimensionFields.map((field) => (
                        <label key={field} className="text-[10px] font-medium capitalize text-slate-500">
                          {field}
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            name={field}
                            value={item[field]}
                            onChange={(event) => updatePackage(item.id, event)}
                            placeholder="0.00"
                            className={inputClass}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="text-[10px] font-medium text-slate-500">
                    <span className="font-bold uppercase md:hidden">Weight</span>
                    <span className="hidden md:inline">lb</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="weight"
                      value={item.weight}
                      onChange={(event) => updatePackage(item.id, event)}
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </label>

                  <label className="text-[10px] font-medium text-slate-500">
                    <span className="font-bold uppercase md:hidden">Description</span>
                    <span className="hidden md:inline">Contents</span>
                    <input
                      type="text"
                      name="description"
                      value={item.description}
                      onChange={(event) => updatePackage(item.id, event)}
                      placeholder="e.g. Clothing"
                      className={inputClass}
                    />
                  </label>

                  <div>
                    <span className="mb-1 block text-[10px] font-bold uppercase text-slate-500 md:hidden">
                      Action
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => savePackage(item.id)}
                        disabled={!isValid}
                        title="Save package"
                        aria-label="Save package"
                        className={`flex h-9 items-center justify-center gap-1 rounded-lg border px-2 transition disabled:cursor-not-allowed disabled:opacity-40 ${
                          item.saved
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                            : "border-blue-200 text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <FiCheck size={15} />
                        <span className="hidden text-[10px] font-semibold xl:inline">
                          {item.saved ? "Saved" : "Save"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicatePackage(item.id)}
                        title="Duplicate package"
                        aria-label="Duplicate package"
                        className="flex h-9 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 text-slate-600 transition hover:bg-slate-50"
                      >
                        <FiCopy size={15} />
                        <span className="hidden text-[10px] font-semibold xl:inline">Copy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePackage(item.id)}
                        title="Delete package"
                        aria-label="Delete package"
                        className="flex h-9 items-center justify-center gap-1 rounded-lg border border-red-200 px-2 text-red-600 transition hover:bg-red-50"
                      >
                        <FiTrash2 size={15} />
                        <span className="hidden text-[10px] font-semibold xl:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SHIPMENT SUPPLIES TABLE SECTION */}
      <ShipmentSuppliesTable />
    </div>
  );
}
