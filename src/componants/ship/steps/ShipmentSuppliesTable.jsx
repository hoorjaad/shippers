import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiBox,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiShoppingBag,
} from "react-icons/fi";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
} from "../../../store/cartSlice";
import SuppliesDrawer from "../../store/SuppliesDrawer";

export default function ShipmentSuppliesTable() {
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <FiBox size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Shipment Supplies & Packaging Materials</h2>
              {totalQuantity > 0 && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                  {totalQuantity} Items
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Selected supplies will be included with your shipment order.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalQuantity > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-right">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Supplies Total</p>
              <p className="text-xs font-black text-emerald-600">${totalCost.toFixed(2)}</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition active:scale-95"
          >
            <FiPlus size={14} />
            <FiShoppingBag size={13} />
            Add Shipping Supplies
          </button>
        </div>
      </div>

      {/* Supplies Table */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-8 text-center bg-slate-50/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
            <FiBox size={22} />
          </div>
          <p className="text-xs font-bold text-slate-700">No shipping supplies added yet</p>
          <p className="text-[11px] text-slate-500 max-w-sm mt-0.5">
            Add pallets, shipping boxes, bubble wrap, or packing tape to prepare your shipment.
          </p>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="mt-3 flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
          >
            <FiPlus size={14} /> Browse Supplies Store
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Supply Item</th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5 text-center">Quantity</th>
                <th className="px-4 py-2.5 text-right">Unit Price</th>
                <th className="px-4 py-2.5 text-right">Total Price</th>
                <th className="px-4 py-2.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {cartItems.map((item, index) => {
                const itemTotal = item.price * item.quantity;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                            className="h-8 w-8 object-contain rounded bg-slate-100 p-0.5 border"
                          />
                        )}
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{item.name}</p>
                          <p className="text-[10px] text-slate-500">{item.size || "Standard"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-600">
                        {item.category || "Supplies"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => dispatch(decreaseQuantity(item.id))}
                          className="flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-slate-100 transition"
                        >
                          <FiMinus size={11} />
                        </button>
                        <span className="w-7 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => dispatch(addToCart(item))}
                          className="flex h-6 w-6 items-center justify-center rounded text-blue-600 hover:bg-blue-50 transition"
                        >
                          <FiPlus size={11} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-600">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-black text-slate-900">${itemTotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        title="Delete supply"
                        aria-label="Delete supply"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50 font-bold text-slate-900 text-xs">
                <td colSpan="5" className="px-4 py-3 text-right">Supplies Total Amount:</td>
                <td className="px-4 py-3 text-right font-black text-emerald-600">${totalCost.toFixed(2)}</td>
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Left Slide-In Drawer */}
      <SuppliesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </section>
  );
}
