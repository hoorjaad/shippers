import React from "react";
import { FiDownload, FiX } from "react-icons/fi";

export default function HajexBoltInvoice({ invoiceData, onClose }) {
  const data = invoiceData || {};

  const invoiceNumber = data.invoiceNumber || data.id || "I75856011U165";
  const customerId = data.customerId || "165";
  const boltTrackingId = data.boltTrackingId || data.reference || "HB53635459U165";
  const carrierTrackingId = data.carrierTrackingId || data.tracking || "MTL20260727P00016";
  const invoiceDate = data.invoiceDate || data.createdAt || "2026-07-27 01:47 PM";
  const createdBy = data.createdBy || "Shopify";
  const referenceId = data.referenceId || "—";
  const totalAmount = data.totalAmount || data.total || "325.3$";

  const shipFrom = data.shipFrom || {
    reference: "—",
    name: "Hajex Montreal",
    company: "Hajex Montreal",
    address: "Hajex Fitness Montreal, Chemin Saint François, Saint-Laurent, QC, Canada",
    country: "Canada",
    state: "Québec",
    city: "Anjou",
    zip: "H1J1T7",
    phone: "1111111111",
    email: "fdasjf@121.com",
  };

  const shipTo = data.shipTo || {
    reference: data.reference || "HB62878516U165",
    name: data.customer || "Hajex Delta",
    company: data.customer || "Hajex Delta",
    address: data.deliveryAddress?.address || "Hajex Fitness Delta, Derwent Way, Delta, BC, Canada",
    country: "Canada",
    state: "British Columbia",
    city: "Delta",
    zip: "V3M5P7",
    phone: "2222222222",
    email: "—",
  };

  const carrier = data.carrier || "Vitran";
  const service = data.service || "Regular";
  const type = data.type || "Hajex";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Floating Top Controls (Hidden during Printing) */}
        <div className="print:hidden flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-wide">HAJEX<span className="text-blue-400">BOLT</span> INVOICE PREVIEW</span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">Invoice #{invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-500 transition active:scale-95"
            >
              <FiDownload size={14} />
              Download / Print Invoice
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Printable Official 2-Page HAJEX BOLT Document Container */}
        <div className="printable-document p-6 sm:p-8 space-y-6 text-slate-900 text-xs font-sans max-h-[82vh] overflow-y-auto print:max-h-none print:overflow-visible bg-white">
          
          {/* PAGE 1 CONTENT */}
          <div className="invoice-page space-y-5">
            {/* Header Logo & Top Meta Bar */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="text-2xl font-black tracking-tight text-slate-900">
                  HAJEX<span className="text-blue-600">BOLT</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-[11px]">
                <div>
                  <p className="text-slate-500 font-semibold">Invoice Number</p>
                  <p className="font-bold text-slate-900">{invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold">Invoice Date</p>
                  <p className="font-bold text-slate-900">{invoiceDate}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold">Customer ID</p>
                  <p className="font-bold text-slate-900">{customerId}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold">Created By</p>
                  <p className="font-bold text-slate-900">{createdBy}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold">Reference ID</p>
                  <p className="font-bold text-slate-900">{referenceId}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold">Bolt Tracking ID</p>
                  <p className="font-bold text-blue-600">{boltTrackingId}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold">Carrier Tracking ID</p>
                  <p className="font-bold text-blue-600">{carrierTrackingId}</p>
                </div>
              </div>

              {/* Total Banner Cards */}
              <div className="flex flex-col gap-1 min-w-[220px]">
                <div className="rounded bg-slate-200/80 px-3 py-1.5 text-[11px] flex justify-between">
                  <span className="text-slate-600 font-semibold">Your payment is due by (Y-M-D)</span>
                  <span className="font-bold text-slate-800">—</span>
                </div>
                <div className="rounded bg-sky-200/90 px-3 py-2 text-xs flex justify-between items-center font-bold">
                  <span className="text-slate-900">Total amount of this invoice</span>
                  <span className="text-base font-black text-slate-900">{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* SHIP FROM & SHIP TO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SHIP FROM */}
              <div>
                <div className="bg-slate-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  SHIP FROM
                </div>
                <div className="p-3 text-[11px] leading-relaxed space-y-0.5 border border-t-0 border-slate-200 rounded-b">
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Reference</span><span className="font-bold">{shipFrom.reference}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Name</span><span className="font-bold">{shipFrom.name}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Company</span><span className="font-bold">{shipFrom.company}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium shrink-0">Address</span><span className="font-medium">{shipFrom.address}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Country</span><span>{shipFrom.country}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">State</span><span>{shipFrom.state}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">City</span><span>{shipFrom.city}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Zip/Postal</span><span>{shipFrom.zip}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Phone</span><span>{shipFrom.phone}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Email</span><span>{shipFrom.email}</span></div>
                </div>
              </div>

              {/* SHIP TO */}
              <div>
                <div className="bg-slate-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  SHIP TO
                </div>
                <div className="p-3 text-[11px] leading-relaxed space-y-0.5 border border-t-0 border-slate-200 rounded-b">
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Reference</span><span className="font-bold">{shipTo.reference}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Name</span><span className="font-bold">{shipTo.name}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Company</span><span className="font-bold">{shipTo.company}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium shrink-0">Address</span><span className="font-medium">{shipTo.address}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Country</span><span>{shipTo.country}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">State</span><span>{shipTo.state}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">City</span><span>{shipTo.city}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Zip/Postal</span><span>{shipTo.zip}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Phone</span><span>{shipTo.phone}</span></div>
                  <div className="flex"><span className="w-24 text-slate-500 font-medium">Email</span><span>{shipTo.email}</span></div>
                </div>
              </div>
            </div>

            {/* ADDITIONAL SERVICES */}
            <div>
              <div className="bg-slate-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800">
                ADDITIONAL SERVICES
              </div>
              <div className="grid grid-cols-5 border border-t-0 border-slate-200 p-2 text-center text-[11px]">
                <div><p className="font-bold border-b border-slate-300 pb-1 mb-1">Signature</p><p className="text-slate-600">Disabled</p></div>
                <div><p className="font-bold border-b border-slate-300 pb-1 mb-1">Residential Delivery</p><p className="text-slate-600">Disabled</p></div>
                <div><p className="font-bold border-b border-slate-300 pb-1 mb-1">Insurance</p><p className="text-slate-600">Disabled</p></div>
                <div><p className="font-bold border-b border-slate-300 pb-1 mb-1">Tailgate Pickup</p><p className="text-slate-600">Disabled</p></div>
                <div><p className="font-bold border-b border-slate-300 pb-1 mb-1">Tailgate Delivery</p><p className="text-slate-600">Disabled</p></div>
              </div>
            </div>

            {/* BILLING INFORMATION */}
            <div>
              <div className="bg-slate-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800">
                BILLING INFORMATION
              </div>
              <table className="w-full border-collapse text-center text-[11px] border border-t-0 border-slate-200">
                <thead>
                  <tr className="border-b border-slate-300 font-bold text-slate-700">
                    <th className="py-1.5 px-2">#</th>
                    <th className="py-1.5 px-2">Base</th>
                    <th className="py-1.5 px-2">Fuel</th>
                    <th className="py-1.5 px-2">Freight Charge</th>
                    <th className="py-1.5 px-2">Signature</th>
                    <th className="py-1.5 px-2">Residential</th>
                    <th className="py-1.5 px-2">Pickup Charge</th>
                    <th className="py-1.5 px-2">Sub Total</th>
                    <th className="py-1.5 px-2">GST</th>
                    <th className="py-1.5 px-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-2 font-semibold">1</td>
                    <td className="py-2 px-2 text-slate-500">—</td>
                    <td className="py-2 px-2">51.88</td>
                    <td className="py-2 px-2">146.75</td>
                    <td className="py-2 px-2">0.00</td>
                    <td className="py-2 px-2 text-slate-500">—</td>
                    <td className="py-2 px-2 text-slate-500">—</td>
                    <td className="py-2 px-2 font-bold">309.8</td>
                    <td className="py-2 px-2 font-bold">15.5</td>
                    <td className="py-2 px-2 font-black text-slate-900">325.3</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes Box */}
            <div className="rounded border border-slate-200 p-3 min-h-[50px]">
              <p className="font-bold text-[11px] text-slate-700">Notes</p>
            </div>

            {/* SHIPMENT TRACKING */}
            <div>
              <div className="bg-slate-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800">
                SHIPMENT TRACKING
              </div>
              <div className="grid grid-cols-4 border border-t-0 border-slate-200 p-2 text-[11px]">
                <div><p className="font-bold text-slate-600 mb-1">Shipment Status</p><p className="font-semibold">Creation</p></div>
                <div><p className="font-bold text-slate-600 mb-1">Status Date</p><p className="font-semibold">2026-07-27</p></div>
                <div><p className="font-bold text-slate-600 mb-1">Status Time</p><p className="font-semibold">20:47</p></div>
                <div><p className="font-bold text-slate-600 mb-1">Last Location</p><p className="text-slate-400">—</p></div>
              </div>
            </div>

            {/* SHIPMENT DETAIL */}
            <div>
              <div className="bg-slate-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800">
                SHIPMENT DETAIL
              </div>
              <div className="grid grid-cols-6 border border-t-0 border-slate-200 p-2 text-[11px]">
                <div><p className="font-bold text-slate-600 mb-1">Carrier</p><p className="font-bold text-slate-900">{carrier}</p></div>
                <div><p className="font-bold text-slate-600 mb-1">Service</p><p>{service}</p></div>
                <div><p className="font-bold text-slate-600 mb-1">Type</p><p>{type}</p></div>
                <div><p className="font-bold text-slate-600 mb-1">Pickup Ref</p><p className="font-mono text-blue-600">MTL20260727P00016</p></div>
                <div><p className="font-bold text-slate-600 mb-1">Pickup Details</p><p>2026-07-29 09:00 - 16:00</p></div>
                <div><p className="font-bold text-slate-600 mb-1">Packages</p><p className="font-bold">1</p></div>
              </div>
            </div>
          </div>

          {/* PAGE BREAK FOR PRINT */}
          <div className="my-8 border-b-2 border-dashed border-slate-300 print:break-before-page">
            <p className="text-center text-[10px] text-slate-400 -mt-2.5 bg-white px-2 inline-block font-mono">
              PAGE 2 (PACKAGES & PAYMENT REMITTANCE SLIP)
            </p>
          </div>

          {/* PAGE 2 CONTENT */}
          <div className="invoice-page space-y-6">
            {/* PACKAGES DETAIL */}
            <div>
              <div className="bg-slate-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800">
                PACKAGES DETAIL
              </div>
              <div className="border border-t-0 border-slate-200 p-2">
                <div className="text-center font-bold border-b border-blue-500 pb-1 mb-2 text-blue-600 text-xs">
                  Declared
                </div>
                <table className="w-full text-center text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-300 font-bold text-slate-700">
                      <th className="py-1">#</th>
                      <th className="py-1 text-left">Description</th>
                      <th className="py-1">Parcel ID</th>
                      <th className="py-1">Parcel Status</th>
                      <th className="py-1">Dim (LxWxH)</th>
                      <th className="py-1">Weight</th>
                      <th className="py-1">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-2">1</td>
                      <td className="py-2 text-left font-semibold">TEST PKG</td>
                      <td className="py-2 font-bold text-blue-600">N/A</td>
                      <td className="py-2 text-slate-400">—</td>
                      <td className="py-2 font-mono">48 x48 x48 (in)</td>
                      <td className="py-2 font-bold">489 (lb)</td>
                      <td className="py-2">0.11 (cbm)</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan="5" className="py-2 text-right pr-4">Total</td>
                      <td className="py-2 font-extrabold text-slate-900">489 (lb)</td>
                      <td className="py-2 font-extrabold text-slate-900">0.11 (cbm)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SHIPMENT SUPPLIES DETAIL */}
            <div>
              <div className="bg-slate-200/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800">
                SHIPMENT SUPPLIES DETAIL
              </div>
              <div className="border border-t-0 border-slate-200 p-2">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-300 font-bold text-slate-700">
                      <th className="py-1 px-2">#</th>
                      <th className="py-1 px-2">Supply Item</th>
                      <th className="py-1 px-2 text-center">Quantity</th>
                      <th className="py-1 px-2 text-right">Unit Price</th>
                      <th className="py-1 px-2 text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.supplies && data.supplies.length > 0 ? (
                      data.supplies.map((sup, idx) => (
                        <tr key={idx}>
                          <td className="py-1.5 px-2 font-semibold">{idx + 1}</td>
                          <td className="py-1.5 px-2 font-bold text-slate-900">{sup.name || sup.label || "Wooden Pallet"}</td>
                          <td className="py-1.5 px-2 text-center font-bold">{sup.quantity || sup.qty || 1}</td>
                          <td className="py-1.5 px-2 text-right">${Number(sup.price || sup.unitPrice || 15).toFixed(2)}</td>
                          <td className="py-1.5 px-2 text-right font-bold text-slate-900">
                            ${(Number(sup.price || 15) * Number(sup.quantity || 1)).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-1.5 px-2 font-semibold">1</td>
                        <td className="py-1.5 px-2 font-bold text-slate-900">Standard Freight Wooden Pallet (48x40)</td>
                        <td className="py-1.5 px-2 text-center font-bold">1</td>
                        <td className="py-1.5 px-2 text-right">$15.00</td>
                        <td className="py-1.5 px-2 text-right font-bold text-slate-900">$15.00</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dashed Cut / Perforation Line */}
            <div className="pt-6">
              <div className="border-t-2 border-dashed border-slate-400 relative">
                <span className="absolute right-0 -top-2.5 bg-white pl-2 text-[10px] text-slate-500 font-semibold">
                  Return this slip with your payment
                </span>
              </div>
            </div>

            {/* Payment Remittance Slip Footer */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-2">
              <div>
                <div className="text-2xl font-black tracking-tight text-slate-900">
                  HAJEX<span className="text-blue-600">BOLT</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
                <div><span className="text-slate-500 font-medium">Customer ID</span></div>
                <div><span className="font-bold text-slate-900">{customerId}</span></div>

                <div><span className="text-slate-500 font-medium">Invoice number</span></div>
                <div><span className="font-bold text-slate-900">{invoiceNumber}</span></div>

                <div><span className="text-slate-500 font-medium">Amount due</span></div>
                <div><span className="font-bold text-blue-600">{totalAmount}</span></div>

                <div><span className="text-slate-500 font-medium">Due date</span></div>
                <div><span className="font-bold text-slate-800">—</span></div>
              </div>
            </div>

            {/* Payment Terms & Amount Box */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_240px] border border-slate-900 rounded overflow-hidden">
              <div className="bg-sky-100/70 p-4 text-[11px] text-slate-800 leading-relaxed border-r border-slate-900">
                <p className="font-bold">Payment terms:</p>
                <p className="mt-1">
                  The net amount is due in 15 days from the invoice date. A late payment fee at a rate of 18% per year will be charged on any invoice paid after the due date.
                </p>
              </div>

              <div className="p-4 flex flex-col justify-center bg-white">
                <p className="text-[11px] font-bold text-slate-600">Amount Paid</p>
                <p className="text-2xl font-black text-slate-900 mt-1">${totalAmount.replace("$", "")}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Close Button */}
        <div className="print:hidden flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
