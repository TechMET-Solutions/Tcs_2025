import axios from "axios";
import { ArrowLeft, Calculator, History, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ArchitectDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [availableQuotations, setAvailableQuotations] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]); // Persistent history
  const [loading, setLoading] = useState(true);

  const [selectedQ, setSelectedQ] = useState("");
  const [commInput, setCommInput] = useState("");
  const [isPercent, setIsPercent] = useState(true);

  // 1. Fetch available (unsettled) quotations and past ledger
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Quotations
      const qRes = await axios.get(`http://localhost:5000/api/Quotation/getArchitectQuotations/${id}`);
      if (qRes.data.success) {
        // Only show quotations that aren't settled yet
        setAvailableQuotations(qRes.data.quotations.filter(q => q.isSettled === 0));
      }

      // Fetch Settlement History (Ledger)
      const lRes = await axios.get(`http://localhost:5000/api/Quotation/getArchitectLedger/${id}`);
      if (lRes.data.success) {
        setLedgerEntries(lRes.data.history);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Find selected quotation object
  const activeQ = availableQuotations.find(q => q.id === parseInt(selectedQ));

  const calculateFinalComm = () => {
    if (!activeQ || !commInput) return 0;
    // Use grandTotal from your API response
    const total = parseFloat(activeQ.grandTotal);
    return isPercent 
      ? (total * Number(commInput)) / 100 
      : Number(commInput);
  };

  // 2. Add to Ledger via API
  const addToLedger = async () => {
    if (!activeQ || !commInput) return;
    
    const amount = calculateFinalComm();

    try {
      const response = await axios.post(`http://localhost:5000/api/Quotation/settle-commission`, {
        quotationId: activeQ.id,
        architectId: id,
        commissionAmount: amount
      });

      if (response.data.success) {
        // Reset local state and refresh data from server
        setSelectedQ("");
        setCommInput("");
        fetchData(); 
        alert("Commission added to ledger successfully!");
      }
    } catch (error) {
      console.error("Settlement error:", error);
      alert("Failed to settle commission.");
    }
  };

  const totalCommEarned = ledgerEntries.reduce((acc, curr) => acc + parseFloat(curr.commissionAmount), 0);

  return (
    <div className="p-8 bg-[#fdfaf7] min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 mb-8 font-bold transition-all">
        <ArrowLeft size={20} /> Back to Directory
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* TOP SUMMARY CARDS */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><TrendingUp /></div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Earnings</p>
              <h3 className="text-2xl font-black text-slate-800">₹{totalCommEarned.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* ADD COMMISSION SECTION */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 sticky top-8">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#FA9C42]" /> Add Commission
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Select Project</label>
                <select 
                  value={selectedQ} 
                  onChange={(e) => setSelectedQ(e.target.value)}
                  className="w-full mt-1 p-4 bg-slate-50 border-2 border-transparent focus:border-[#FA9C42] rounded-2xl outline-none font-bold text-slate-700 transition-all"
                >
                  <option value="">Choose Project...</option>
                  {availableQuotations.map(q => (
                    <option key={q.id} value={q.id}>#{q.id} - {q.clientName}</option>
                  ))}
                </select>
              </div>

              {activeQ && (
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] font-black text-[#FA9C42] uppercase">Project Total</p>
                  <p className="text-xl font-black text-slate-800">₹{parseFloat(activeQ.grandTotal).toLocaleString()}</p>
                </div>
              )}

              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button onClick={() => setIsPercent(true)} className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${isPercent ? 'bg-white shadow-sm text-[#FA9C42]' : 'text-slate-400'}`}>%</button>
                <button onClick={() => setIsPercent(false)} className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${!isPercent ? 'bg-white shadow-sm text-[#FA9C42]' : 'text-slate-400'}`}>₹</button>
              </div>

              <input 
                type="number" 
                placeholder={isPercent ? "Enter %" : "Enter Amount (₹)"}
                value={commInput}
                onChange={(e) => setCommInput(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-[#FA9C42] rounded-2xl outline-none font-black text-lg"
              />

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-400">Final:</span>
                  <span className="text-xl font-black text-slate-800">₹{calculateFinalComm().toLocaleString()}</span>
                </div>
                <button 
                  onClick={addToLedger}
                  disabled={!selectedQ || !commInput || loading}
                  className="w-full bg-[#FA9C42] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-[#e88b32] disabled:opacity-50 transition-all"
                >
                  SETTLE COMMISSION
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECT HISTORY TABLE */}
        <div className="lg:col-span-8 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
              <History size={18} className="text-[#FA9C42]" /> Project History
            </h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-50">
                <th className="p-6">Client</th>
                <th className="p-6">Project Amt</th>
                <th className="p-6 text-right">Paid to Architect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ledgerEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-6">
                    <p className="font-black text-slate-800">{entry.clientName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">ID: {entry.quotationId} • {new Date(entry.settledAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-6 font-bold text-slate-500">₹{parseFloat(entry.quotationTotal).toLocaleString()}</td>
                  <td className="p-6 text-right">
                    <span className="text-lg font-black text-green-600">+ ₹{parseFloat(entry.commissionAmount).toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}