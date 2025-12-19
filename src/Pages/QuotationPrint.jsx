import React from "react";

export default function QuotationPrint({ data }) {
  if (!data) return null;

  return (
    <div className="p-6 text-[14px] font-['Times New Roman'] bg-white">

      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-xl font-bold underline">Quotation</h2>
        <p className="mt-1">
          Shop no. 18, Business Bay, Shree Hari Kute Marg, Tidke Colony, Nashik – 422002 <br />
          Contact: 8847788888, 7058859999 | Email: support@theceramicstudio.in
        </p>
      </div>

      {/* CLIENT INFO */}
      <div className="mt-4">
        <p><strong>To:</strong> {data.client}</p>
        <p><strong>Date:</strong> {data.date}</p>
        <p><strong>Attended By:</strong> {data.attendedBy}</p>
      </div>

      <p className="mt-4">
        This is with reference to our discussion regarding your requirement; 
        here we quote our best price for your prestigious project:
      </p>

      {/* TABLE */}
      <table className="w-full mt-4 border text-sm">
        <thead className="bg-gray-200">
          <tr>
            {["SrNo", "Code", "Size", "Quality", "Rate", "Dis", "DisAmt", "Box", "Area", "Amount"].map(h => (
              <th key={h} className="border p-1">{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.products.map((p, i) => (
            <tr key={i} className="text-center">
              <td className="border p-1">{i + 1}</td>
              <td className="border p-1">{p.id}</td>
              <td className="border p-1">{p.size || "-"}</td>
              <td className="border p-1">{p.quality || "-"}</td>
              <td className="border p-1">{p.rate || 0}</td>
              <td className="border p-1">{p.discount || "-"}</td>
              <td className="border p-1">{p.disAmt || "-"}</td>
              <td className="border p-1">{p.boxes}</td>
              <td className="border p-1">{(p.boxes * p.coverage).toFixed(2)}</td>
              <td className="border p-1">{(p.boxes * p.rate).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="mt-4">
        <p><strong>Total:</strong> ₹ {data.total}</p>
        <p><strong>Discount:</strong> 10%</p>
        <p><strong>Discounted Amount:</strong> ₹ {(data.total * 0.10).toFixed(0)}</p>
        <p><strong>Paid Amount:</strong> ₹ {data.paid}</p>
        <p><strong>Freight Charges:</strong> ₹ 500</p>
        <p><strong>Due Amount:</strong> ₹ {data.total - data.paid - 500}</p>
      </div>

      {/* FOOTER */}
      <p className="mt-4 text-sm">
        Above rates include GST @18%. Breakage up to 3% may occur during transport.
      </p>

      <p className="mt-2"><strong>Payment Terms:</strong> 100% Advance</p>
      <p><strong>Delivery Period:</strong> 7–8 Days</p>
      <p><strong>Billing:</strong> GST @18%</p>
      <p><strong>Validity:</strong> 30 Days</p>

      {/* BANK DETAILS */}
      <div className="mt-6">
        <h3 className="font-bold underline">Bank Details</h3>
        <p>Yes Bank : THE CERAMIC STUDIO</p>
        <p>A/C No : 002163700002424</p>
        <p>Branch : Canada Corner</p>
        <p>IFSC : YESB0000021</p>
      </div>

      <p className="mt-6 font-semibold">Thank you,  
        <br />THE CERAMIC STUDIO - NASHIK
      </p>
    </div>
  );
}
