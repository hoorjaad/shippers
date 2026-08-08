import React from "react";
import { FiBox, FiShoppingCart } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-5">
        <FiBox className="absolute text-slate-200" size={64} />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
          className="relative z-10 h-full w-full object-contain transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 z-20 rounded-full border border-white/80 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600 shadow-sm">
          {product.category}
        </span>
        {product.featured && (
          <span className="absolute right-3 top-3 z-20 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-sm">
            Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-slate-900" title={product.name}>
              {product.name}
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
              Size: {product.size}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {product.inStock ? "In stock" : "Sold out"}
          </span>
        </div>

        <p className="line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Unit price</p>
            <p className="text-xl font-black tracking-tight text-slate-900">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => dispatch(addToCart(product))}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            <FiShoppingCart size={15} />
            {product.inStock ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
