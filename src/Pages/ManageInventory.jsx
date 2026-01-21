import { Calendar, Edit3, Eye, Search, ShoppingBag, TrendingUp, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPurchaseListAPI } from "../Component/API/inventoryApi";
import { useAuth } from "../utils/AuthContext";

export default function ManageInventory() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
 const [purchases, setPurchases] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [limit] = useState(10);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
 const { permissions, user, loading, role } = useAuth(); 
  // Exact colors from your logo
  const BRAND_ORANGE = "#FF7A00"; 
  const SIDEBAR_DARK = "#1E1E1E";

const fetchData = async (page = 1) => {
  try {
    // Pass page and limit as query parameters
    const res = await getPurchaseListAPI(page, limit); 
    
    if (res.data.success) {
      setPurchases(res.data.purchases || []);
      setTotalPages(res.data.pagination.totalPages);
      setCurrentPage(res.data.pagination.currentPage);
    }
  } catch (err) { 
    console.log(err); 
  }
};

useEffect(() => {
  fetchData(currentPage);
}, [currentPage]); // Re-fetch data whenever the page number changes

  const filtered = purchases.filter((p) => {
    const q = query.toLowerCase();
    return p.bill_no?.toString().toLowerCase().includes(q) || p.client_name?.toLowerCase().includes(q);
  });

  const totalInwardValue = purchases.reduce((sum, p) => sum + Number(p.subtotal), 0);

  return (
    <div className="p-4 md:p-8 font-['Lexend'] bg-[#FAFAFA] min-h-screen text-slate-800">
      <div className="w-full mx-auto">
        
        {/* HEADER & STATS - Matching your dashboard look */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-end">
          <div className="lg:col-span-1 pb-2">
            <h1 className="text-3xl font-black text-[#1E1E1E] tracking-tight">Stock Ledger</h1>
            <p className="text-slate-500 font-medium">Manage your purchase records</p>
          </div>
          
          <div className="rounded-[24px] p-6 text-white shadow-xl flex items-center justify-between" style={{ backgroundColor: BRAND_ORANGE }}>
            <div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Total Inward Value</p>
              <h2 className="text-3xl font-black">₹ {totalInwardValue.toLocaleString()}</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl"><TrendingUp size={28}/></div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Bills</p>
              <h2 className="text-3xl font-black" style={{ color: SIDEBAR_DARK }}>{purchases.length}</h2>
            </div>
            <div className="p-3 rounded-2xl bg-orange-50" style={{ color: BRAND_ORANGE }}><ShoppingBag size={28}/></div>
          </div>
        </div>

        {/* SEARCH BAR - Matching Sidebar accent */}
        <div className="relative mb-8 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF7A00] transition-colors" size={22} />
          <input
            placeholder="Search by Bill No or Client Name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-16 pr-6 outline-none shadow-sm focus:ring-2 transition-all font-medium"
            style={{ "--tw-ring-color": BRAND_ORANGE }}
          />
        </div>

        {/* CARDS GRID */}
        {/* --- TABLE VIEW --- */}
<div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/50 border-b border-slate-100">
          <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Bill Details</th>
          <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Supplier Name</th>
          <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
          <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
          <th className="p-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {filtered.map((p) => (
          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
            {/* Bill Info */}
            <td className="p-5">
              <div className="flex flex-col">
                <span className="font-black text-[#1E1E1E]">#{p.bill_no}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {p.id}</span>
              </div>
            </td>

            {/* Supplier Info */}
            <td className="p-5">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black" 
                  style={{ backgroundColor: BRAND_ORANGE }}
                >
                  {p.client_name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-slate-700">{p.client_name}</span>
              </div>
            </td>

            {/* Date */}
            <td className="p-5 text-center">
              <span className="text-sm font-medium text-slate-500">
                {new Date(p.purchase_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </td>

            {/* Amount */}
            <td className="p-5 text-right">
              <span className="font-black text-lg" style={{ color: BRAND_ORANGE }}>
                ₹{Number(p.subtotal).toLocaleString()}
              </span>
            </td>

            {/* Actions */}
            <td className="p-5">
              <div className="flex items-center justify-center gap-2">
                <button 
                  onClick={() => { setSelectedPurchase(p); setShowModal(true); }} 
                  className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-[#1E1E1E] hover:text-white transition-all"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                
                {(role === "admin" || role === "superadmin" || permissions?.["Inventory Management_Edit"] === true) && (
                  <button 
                    onClick={() => navigate("/inventory/add", { state: { data: p } })} 
                    className="p-2.5 rounded-xl bg-orange-50 text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-all shadow-sm shadow-orange-100"
                    title="Edit Record"
                  >
                    <Edit3 size={18}/>
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Empty State */}
  {filtered.length === 0 && (
    <div className="p-20 text-center">
      <div className="inline-flex p-6 rounded-full bg-slate-50 mb-4 text-slate-300">
        <Search size={40} />
      </div>
      <h3 className="text-xl font-bold text-slate-400">No records found</h3>
      <p className="text-slate-400 text-sm">Try adjusting your search filters</p>
    </div>
  )}
</div>
        {/* --- PAGINATION CONTROLS --- */}
<div className="mt-6 px-8 py-5 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 font-['Lexend']">
  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
    Showing page <span className="text-slate-900">{currentPage}</span> of {totalPages}
  </div>

  <div className="flex items-center gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
      className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
    >
      Previous
    </button>

    <div className="flex gap-1">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`w-11 h-11 rounded-2xl text-sm font-black transition-all ${
            currentPage === i + 1
              ? "bg-[#FA9C42] text-white shadow-lg shadow-orange-100"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(prev => prev + 1)}
      className="px-6 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
    >
      Next
    </button>
  </div>
</div>
      </div>

      <style>{`
        .btn-action {
          display: flex; align-items: center; justify-content: center;
          padding: 12px; border-radius: 16px; background: #F8FAFC;
          color: #64748B; transition: all 0.2s ease;
        }
      `}</style>

      {/* MODAL - Enhanced with Logo Colors */}
      {/* ✅ ENHANCED VIEW MODAL */}
{/* ✅ BRANDED VIEW MODAL */}
{showModal && selectedPurchase && (
  <div className="fixed inset-0 bg-[#1E1E1E]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
    <div className="bg-white w-[800px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in duration-200">
      
      {/* HEADER - Using the Dark Sidebar Gray */}
      <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: "#1E1E1E" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: "#FF7A00" }}>
            <ShoppingBag size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Purchase Details</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Bill: {selectedPurchase.bill_no}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowModal(false)} 
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <X size={28} />
        </button>
      </div>

      <div className="p-8 overflow-y-auto max-h-[75vh]">
        {/* TOP INFO SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <User size={12} className="text-[#FF7A00]"/> Client / Supplier
            </p>
            <h4 className="font-bold text-[#1E1E1E] text-lg leading-tight">{selectedPurchase.client_name}</h4>
            <p className="text-sm text-slate-500 mt-1">{selectedPurchase.client_contact || "No Contact info"}</p>
          </div>
          
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Calendar size={12} className="text-[#FF7A00]"/> Billing Date
            </p>
            <h4 className="font-bold text-[#1E1E1E] text-lg">
              {new Date(selectedPurchase.purchase_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </h4>
          </div>

          <div className="p-5 rounded-3xl border-2 border-orange-50 relative overflow-hidden" style={{ backgroundColor: "#FFF9F5" }}>
            <div className="absolute -right-4 -top-4 opacity-10">
               <TrendingUp size={80} className="text-[#FF7A00]"/>
            </div>
            <p className="text-[10px] font-black text-[#FF7A00] uppercase tracking-widest mb-1">Total Bill Amount</p>
            <h4 className="text-3xl font-black" style={{ color: "#FF7A00" }}>₹{Number(selectedPurchase.subtotal).toLocaleString()}</h4>
          </div>
        </div>

        {/* PRODUCT LIST TABLE */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Product List</h3>
          <div className="rounded-[24px] border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#F8FAFC]">
                <tr className="border-b border-slate-100">
                  <th className="p-4 text-[11px] font-black text-slate-400 uppercase">Description</th>
                  <th className="p-4 text-[11px] font-black text-slate-400 uppercase text-center">Qty</th>
                  <th className="p-4 text-[11px] font-black text-slate-400 uppercase text-center">Rate</th>
                  <th className="p-4 text-[11px] font-black text-slate-400 uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {selectedPurchase.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF7A00] font-black text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-[#1E1E1E]">{item.product_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Godown: {item.godown}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-slate-600">{item.qty}</td>
                    <td className="p-4 text-center text-slate-500 font-medium">₹{item.rate}</td>
                    <td className="p-4 text-right font-black text-[#1E1E1E]">₹{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER - Branded Action */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
        <button 
          onClick={() => setShowModal(false)}
          className="text-sm font-black text-slate-400 hover:text-slate-600 px-6 py-2 transition-colors uppercase tracking-widest"
        >
          Close Preview
        </button>
        <button 
          onClick={() => {
            setShowModal(false);
            navigate("/inventory/add", { state: { editId: selectedPurchase.id } });
          }}
          className="px-10 py-3 rounded-2xl font-black text-white shadow-xl shadow-orange-100 hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-widest"
          style={{ backgroundColor: "#FF7A00" }}
        >
          Edit Records
        </button>
      </div>
          </div>
          
  </div>
)}
    </div>
  );
}