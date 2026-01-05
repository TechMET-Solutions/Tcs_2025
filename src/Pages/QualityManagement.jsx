import axios from "axios";
import { AlertCircle, CheckCircle, Edit, Layers, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";

const BASE_URL = `${BASEURL}/api/qualities`;

export default function QualityManagement() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [qualityList, setQualityList] = useState([]);
  const [quality, setQuality] = useState({ name: "", status: "Available" });
 const { permissions, user, loading, role } = useAuth(); 
  // ✅ FETCH DATA
  const fetchQualities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/list`);
      setQualityList(res.data.qualities || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchQualities();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setQuality({ ...quality, [e.target.name]: e.target.value });
  };

  // ✅ SAVE (CREATE + UPDATE)
  const saveQuality = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/update/${currentId}`, quality);
      } else {
        await axios.post(`${BASE_URL}/create`, quality);
      }
      setShowModal(false);
      setQuality({ name: "", status: "Available" });
      fetchQualities();
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  const editQuality = (item) => {
    setQuality({ name: item.name, status: item.status });
    setCurrentId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const deleteQuality = async () => {
    try {
      await axios.delete(`${BASE_URL}/delete/${currentId}`);
      setShowDeleteModal(false);
      fetchQualities();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-['Lexend'] text-slate-800">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Quality Management</h1>
          <p className="text-slate-500 font-medium mt-1">Configure and manage product quality standards across the inventory.</p>
        </div>
         {(role === "admin" || role === "superadmin" || permissions?.["Quality Management_Add"] === true) && (

 <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            setQuality({ name: "", status: "Available" });
          }}
          className="group flex items-center gap-2 bg-[#FA9C42] text-white px-8 py-4 rounded-2xl shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
        >
          <Plus size={22} className="group-hover:rotate-90 transition-transform" />
          <span className="font-bold text-lg">Add Quality</span>
        </button>
                        )}
       
      </div>

      {/* --- LARGE DATA TABLE --- */}
      <div className="max-w-[1400px] mx-auto bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-10 py-7 text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Quality ID</th>
                <th className="px-10 py-7 text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Standard Name</th>
                <th className="px-10 py-7 text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Availability Status</th>
                <th className="px-10 py-7 text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {qualityList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-24 text-slate-400 font-medium italic text-lg">
                    No quality standards found. Click "Add Quality" to begin.
                  </td>
                </tr>
              ) : (
                qualityList.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6 text-slate-400 font-mono text-sm">
                      #{String(index + 1).padStart(3, '0')}
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FA9C42] shadow-sm">
                          <Layers size={22} />
                        </div>
                        <span className="font-bold text-slate-800 text-xl">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-sm border
                        ${item.status === "Available" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-red-50 text-red-600 border-red-100"}`}
                      >
                        {item.status === "Available" ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      {/* ✅ ACTIONS ALWAYS VISIBLE */}
                      <div className="flex justify-end gap-4">
                         {(role === "admin" || role === "superadmin" || permissions?.["Quality Management_Edit"] === true) && (

  <button 
                          onClick={() => editQuality(item)}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#FA9C42] hover:border-[#FA9C42] hover:shadow-md transition-all active:scale-95"
                        >
                          <Edit size={18} />
                          <span className="font-bold text-sm">Modify</span>
                        </button>
                        )}
                        {(role === "admin" || role === "superadmin" || permissions?.["Quality Management_Delete"] === true) && (

  <button 
                          onClick={() => { setCurrentId(item.id); setShowDeleteModal(true); }}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 hover:shadow-md transition-all active:scale-95"
                        >
                          <Trash2 size={18} />
                          <span className="font-bold text-sm">Remove</span>
                        </button>
                        )}
                       
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-[#FCFCFC] w-full max-w-lg rounded-[40px] shadow-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-[#FA9C42] rounded-2xl">
                    <Plus size={24} />
                </div>
                <h2 className="text-2xl font-black">{isEditing ? "Edit Quality" : "New Standard"}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={saveQuality} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Standard Name</label>
                <input
                  name="name"
                  value={quality.name}
                  onChange={handleChange}
                  placeholder="e.g. Export Quality Grade A"
                  className="w-full px-6 py-5 rounded-2xl bg-white border border-slate-200 focus:border-[#FA9C42] focus:ring-4 focus:ring-[#FA9C42]/10 outline-none transition-all font-bold text-lg"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Inventory Status</label>
                <div className="relative">
                  <select
                    name="status"
                    value={quality.status}
                    onChange={handleChange}
                    className="w-full px-6 py-5 rounded-2xl bg-white border border-slate-200 focus:border-[#FA9C42] outline-none appearance-none cursor-pointer font-bold text-lg transition-all"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Layers size={20} />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <button type="submit" className="w-full py-5 bg-[#FA9C42] text-white font-black rounded-2xl shadow-lg shadow-[#FA9C42]/30 hover:bg-orange-600 transition-all text-lg">
                  {isEditing ? "Update Standard" : "Save Standard"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="w-full py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Cancel and Go Back
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-3xl text-center">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h2 className="text-3xl font-black mb-3">Confirm Delete?</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10 px-4">
                Are you sure you want to remove this quality standard? This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
              <button 
                onClick={deleteQuality} 
                className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}