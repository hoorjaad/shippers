import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./componants/layout/Layout";
import Orders from "./pages/Orders";
import Ship from "./pages/Ship";
import Shipments from "./pages/Shipments";
import Finances from "./pages/Finances";
import Tickets from "./pages/Tickets";
import Carriers from "./pages/Carriers";
import Products from "./pages/Products";
import Packages from "./pages/Packages";
import MarketPlaces from "./pages/MarketPlaces";
import ShippingSupplies from "./pages/ShippingSupplies";

import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Ship />} />
        <Route path="ship" element={<Ship />} />
        <Route path="orders" element={<Orders />} />
        <Route path="shipments" element={<Shipments />} />
        <Route path="finances" element={<Finances />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="carriers" element={<Carriers />} />
        <Route path="products" element={<Products />} />
        <Route path="packages" element={<Packages />} />
        <Route path="marketplaces" element={<MarketPlaces />} />
        <Route path="shipping-supplies" element={<ShippingSupplies />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
      </Route>
    </Routes>
  );
}
