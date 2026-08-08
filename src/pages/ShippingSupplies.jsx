import { supplies } from "../data/supplies";
import ProductCard from "../componants/store/ProductCard";
function ShippingSupplies() {
  return (
    <main className="min-h-screen bg-gray-50 px-1 py-4 sm:px-2 sm:py-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Hajex Store</p>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Shipping Supplies</h1>
        <p className="mt-1 text-sm text-slate-500">Boxes, mailers, labels, and packing essentials for every shipment.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {supplies.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

export default ShippingSupplies;
