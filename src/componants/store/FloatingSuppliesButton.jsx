import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import SuppliesDrawer from "./SuppliesDrawer";

export default function FloatingSuppliesButton() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* FLOATING ACTION BUTTON (BOTTOM-LEFT) */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-slate-900 px-4 py-3 text-xs font-black text-white shadow-2xl ring-2 ring-blue-500/50 hover:bg-blue-600 hover:ring-blue-400 transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 group-hover:bg-white group-hover:text-blue-600 transition">
            <FiPackage size={15} />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white ring-2 ring-slate-900">
                {totalCount}
              </span>
            )}
          </div>
          <span className="tracking-wide">Add Shipping Supplies</span>
          <FiShoppingBag size={14} className="text-blue-400 group-hover:text-white" />
        </button>
      </div>

      {/* LEFT SLIDE-IN SUPPLIES DRAWER */}
      <SuppliesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
