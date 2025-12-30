import React, { useEffect, useState } from "react";
import axios from "axios";
// Importing all necessary icons
import { 
  Plus, X, UserCircle, Phone, Percent, 
  Calendar, Award, Search, Edit3, Trash2, Users 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api/architects";

export default function ArchitectRegistration() {
  // --- STATE ---
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [searchTerm, setSearchTerm] = useState("");
  const [architectList, setArchitectList] = useState([]);
  const navigate = useNavigate();
  const [architect, setArchitect] = useState({
    name: "",
    lastname: "",
    whatsapp: "",
    commission: "",
    birthdate: "",
    loyaltyPoints: "",
    remark: ""
  });

  // --- API CALLS ---
  const fetchArchitects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/list`);
      setArchitectList(res.data.architects || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchArchitects();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setArchitect({ ...architect, [e.target.name]: e.target.value });
  };

  const handleOpenAddModal = () => {
    setArchitect({
      name: "", lastname: "", whatsapp: "",
      commission: "", birthdate: "", loyaltyPoints: "", remark: ""
    });
    setModalMode("add");
    setShowModal(true);
  };

  const handleOpenEditModal = (data) => {
    setArchitect(data);
    setModalMode("edit");
    setShowModal(true);
  };

  const saveArchitect = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "add") {
        await axios.post(`${BASE_URL}/create`, architect);
      } else {
        await axios.put(`${BASE_URL}/update/${architect.id}`, architect);
      }
      fetchArchitects();
      setShowModal(false);
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  // --- FILTER LOGIC ---
  const filteredList = architectList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#fdfaf7] min-h-screen">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#FA9C42] text-white rounded-2xl shadow-lg shadow-orange-200">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Architect Directory</h1>
            <p className="text-slate-400 text-sm font-medium">Manage your professional network & commissions</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* SEARCH BAR */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FA9C42]/20 focus:border-[#FA9C42] transition-all w-full"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-[#FA9C42] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-[#e88b32] transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} strokeWidth={3} /> Add Architect
          </button>
        </div>
      </div>

      {/* ARCHITECT TABLE */}
      <div className="bg-white shadow-xl shadow-slate-200/50 rounded-[24px] overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Profile / Name</th>
                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Commission</th>
                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Birthdate</th>
                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Loyalty</th>
                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <Users size={48} className="mb-2" />
                      <p className="font-bold">No architects found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FA9C42]/5 transition-colors group">
                   <td className="py-4 px-6 cursor-pointer" onClick={() => navigate(`/architect/${item.id}`)}>
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#FA9C42] group-hover:text-white transition-all">
      <UserCircle size={20} />
    </div>
    <span className="font-bold text-slate-700 hover:text-[#FA9C42] underline decoration-dotted">
       {item.name} {item.lastname}
    </span>
  </div>
</td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-green-500" /> {item.whatsapp}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 bg-orange-50 text-[#FA9C42] rounded-full text-xs font-black">
                        {item.commission}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500 font-medium">{item.birthdate}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                        <Award size={16} /> {item.loyaltyPoints}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 hover:bg-white rounded-lg shadow-sm border border-slate-100 text-slate-400 hover:text-[#FA9C42]"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg shadow-sm border border-slate-100 text-slate-400 hover:text-red-500">
                          <Trash2 size={16} />
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

      {/* --- ADD/EDIT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-opacity p-4">
          <div className="w-full max-w-[650px] bg-[#FFF7EF] rounded-[28px] shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
            
            {/* MODAL HEADER */}
            <div className="px-10 pt-8 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FA9C42]/10 rounded-xl text-[#FA9C42]">
                    <UserCircle size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                      {modalMode === "edit" ? "Edit Architect" : "Add New Architect"}
                    </h2>
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-0.5 opacity-70">
                      Professional Partner Profile
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors group">
                  <X className="w-6 h-6 text-slate-400 group-hover:text-slate-600" />
                </button>
              </div>
            </div>

            {/* FORM CONTENT */}
            <form className="px-10 pb-10 mt-4" onSubmit={saveArchitect}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">First Name *</label>
                  <input name="name" value={architect.name} onChange={handleChange} placeholder="e.g. Rahul" className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] focus:ring-4 focus:ring-[#FA9C42]/5 outline-none transition-all font-medium text-slate-700" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Last Name *</label>
                  <input name="lastname" value={architect.lastname} onChange={handleChange} placeholder="e.g. Mehta" className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all font-medium text-slate-700" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input name="whatsapp" value={architect.whatsapp} onChange={handleChange} placeholder="9876543210" className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all font-medium" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Commission Rate</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FA9C42]" size={16} />
                    <input type="number" name="commission" value={architect.commission} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all font-bold text-[#FA9C42]" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Birthdate</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="date" name="birthdate" value={architect.birthdate} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all font-medium" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Loyalty Points</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                    <input type="number" name="loyaltyPoints" value={architect.loyaltyPoints} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all font-bold text-blue-600" />
                  </div>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Internal Remarks</label>
                  <textarea name="remark" value={architect.remark} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all text-slate-600 resize-none font-medium" rows={3} />
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                <button type="submit" className="bg-[#FA9C42] text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-[#FA9C42]/20 hover:shadow-[#FA9C42]/30 hover:-translate-y-0.5 transition-all active:scale-95">
                  {modalMode === "edit" ? "Update Details" : "Save Architect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}