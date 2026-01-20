import { Bell, Check, CreditCard, FileText, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPendingRequests, updateRequestStatus } from '../Component/API/paymentApi';
import { useAuth } from '../utils/AuthContext';

const QuotationHeader = ({fetchQuotations}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);
 const { permissions, user, loading, role } = useAuth();


  // Example data based on your database structure
//   const [requests, setRequests] = useState([
//     { id: 1, name: "Sumit Pathak", amount: "5000", date: "2025-11-27", status: "pending" },
//     { id: 2, name: "Yogesh", amount: "1200", date: "2025-12-18", status: "pending" }
//   ]);

//   const handleStatusUpdate = (id, newStatus) => {
//     // Here you would call your API (e.g., /api/payment/status)
//     setRequests(requests.filter(req => req.id !== id));
//     console.log(`Request ${id} marked as ${newStatus}`);
//   };

  return (
    <div className="relative">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-2xl text-orange-500"><FileText size={28} /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight underline decoration-orange-200 underline-offset-4">Quotations</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Inventory & Sales Control</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="flex items-center gap-3 w-full md:w-80 px-5 py-3 rounded-2xl border bg-slate-50 border-slate-100 focus-within:border-orange-300 focus-within:bg-white transition-all">
            <Search size={20} className="text-slate-400" />
            <input className="outline-none w-full bg-transparent font-medium text-sm" placeholder="Search client..." onChange={(e) => setSearch(e.target.value)} />
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default QuotationHeader;