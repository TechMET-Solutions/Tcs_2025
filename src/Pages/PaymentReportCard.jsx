import { Wallet, CalendarDays, Download } from "lucide-react";
import { useState } from "react";
import { BASEURL } from "../Component/API/Url";

export default function PaymentReportCard() {
  const cardStyle =
    "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col";
  const selectStyle =
    "bg-gray-50 border border-gray-200 text-gray-700 text-[12px] rounded-lg block p-1.5 outline-none";
  const iconBox = "p-2 bg-orange-50 rounded-lg text-orange-600";

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const downloadExcel = async () => {
    if (!month || !year) {
      alert("Please select Month & Year");
      return;
    }

    const url = `${BASEURL}/api/dashboard/api/payments/export?month=${month}&year=${year}`;
    const res = await fetch(url);
    const blob = await res.blob();

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = `payment_report_${month}_${year}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={cardStyle}>
      <div className="flex items-center gap-3 mb-4">
        <div className={iconBox}>
          <Wallet size={20} />
        </div>
        <h3 className="font-bold text-slate-700">Payment Report</h3>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <select className={selectStyle} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Month</option>
          <option value="1">Jan</option>
          <option value="2">Feb</option>
          <option value="3">Mar</option>
          <option value="4">Apr</option>
          <option value="5">May</option>
          <option value="6">Jun</option>
          <option value="7">Jul</option>
          <option value="8">Aug</option>
          <option value="9">Sep</option>
          <option value="10">Oct</option>
          <option value="11">Nov</option>
          <option value="12">Dec</option>
        </select>

        <select className={selectStyle} onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>

        <button
          onClick={downloadExcel}
          className="ml-auto p-2 text-orange-600 hover:bg-orange-50 rounded-full"
          title="Download Excel"
        >
          <Download size={18} />
        </button>
      </div>

      {/* Display Box (UI only) */}
      
    </div>
  );
}
