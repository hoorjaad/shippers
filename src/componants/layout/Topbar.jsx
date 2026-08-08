import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiShoppingBag } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import {
  FiUsers,
  FiFileText,
  FiLogOut,
  FiShield,
  FiMenu,
  FiX,
  FiShoppingCart,
} from "react-icons/fi";
import { RiUserSettingsFill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import logo from "../../assets/logo.png";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineShoppingCart, MdStorage } from "react-icons/md";
import { FaDigitalTachograph, FaShippingFast, FaTrailer } from "react-icons/fa";
import { TbTicket, TbTruckDelivery } from "react-icons/tb";
import { BiPackage, BiUser } from "react-icons/bi";
import CartDrawer from "../store/CartDrawer";
const navItems = [
  { name: "Orders", path: "/orders", icon: MdOutlineShoppingCart },
  { name: "Ship", path: "/ship", icon: FaShippingFast },

  { name: "Shipments", path: "/shipments", icon: FaTrailer },
  { name: "Finances", path: "/finances", icon: FaDigitalTachograph },
  { name: "Tickets", path: "/tickets", icon: TbTicket },
  { name: "Carriers", path: "/carriers", icon: TbTruckDelivery },
  { name: "Products", path: "/products", icon: BiPackage },
  { name: "Packages", path: "/packages", icon: BiPackage },
  { name: "MarketPlaces", path: "/marketplaces", icon: MdStorage },
  {
    name: "Shipping Supplies",
    path: "/shipping-supplies",
    icon: FiShoppingBag,
  },
];
const userMenuItems = [
  { name: "Profile", path: "/profile", icon: BiUser },
  { name: "Settings", path: "/settings", icon: IoSettingsOutline },
  { name: "Users", path: "/users", icon: FiUsers },
  { name: "Privacy Policy", path: "/privacy", icon: FiShield },
  { name: "Terms & Conditions", path: "/terms", icon: FiFileText },
  { name: "Logout", path: "/logout", icon: FiLogOut },
];
export default function Topbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );
  const today = new Date();
  const monthName = today.toLocaleDateString("en-US", {
    month: "long",
  });
  const day = today.toLocaleDateString("en-US", {
    day: "numeric",
  });
  return (
    <header className="relative z-50 flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2 sm:px-4">
      {/* logo of the website */}
      <div className="flex min-w-0 items-center no-underline active">
        <NavLink
          to="/ship"
          aria-label="Go to Ship page"
          className="flex items-center no-underline"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img
            src={logo}
            alt="Hajex Bolt"
            className="h-6 w-auto max-w-32 object-contain sm:h-7 sm:max-w-40"
          />
        </NavLink>
        {/* main navigation pages */}
        <div className="hidden xl:block">
          <nav className="ml-4 flex items-center gap-1 2xl:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => {
                  return isActive
                    ? "flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    : "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-600";
                }}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* profile pages etc */}
      <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-3">
        <button
          type="button"
          aria-label={`Open cart with ${cartCount} items`}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
          onClick={() => {
            setCartOpen(true);
            setMobileMenuOpen(false);
            setUserMenuOpen(false);
          }}
        >
          <FiShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          onClick={() => {
            setMobileMenuOpen((open) => !open);
            setUserMenuOpen(false);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 xl:hidden"
        >
          {mobileMenuOpen ? <FiX size={21} /> : <FiMenu size={21} />}
        </button>
        <button
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(245, 158, 11) 0%, rgb(234, 88, 12) 100%)",
          }}
          className="relative hidden items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:brightness-105 sm:flex lg:text-[13px]"
        >
          Refer & Earn
        </button>
        <div className="hidden flex-col items-center rounded-md border border-slate-200 bg-white shadow-sm sm:flex">
          <div className="h-[40%] w-full rounded-t-md bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center px-2 py-0.5">
            <h3 className="text-[7px] font-semibold text-white uppercase tracking-wider">
              {monthName}
            </h3>
          </div>
          <h4 className="text-[11px] font-bold text-blue-600 leading-none py-1">
            {day}
          </h4>
        </div>
        <button
          type="button"
          aria-label="Open account menu"
          aria-expanded={userMenuOpen}
          onClick={() => {
            setUserMenuOpen((open) => !open);
            setMobileMenuOpen(false);
          }}
          className="flex h-9 items-center gap-1 rounded-lg px-2 text-[13px] font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-blue-600"
        >
          <RiUserSettingsFill size={20} className="text-blue-600" />
          {userMenuOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>
        {userMenuOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:w-60">
            <div className="border-b border-blue-100 px-4 py-2 text-slate-600">
              <p className="mt-0.5 text-sm font-bold tracking-tight">
                Balance: $6,019.33
              </p>
            </div>

            <div className="p-1.5">
              {userMenuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="group flex items-center gap-3 rounded-lg px-2 py-1.5 text-[13px] font-medium text-slate-600 transition-colors duration-150 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <item.icon size={16} />

                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full z-40 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b border-slate-200 bg-white p-3 shadow-xl xl:hidden"
        >
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`
                }
              >
                <item.icon size={19} className="shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
