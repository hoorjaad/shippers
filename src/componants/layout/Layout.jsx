import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 font-sans text-gray-900 antialiased selection:bg-blue-500 selection:text-white">
      {/* Topbar Header with Horizontal Navigation */}
      <Topbar />

      {/* Main Content Area */}
      <main className="mx-auto w-full p-3">
        <Outlet />
      </main>
    </div>
  );
}
