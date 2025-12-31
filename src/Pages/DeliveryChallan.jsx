import { ClipboardList, Printer, Trash2, MapPin, ExternalLink, Calendar, User, Truck, Search, Filter, ChevronRight, Activity } from "lucide-react";
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
    debugger
    window.open(`http://localhost:5000/api/Quotation/delivery-challan/print/${id}`, "_blank");
  };
  const printChallan2 = (id) => {
    window.open(`http://localhost:5000/api/Quotation/delivery-challan/printreturn/${id}`, "_blank");
  };
  const openTrackingModal = (id) => {
    setTrackingChallanId(id);
    setShowTrackingModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-6 md:p-12 font-['Lexend'] text-slate-800">
      
      {/* --- HEADER SECTION --- */}
      <div className="max-w-[1500px] mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Activity size={12} /> Live Logistics
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Delivery <span className="text-orange-500 underline decoration-slate-200 underline-offset-8">Challans</span></h1>
          <p className="text-slate-400 font-medium">Streamline your shipment workflow and documentation.</p>
        </div>

        <div className="flex gap-4">
            <div className="bg-white px-8 py-5 rounded-[32px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-4">
                <div className="p-3 bg-slate-900 rounded-2xl text-white">
                    <ClipboardList size={24} />
                </div>
                <div>
                    <span className="block text-3xl font-black text-slate-900 leading-none">{challanList.length}</span>
                    <span className="text-xs font-bold text-slate-400">Total Records</span>
                </div>
            </div>
        </div>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="max-w-[1500px] mx-auto bg-white rounded-[48px] border border-slate-50 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/40 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-12 py-8">Challan / Date</th>
                <th className="px-8 py-8">Recipient Details</th>
                <th className="px-6 py-8 text-center">Tracking Hub</th>
                <th className="px-6 py-8 text-center">Manage</th>
                <th className="px-12 py-8 text-right">Print Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {challanList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-40">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                        <Truck size={64} />
                        <span className="text-2xl font-black italic">No Shipments Found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                challanList.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-all duration-500">
                    
                    {/* INFO */}
                    <td className="px-12 py-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">CH-{item.id}</span>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <Calendar size={13} className="text-orange-400" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        <span className="mt-3 px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black w-fit uppercase border border-slate-200">
                          Ref: {item.quotationId}
                        </span>
                      </div>
                    </td>

                    {/* CLIENT */}
                    <td className="px-8 py-8">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                             <User size={18} className="text-slate-400" />
                          </div>
                          <span className="font-extrabold text-slate-800 text-lg leading-tight">{item.client}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold bg-white border border-slate-100 px-3 py-2 rounded-xl w-fit shadow-sm">
                          <Truck size={14} className="text-orange-500" />
                          <span>{item.deliveryBoy} <span className="text-slate-200 mx-1">|</span> <b className="text-slate-800">{item.tempo}</b></span>
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-8 text-center">
                       <button 
                        onClick={() => openTrackingModal(item.id)}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2 mx-auto"
                       >
                         <MapPin size={14} /> Update Timeline
                       </button>
                    </td>

                    {/* QUICK ACTION */}
                    <td className="px-6 py-8 text-center">
                        <div className="flex justify-center gap-2">
                            <button onClick={() => openDC(item.id)} className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:rotate-6">
                                <ExternalLink size={20} />
                            </button>
                            <button className="p-4 bg-red-50 text-red-400 rounded-3xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:-rotate-6">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </td>

                    {/* PRINT */}
                    <td className="px-12 py-8 text-right">
                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => printChallan(item.id)}
                          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl hover:shadow-orange-200 active:scale-95"
                        >
                          <Printer size={16} /> Print DC
                        </button>
                        <button
                          onClick={() => printChallan2(item.id)}
                          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all mr-2"
                        >
                          <Printer size={14} /> Print Return Copy
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- TRACKING MODAL --- */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[600px] rounded-[48px] p-10 shadow-2xl border border-white animate-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Live Track</h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Record ID: #CH-{trackingChallanId}</p>
              </div>
              <div className="p-4 bg-orange-50 text-orange-500 rounded-3xl">
                <MapPin size={32} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={trackingDate}
                  onChange={(e) => setTrackingDate(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none p-5 rounded-[24px] transition-all font-bold text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Status Step</label>
                <select
                  value={trackingStatus}
                  onChange={(e) => setTrackingStatus(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none p-5 rounded-[24px] transition-all font-bold appearance-none cursor-pointer"
                >
                  <option>~~ SELECT ~~</option>
                  <option>Preparing For Dispatch</option>
                  <option>Dispatched</option>
                  <option>On The Way</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 max-h-[200px] overflow-y-auto mb-10 custom-scrollbar">
               {trackingList.map((t) => (
                  <div key={t.id} className="flex justify-between items-center py-4 border-b border-slate-200/50 last:border-0">
                     <div className="flex gap-4 items-center">
                        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                        <div>
                           <p className="text-sm font-black text-slate-800 leading-none">{t.status}</p>
                           <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{t.date}</p>
                        </div>
                     </div>
                     <button className="text-slate-300 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                  </div>
               ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="px-8 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={() => alert("Syncing Status...")}
                className="px-10 py-5 bg-orange-500 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-slate-900 shadow-xl shadow-orange-200 transition-all active:scale-95"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}