import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiBox,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiTruck,
  FiX,
} from "react-icons/fi";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
} from "../../store/cartSlice";

export default function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.cart.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const continueTo = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className={`fixed inset-0 z-[80] bg-slate-950/35 backdrop-blur-[1px] transition-opacity duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />
      <aside
        aria-hidden={!open}
        className={`fixed bottom-0 right-0 top-0 z-[90] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Shipping Supplies</h2>
            <p className="text-xs text-slate-500">{itemCount} {itemCount === 1 ? "item" : "items"} selected</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800">
            <FiX size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500"><FiShoppingBag size={25} /></span>
            <h3 className="mt-4 text-base font-bold text-slate-900">No supplies selected</h3>
            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Add boxes, labels, tape, or packing materials from Shipping Supplies.</p>
            <button type="button" onClick={() => continueTo("/shipping-supplies")} className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700">Browse Supplies</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50/70 p-4">
              {items.map((item) => (
                <article key={item.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50">
                    <FiBox className="absolute text-slate-200" size={21} />
                    <img src={item.image} alt={item.name} onError={(event) => { event.currentTarget.style.display = "none"; }} className="relative h-12 w-12 object-contain p-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0"><h3 className="truncate text-xs font-bold text-slate-900">{item.name}</h3><p className="text-[10px] text-slate-500">${item.price.toFixed(2)} each</p></div>
                      <button type="button" onClick={() => dispatch(removeFromCart(item.id))} className="text-slate-400 hover:text-red-600"><FiTrash2 size={14} /></button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-md border border-slate-200">
                        <button type="button" onClick={() => dispatch(decreaseQuantity(item.id))} className="flex h-7 w-7 items-center justify-center hover:bg-slate-50"><FiMinus size={11} /></button>
                        <span className="min-w-7 text-center text-[11px] font-bold">{item.quantity}</span>
                        <button type="button" onClick={() => dispatch(addToCart(item))} className="flex h-7 w-7 items-center justify-center text-blue-600 hover:bg-blue-50"><FiPlus size={11} /></button>
                      </div>
                      <span className="text-xs font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between"><span className="text-sm font-semibold text-slate-600">Supplies subtotal</span><span className="text-xl font-black text-slate-900">${subtotal.toFixed(2)}</span></div>
              <button type="button" onClick={() => continueTo("/ship")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 hover:bg-blue-700">
                <FiTruck size={16} /> Add to Shipment Invoice
              </button>
              <button type="button" onClick={() => continueTo("/checkout")} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                Checkout Now
              </button>
              <p className="mt-3 text-center text-[10px] text-slate-400">Shipment invoice adds these items to your booking bill.</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
