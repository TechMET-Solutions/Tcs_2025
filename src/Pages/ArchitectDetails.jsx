import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Receipt, Plus, Calculator, CheckCircle2, History, TrendingUp } from "lucide-react";

export default function ArchitectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock Data for "All Quotations" existing in your system
  const [availableQuotations] = useState([
    { id: "Q-9901", client: "Amit Sharma", total: 125000 },
    { id: "Q-9902", client: "Suresh Gupta", total: 85000 },
    { id: "Q-9903", client: "Mehta Residency", total: 450000 },
  ]);

  // States for Ledger
  const [ledgerEntries, setLedgerEntries] = useState([
    { id: 1, qId: "Q-9900", client: "Initial Project", totalAmount: 50000, commAmount: 5000, date: "2023-10-01" }
  ]);

  const [selectedQ, setSelectedQ] = useState("");
  const [commInput, setCommInput] = useState("");
  const [isPercent, setIsPercent] = useState(true);

  // --- LOGIC ---
  
  // Find the details of the selected quotation
  const activeQ = availableQuotations.find(q => q.id === selectedQ);

  // Calculate commission dynamically
  const calculateFinalComm = () => {
    if (!activeQ || !commInput) return 0;
    return isPercent 
      ? (activeQ.total * Number(commInput)) / 100 
      : Number(commInput);
  };

  const addToLedger = () => {
    if (!activeQ || !commInput) return;
    
    const newEntry = {
      id: Date.now(),
      qId: activeQ.id,
      client: activeQ.client,
      totalAmount: activeQ.total,
      commAmount: calculateFinalComm(),
      date: new Date().toLocaleDateString()
    };

    setLedgerEntries([newEntry, ...ledgerEntries]);
    setSelectedQ("");
    setCommInput("");
  };

  // Totals
  const totalCommEarned = ledgerEntries.reduce((acc, curr) => acc + curr.commAmount, 0);

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
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Commission</p>
              <h3 className="text-2xl font-black text-slate-800">₹{totalCommEarned.toLocaleString()}</h3>
            </div>
          </div>
          {/* Add more cards here for Total Paid / Balance */}
        </div>

        {/* ADD COMMISSION SECTION */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 sticky top-8">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <Calculator size={22} className="text-[#FA9C42]" /> Add Commission
            </h2>
            
            <div className="space-y-5">
              {/* Dropdown to pick from ALL quotations */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Select Quotation</label>
                <select 
                  value={selectedQ} 
                  onChange={(e) => setSelectedQ(e.target.value)}
                  className="w-full mt-1 p-4 bg-slate-50 border-2 border-transparent focus:border-[#FA9C42] rounded-2xl outline-none font-bold text-slate-700 transition-all"
                >
                  <option value="">Choose Project...</option>
                  {availableQuotations.map(q => (
                    <option key={q.id} value={q.id}>{q.id} - {q.client}</option>
                  ))}
                </select>
              </div>

              {activeQ && (
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] font-black text-[#FA9C42] uppercase">Quotation Total</p>
                  <p className="text-xl font-black text-slate-800">₹{activeQ.total.toLocaleString()}</p>
                </div>
              )}

              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setIsPercent(true)}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${isPercent ? 'bg-white shadow-sm text-[#FA9C42]' : 'text-slate-400'}`}
                >PERCENTAGE (%)</button>
                <button 
                  onClick={() => setIsPercent(false)}
                  className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${!isPercent ? 'bg-white shadow-sm text-[#FA9C42]' : 'text-slate-400'}`}
                >FIXED AMOUNT (₹)</button>
              </div>

              <input 
                type="number" 
                placeholder={isPercent ? "Enter % (e.g. 10)" : "Enter Amount (₹)"}
                value={commInput}
                onChange={(e) => setCommInput(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-[#FA9C42] rounded-2xl outline-none font-black text-lg"
              />

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-400">Final Commission:</span>
                  <span className="text-xl font-black text-slate-800">₹{calculateFinalComm().toLocaleString()}</span>
                </div>
                <button 
                  onClick={addToLedger}
                  disabled={!selectedQ || !commInput}
                  className="w-full bg-[#FA9C42] text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-[#e88b32] disabled:opacity-50 disabled:hover:scale-100 transition-all active:scale-95"
                >
                  ADD TO TOTAL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* LEDGER TABLE */}
        <div className="lg:col-span-8 bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <h2 className="font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter">
              <History size={18} className="text-[#FA9C42]" /> Project History
            </h2>
            <span className="text-[10px] font-black bg-orange-100 text-[#FA9C42] px-3 py-1 rounded-full">
              {ledgerEntries.length} RECORDS
            </span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-50">
                <th className="p-6">Project / Client</th>
                <th className="p-6">Quotation Amt</th>
                <th className="p-6 text-right">Commission Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ledgerEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-6">
                    <p className="font-black text-slate-800">{entry.client}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{entry.qId} • {entry.date}</p>
                  </td>
                  <td className="p-6 font-bold text-slate-500">₹{entry.totalAmount.toLocaleString()}</td>
                  <td className="p-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-black text-green-600">+ ₹{entry.commAmount.toLocaleString()}</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Added to Total</span>
                    </div>
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