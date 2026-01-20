import { Bell, Check, CreditCard, FileText, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPendingRequests, updateRequestStatus } from '../Component/API/paymentApi';
import { useAuth } from '../utils/AuthContext';

const QuotationHeader = ({fetchQuotations}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);
 const { permissions, user, loading, role } = useAuth();

// Fetch requests whenever the modal is opened


const fetchRequests = async () => {
  try {
    const res = await getPendingRequests();
    if (res.data.success) {
      setRequests(res.data.requests);
    }
  } catch (error) {
    console.error("Error fetching requests:", error);
  }
};
useEffect(() => {
 
    fetchRequests();
 
},[]);
const handleStatusUpdate = async (requestId, status) => {
  try {
    const res = await updateRequestStatus(requestId, status);
    if (res.data.success) {
      alert(res.data.message);
      // Refresh the list locally
      setRequests(prev => prev.filter(req => req.id !== requestId));
      // Optional: if you are on the ManageQuotation page, refresh that list too
      if (typeof fetchQuotations === 'function') fetchQuotations();
    }
  } catch (error) {
    alert("Action failed: " + error.message);
  }
};
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

          {/* New Payment Request Button */}
         {(role === "admin" || role === "superadmin" || permissions?.["Quotation Management_Payment Requests"] === true) && (
  <button 
    onClick={() => setIsModalOpen(true)}
    className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-200 group"
  >
    <Bell size={20} className="group-hover:animate-bounce" />
    <span className="hidden sm:inline">Requests</span>

    {/* Notification Badge */}
    {requests.length > 0 && (
      <>
        {/* The Actual Count Badge */}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-black text-orange-600 shadow-sm">
          {requests.length > 99 ? "99+" : requests.length}
        </span>
        
        {/* Animated Ping Effect (Optional: gives a 'Live' feel) */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-600"></span>
        </span>
      </>
    )}
  </button>
)}
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
 {isModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
    <div className="bg-white w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden border border-slate-100">
      
      {/* Header - Using your Logo/Sidebar Orange */}
      <div className="bg-[#ff7300] p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CreditCard className="text-white" size={24} />
          <h2 className="text-xl font-bold text-white tracking-tight">Payment Requests</h2>
        </div>
        <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* List Content */}
      <div className="max-h-[400px] overflow-y-auto bg-white">
        {requests.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-medium">
            No pending requests found.
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {requests.map((req) => (
              <div key={req.id} className="p-5 hover:bg-slate-50 transition-colors">
                
                {/* Meta Row: ID & Date */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black bg-slate-800 text-white px-2 py-0.5 rounded uppercase">
                    Quotation #{req.quotation_id}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Client & Amount */}
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 leading-none capitalize">{req.client_name}</h4>
                    <p className="text-xs text-[#ff7300] font-bold mt-1 uppercase tracking-wider">{req.payment_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900">₹{Number(req.amount).toLocaleString()}</p>
                  </div>
                </div>

                {/* Remark */}
                {req.remark && (
                  <div className="mb-4 text-xs text-slate-500 italic bg-slate-100 p-3 rounded-lg border-l-4 border-slate-300">
                    "{req.remark}"
                  </div>
                )}

                {/* Buttons - Matching Sidebar Styles */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(req.id, 'rejected')}
                    className="flex-1 py-2.5 rounded-xl border-2 border-slate-100 text-slate-400 font-bold text-sm hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(req.id, 'approved')}
                    className="flex-[2] py-2.5 rounded-xl bg-[#ff7300] text-white font-bold text-sm hover:bg-[#e66700] shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                  >
                    Approve Payment <Check size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
        <button 
          onClick={() => setIsModalOpen(false)} 
          className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
        >
          Close Panel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default QuotationHeader;