import { FileText, Search } from "lucide-react";
import { useState } from "react";

const QuotationHeader = ({
  fetchQuotations,
  fetchQuotationsParticularEmployee,
  quoteType, // "overall" | "self"
}) => {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState(""); // "", 1, 2, 3

  const handleFetch = (page, s, p) => {
   
    if (quoteType === "overall") {
      fetchQuotations(page, s, p);
    } else {
      fetchQuotationsParticularEmployee(page, s, p);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight underline decoration-orange-200 underline-offset-4">
              Quotations
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Inventory & Sales Control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="flex items-center gap-3 w-full md:w-72 px-5 py-3 rounded-2xl border bg-slate-50 border-slate-100 focus-within:border-orange-300 focus-within:bg-white transition-all">
            <Search size={20} className="text-slate-400" />
            <input
              className="outline-none w-full bg-transparent font-medium text-sm"
              placeholder="Search client..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                handleFetch(1, value, priority);
              }}
            />
          </div>

          {/* Priority Dropdown */}
          <select
            value={priority}
            onChange={(e) => {
              const val = e.target.value;
              setPriority(val);
              handleFetch(1, search, val);
            }}
            className="px-4 py-3 rounded-2xl border bg-slate-50 border-slate-100 font-bold text-sm outline-none"
          >
            <option value="">All Priority</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">Urgent</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default QuotationHeader;
