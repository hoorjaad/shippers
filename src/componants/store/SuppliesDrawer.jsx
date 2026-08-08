import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiBox,
  FiEye,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiExternalLink,
} from "react-icons/fi";
import { supplies } from "../../data/supplies";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
} from "../../store/cartSlice";

export default function SuppliesDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  // State for View Product Modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleNavigateToSupplies = () => {
    onClose();
    navigate("/supplies");
  };

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close supplies drawer"
        onClick={onClose}
        className={`fixed inset-0 z-[80] bg-slate-950/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Slide-In Left Drawer */}
      <aside
        aria-hidden={!open}
        className={`fixed bottom-0 left-0 top-0 z-[90] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out border-r border-slate-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-4 text-white">
          <div>
            <h2 className="flex items-center gap-2 text-base font-black tracking-wide">
              <FiShoppingBag className="text-blue-400" size={18} />
              Shipping Supplies Store
            </h2>
            <p className="text-[11px] text-slate-300">Add supplies directly to your shipment</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 space-y-3">
          {supplies.map((product) => {
            const cartItem = cartItems.find((item) => item.id === product.id);

            return (
              <article
                key={product.id}
                className="flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:border-blue-300 transition"
              >
                {/* Product Thumbnail */}
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 p-1.5 overflow-hidden">
                  <FiBox className="absolute text-slate-300" size={30} />
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="relative h-full w-full object-contain"
                  />
                  {!product.inStock && (
                    <span className="absolute inset-0 flex items-center justify-center bg-white/80 text-[9px] font-bold uppercase text-red-600">
                      Out of stock
                    </span>
                  )}
                </div>

                {/* Details & Actions */}
                <div className="flex flex-1 flex-col justify-between self-stretch">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[9px] font-bold uppercase text-blue-600">{product.category}</span>
                      <span className="text-xs font-black text-slate-900">${product.price.toFixed(2)}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{product.name}</h3>
                    <p className="text-[10px] text-slate-500">{product.size}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                    {/* View Product Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-blue-600 transition"
                    >
                      <FiEye size={13} className="text-blue-500" />
                      <span>View Product</span>
                    </button>

                    {/* Add to Cart / Qty Controls */}
                    {cartItem ? (
                      <div className="flex items-center gap-1">
                        <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                          <button
                            type="button"
                            onClick={() => dispatch(decreaseQuantity(product.id))}
                            className="flex h-7 w-7 items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <FiMinus size={11} />
                          </button>
                          <span className="min-w-6 text-center text-[10px] font-black text-slate-900">
                            {cartItem.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => dispatch(addToCart(product))}
                            className="flex h-7 w-7 items-center justify-center text-blue-600 hover:bg-blue-50"
                          >
                            <FiPlus size={11} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(product.id))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={!product.inStock}
                        onClick={() => dispatch(addToCart(product))}
                        className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 disabled:opacity-40 shadow-sm transition active:scale-95"
                      >
                        <FiPlus size={12} /> Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer with 2 Action Buttons */}
        <div className="border-t border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500">Cart Subtotal ({totalCartCount} items):</span>
            <span className="text-sm font-black text-blue-600">${totalCartPrice.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Button 1: Done with supplies */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95 shadow"
            >
              <FiCheckCircle size={14} className="text-emerald-400" />
              Done with Supplies
            </button>

            {/* Button 2: View on Supplies Page */}
            <button
              type="button"
              onClick={handleNavigateToSupplies}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition active:scale-95 shadow-sm"
            >
              <FiExternalLink size={14} />
              View on Supplies Page
            </button>
          </div>
        </div>
      </aside>

      {/* VIEW PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => {
            dispatch(addToCart(selectedProduct));
          }}
        />
      )}
    </>
  );
}

/* VIEW PRODUCT DETAIL MODAL */
function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
            {product.category}
          </span>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200">
            <FiX size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-4 relative overflow-hidden">
            <FiBox className="absolute text-slate-200" size={60} />
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="relative max-h-full max-w-full object-contain"
            />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">{product.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Size / Dimensions: <strong>{product.size}</strong></p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">{product.description}</p>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Price</span>
              <span className="text-base font-black text-slate-900">${product.price.toFixed(2)}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Availability</span>
              <span className={`text-xs font-bold ${product.inStock ? "text-emerald-600" : "text-red-500"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-semibold text-slate-700"
          >
            Close
          </button>
          <button
            type="button"
            disabled={!product.inStock}
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white shadow hover:bg-blue-700 transition disabled:opacity-40"
          >
            {added ? <FiCheckCircle size={15} /> : <FiPlus size={15} />}
            {added ? "Added to Cart!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
