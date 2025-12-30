import { ClipboardList, Printer, Trash2, MapPin, ExternalLink, Calendar, User, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllDeliveryChallan } from "../Component/API/quotationApi";

export default function DeliveryChallan() {
  const [challanList, setChallanList] = useState([]);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingChallanId, setTrackingChallanId] = useState(null);
  const [trackingDate, setTrackingDate] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("");

  const [trackingList] = useState([
    { id: 1, date: "2025-01-01 10:00 AM", status: "Preparing For Dispatch" },
    { id: 2, date: "2025-01-02 12:00 PM", status: "Dispatched" }
  ]);

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      const res = await getAllDeliveryChallan();
      if (res.data.success) {
        setChallanList(res.data.challans);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openDC = (id) => {
    window.open(`http://localhost:5000/api/Quotation/delivery-challan/print/${id}`, "_blank");
  };

  const printChallan = (id) => {
    window.open(`http://localhost:5000/api/Quotation/delivery-challan/print/${id}`, "_blank");
  };

  const openTrackingModal = (id) => {
    setTrackingChallanId(id);
    setShowTrackingModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-['Lexend'] text-slate-800">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Delivery Challan</h1>
          <p className="text-slate-500 font-medium">Monitor shipments, track delivery status, and generate documents.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
          <ClipboardList className="text-[#FA9C42]" size={24} />
          <span className="font-black text-slate-800 text-xl">{challanList.length} Total</span>
        </div>
      </div>

      {/* --- TABLE CARD --- */}
      <div className="max-w-[1600px] mx-auto bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                <th className="px-8 py-6">Challan Info</th>
                <th className="px-6 py-6">Customer & Logistics</th>
                <th className="px-6 py-6 text-center">Dispatch Status</th>
                <th className="px-6 py-6 text-center">Tracking (TC)</th>
                <th className="px-6 py-6 text-right">Documents</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {challanList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-32 text-slate-400 font-medium italic text-xl">
                    No delivery challans found.
                  </td>
                </tr>
              ) : (
                challanList.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    
                    {/* ID & DATE */}
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-lg">CH-{item.id}</span>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
                          <Calendar size={12} />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <span className="mt-2 inline-block px-3 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black w-fit">
                          REF: {item.quotationId}
                        </span>
                      </div>
                    </td>

                    {/* CLIENT & LOGISTICS */}
                    <td className="px-6 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-[#FA9C42]" />
                          <span className="font-bold text-slate-700">{item.client}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                          <Truck size={14} />
                          <span>{item.deliveryBoy} • <b className="text-slate-800">{item.tempo}</b></span>
                        </div>
                      </div>
                    </td>

                    {/* STATUS BUTTON */}
                    <td className="px-6 py-6 text-center">
                       <button 
                        onClick={() => openTrackingModal(item.id)}
                        className="px-5 py-2 bg-purple-50 text-purple-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                       >
                         Manage Tracking
                       </button>
                    </td>

                    {/* QUICK ACTION TC */}
                    <td className="px-6 py-6 text-center">
                       <div className="flex justify-center gap-2">
                        <button onClick={() => openDC(item.id)} className="p-3 bg-white border border-slate-200 text-emerald-600 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-90">
                          <ExternalLink size={18} />
                        </button>
                        <button className="p-3 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all active:scale-90">
                          <Trash2 size={18} />
                        </button>
                       </div>
                    </td>

                    {/* PRINT ACTION */}
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => printChallan(item.id)}
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                      >
                        <Printer size={18} />
                        <span>Print DC</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- TRACKING MODAL (TC) --- */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[600px] rounded-[32px] p-8 shadow-2xl border border-white">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                  <MapPin size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tracking Details</h2>
              </div>
              <span className="font-black text-slate-400">#CH-{trackingChallanId}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Timestamp</label>
                <input
                  type="datetime-local"
                  value={trackingDate}
                  onChange={(e) => setTrackingDate(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#FA9C42] focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Status</label>
                <select
                  value={trackingStatus}
                  onChange={(e) => setTrackingStatus(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#FA9C42] focus:bg-white outline-none p-4 rounded-2xl transition-all font-bold appearance-none cursor-pointer"
                >
                  <option>~~ SELECT ~~</option>
                  <option>Preparing For Dispatch</option>
                  <option>Dispatched</option>
                  <option>On The Way</option>
                  <option>Deliver</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[24px] p-4 overflow-hidden border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="pb-3 text-left">Date & Time</th>
                    <th className="pb-3 text-left">Update</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {trackingList.map((t) => (
                    <tr key={t.id}>
                      <td className="py-3 font-bold text-slate-600">{t.date}</td>
                      <td className="py-3 italic text-slate-500 font-medium">{t.status}</td>
                      <td className="py-3 text-right">
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => alert("Saving soon")}
                className="px-8 py-4 bg-[#FA9C42] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-95"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}