import { FileText, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../utils/AuthContext";

const QuotationHeader = ({ fetchQuotations }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);
  const { permissions, user, loading, role } = useAuth();

  return (
    <div className="relative">
      {/* --- HEADER SECTION --- */}
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
          <div className="flex items-center gap-3 w-full md:w-80 px-5 py-3 rounded-2xl border bg-slate-50 border-slate-100 focus-within:border-orange-300 focus-within:bg-white transition-all">
            <Search size={20} className="text-slate-400" />
            <input
              className="outline-none w-full bg-transparent font-medium text-sm"
              placeholder="Search client..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);

                // Call API with search term
                fetchQuotations(1, value); // always start from page 1 when searching
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationHeader;
