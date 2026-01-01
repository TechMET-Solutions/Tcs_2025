import { Edit3, Search, Trash2, X, Eye, TrendingUp, ShoppingBag, Calendar, User, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPurchaseListAPI } from "../Component/API/inventoryApi";

export default function ManageInventory() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [purchases, setPurchases] = useState([]);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Exact colors from your logo
  const BRAND_ORANGE = "#FF7A00"; 
  const SIDEBAR_DARK = "#1E1E1E";

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getPurchaseListAPI();
      setPurchases(res.data.purchases || []);
    } catch (err) { console.log(err); }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-[28px] p-6 border border-slate-100 hover:shadow-xl transition-all group relative">
              {/* ID Badge */}
              <div className="absolute top-4 right-4 text-[10px] font-black text-slate-300">ID: {p.id}</div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg" style={{ backgroundColor: BRAND_ORANGE }}>
                  {p.client_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1E1E1E]">{p.client_name}</h3>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-tighter">{new Date(p.purchase_date).toDateString()}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase">Bill No</span>
                  <span className="font-bold text-slate-700">{p.bill_no}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                  <span className="text-slate-400 text-xs font-bold uppercase">Grand Total</span>
                  <span className="font-black text-xl" style={{ color: BRAND_ORANGE }}>₹{p.subtotal}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => { setSelectedPurchase(p); setShowModal(true); }} className="btn-action hover:bg-slate-100"><Eye size={18}/></button>
                <button onClick={() => navigate("/inventory/add", { state: { data: p } })} className="btn-action hover:bg-orange-50 hover:text-[#FF7A00]"><Edit3 size={18}/></button>
                <button className="btn-action hover:bg-red-50 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
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
    <div className="bg-white w-full rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in fade-in zoom-in duration-200">
      
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