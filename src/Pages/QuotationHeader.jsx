import React, { useState } from 'react';
import { FileText, Search, Bell, Check, X, CreditCard } from 'lucide-react';

const QuotationHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // Example data based on your database structure
  const [requests, setRequests] = useState([
    { id: 1, name: "Sumit Pathak", amount: "5000", date: "2025-11-27", status: "pending" },
    { id: 2, name: "Yogesh", amount: "1200", date: "2025-12-18", status: "pending" }
  ]);

  const handleStatusUpdate = (id, newStatus) => {
    // Here you would call your API (e.g., /api/payment/status)
    setRequests(requests.filter(req => req.id !== id));
    console.log(`Request ${id} marked as ${newStatus}`);
  };

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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-200"
          >
            <Bell size={20} />
            <span className="hidden sm:inline">Requests</span>
            {requests.length > 0 && (
              <span className="bg-white text-orange-500 px-2 py-0.5 rounded-full text-xs">
                {requests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[30px] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><CreditCard size={20}/></div>
                <h2 className="text-xl font-bold text-slate-800">Payment Requests</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[400px] overflow-y-auto">
              {requests.length === 0 ? (
                <p className="text-center text-slate-400 py-10">No pending requests found.</p>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <div>
                        <h4 className="font-bold text-slate-800">{req.name}</h4>
                        <p className="text-xs text-slate-500">{req.date} • <span className="font-bold text-orange-600">₹{req.amount}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(req.id, 'rejected')}
                          className="p-2 bg-white text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors shadow-sm"
                        >
                          <X size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(req.id, 'approved')}
                          className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-md shadow-green-100"
                        >
                          <Check size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50/50 rounded-b-[30px] text-center">
              <button onClick={() => setIsModalOpen(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
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