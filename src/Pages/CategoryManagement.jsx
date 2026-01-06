import axios from "axios";
import { AlertCircle, CheckCircle, Edit, Plus, Tags, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";

const BASE_URL = `${BASEURL}/api/categories`;

export default function CategoryManagement() {
  
 const { permissions, user, loading, role } = useAuth(); 

  console.log(permissions,"permissions")
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [category, setCategory] = useState({ name: "", status: "Available" });
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [limit] = useState(10); // Records per page
  const fetchCategories = async (page = 1) => {
  try {
    const res = await axios.get(`${BASE_URL}/list?page=${page}&limit=${limit}`);
    if (res.data.success) {
      setCategoryList(res.data.categories || []);
      setTotalPages(res.data.pagination.totalPages);
      setCurrentPage(res.data.pagination.currentPage);
    }
  } catch (err) { 
    console.error("Fetch Error:", err); 
  }
};

useEffect(() => { 
  fetchCategories(currentPage); 
}, [currentPage]);

  const handleChange = (e) => setCategory({ ...category, [e.target.name]: e.target.value });

  const saveCategory = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/update/${currentId}`, category);
      } else {
        await axios.post(`${BASE_URL}/create`, category);
      }
      setShowModal(false);
      setCategory({ name: "", status: "Available" });
      fetchCategories();
    } catch (err) { console.error("Save Error:", err); }
  };

  const editCategory = (item) => {
    setCategory({ name: item.name, status: item.status });
    setCurrentId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-['Lexend'] text-slate-800">
      
      {/* --- HEADER --- */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Category Management</h1>
          <p className="text-slate-500 font-medium mt-1">Organize and classify your inventory items.</p>
        </div>
        {/* Check if user is admin/superadmin OR has the specific Add permission */}
{(role === "admin" || role === "superadmin" || permissions?.["Category Management_Add"] === true) && (
  <button
    onClick={() => {
      setShowModal(true);
      setIsEditing(false);
      setCategory({ name: "", status: "Available" });
    }}
    className="group flex items-center gap-2 bg-[#FA9C42] text-white px-8 py-4 rounded-2xl shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95"
  >
    <Plus size={22} className="group-hover:rotate-90 transition-transform" />
    <span className="font-bold text-lg">Add Category</span>
  </button>
)}
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="max-w-[1400px] mx-auto bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-10 py-7 text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Index</th>
                <th className="px-10 py-7 text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Category Name</th>
                <th className="px-10 py-7 text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-10 py-7 text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categoryList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-24 text-slate-400 font-medium italic text-lg">
                    No categories found. Start by adding a new one.
                  </td>
                </tr>
              ) : (
                categoryList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6 text-slate-400 font-mono text-sm">
                       {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FA9C42]">
                          <Tags size={22} />
                        </div>
                        <span className="font-bold text-slate-800 text-xl">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border
                        ${item.status === "Available" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-red-50 text-red-600 border-red-100"}`}
                      >
                        {item.status === "Available" ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex justify-end gap-3">
                        {(role === "admin" || role === "superadmin" || permissions?.["Category Management_Edit"] === true) && (
 <button 
                          onClick={() => editCategory(item)}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#FA9C42] hover:border-[#FA9C42] hover:shadow-md transition-all active:scale-95"
                        >
                          <Edit size={18} />
                          <span className="font-bold text-sm">Modify</span>
                        </button>

                        )}
                        {(role === "admin" || role === "superadmin" || permissions?.["Category Management_Delete"] === true) && (
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
          {/* --- PAGINATION FOOTER --- */}
<div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
    Showing Page {currentPage} of {totalPages}
  </p>
  
  <div className="flex items-center gap-2">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => prev - 1)}
      className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
    >
      Previous
    </button>
    
    <div className="flex gap-1">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`w-11 h-11 rounded-xl text-sm font-black transition-all ${
            currentPage === i + 1 
              ? "bg-[#FA9C42] text-white shadow-lg shadow-orange-200" 
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
      className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
    >
      Next
    </button>
  </div>
</div>
        </div>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-[#FCFCFC] w-full max-w-lg rounded-[40px] shadow-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-[#FA9C42] rounded-2xl">
                    <Tags size={24} />
                </div>
                <h2 className="text-2xl font-black">{isEditing ? "Edit Category" : "New Category"}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={saveCategory} className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Category Title</label>
                <input
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  placeholder="e.g. Electronics, Furniture..."
                  className="w-full px-6 py-5 rounded-2xl bg-white border border-slate-200 focus:border-[#FA9C42] focus:ring-4 focus:ring-[#FA9C42]/10 outline-none transition-all font-bold text-lg"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] ml-1">Visibility Status</label>
                <select
                  name="status"
                  value={category.status}
                  onChange={handleChange}
                  className="w-full px-6 py-5 rounded-2xl bg-white border border-slate-200 focus:border-[#FA9C42] outline-none cursor-pointer font-bold text-lg transition-all appearance-none"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <button type="submit" className="w-full py-5 bg-[#FA9C42] text-white font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all text-lg">
                  {isEditing ? "Update Category" : "Save Category"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="w-full py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Discard Changes
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
            <h2 className="text-3xl font-black mb-3">Are you sure?</h2>
            <p className="text-slate-500 font-medium text-lg mb-10 px-4">This category and its associated data will be permanently removed.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
              <button 
                onClick={async () => {
                   await axios.delete(`${BASE_URL}/delete/${currentId}`);
                   setShowDeleteModal(false);
                   fetchCategories();
                }} 
                className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl shadow-lg shadow-red-100 hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}