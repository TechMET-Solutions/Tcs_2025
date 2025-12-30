import axios from "axios";
import { Plus, X, History, Phone, User, Briefcase, MapPin, MessageSquare, ChevronRight } from "lucide-react";
import { useEffect, useRef,创新, useState } from "react";
import { Images } from "../assets";

/* ✅ MODERN TOOLTIP */
const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md whitespace-nowrap shadow-xl z-50">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  );
};

/* ✅ REFINED INPUT FIELD */
const InputField = ({ label, name, value, onChange, error, placeholder, icon: Icon }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">{label}</label>
    <div className="relative group">
      {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FA9C42] transition-colors" />}
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-3 rounded-2xl bg-white border border-slate-200 transition-all outline-none focus:ring-4 focus:ring-[#FA9C42]/10 focus:border-[#FA9C42] shadow-sm ${error ? "border-red-400 ring-4 ring-red-500/10" : ""}`}
      />
    </div>
    {error && <p className="text-[10px] text-red-500 font-bold mt-0.5 ml-1 uppercase tracking-tight">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, error, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 transition-all outline-none appearance-none cursor-pointer focus:border-[#FA9C42] focus:ring-4 focus:ring-[#FA9C42]/10 shadow-sm ${error ? "border-red-400" : ""}`}
    >
      <option value="">Select Option</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    {error && <p className="text-[10px] text-red-500 font-bold mt-0.5 ml-1 uppercase tracking-tight">{error}</p>}
  </div>
);

export default function CustomerManagement() {
  const BASE_URL = "http://localhost:5000/api/users";
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpdateFollowup, setShowUpdateFollowup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const [followupUpdate, setFollowupUpdate] = useState({ date: getTodayDate(), response: "" });

  const [customer, setCustomer] = useState({
    name: "", Last_Name: "", phone: "", email: "", assignedEmployee: "",
    assignedArchitect: "", status: "New", nextFollowup: "", followupResponse: "",
    notes: "", projectName: "", siteName: "", siteType: "", priority: "Low"
  });

  const apiCalled = useRef(false);
  useEffect(() => {
    if (!apiCalled.current) {
      apiCalled.current = true;
      fetchCustomers();
    }
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/list`);
      setCustomerList(res.data.customers || []);
    } catch (err) { console.log("Fetch Error:", err); }
  };

  const handleChange = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });
  const handleFollowupInput = (e) => setFollowupUpdate({ ...followupUpdate, [e.target.name]: e.target.value });

  const validate = () => {
    let newErrors = {};
    const required = { name: "First name", phone: "Phone", assignedEmployee: "Employee", projectName: "Project" };
    Object.keys(required).forEach(f => { if (!customer[f]) newErrors[f] = `${required[f]} is required`; });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveCustomer = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/add`, customer);
      fetchCustomers();
      setShowModal(false);
      setErrors({});
    } catch (err) { setErrors({ server: "Failed to save." }); }
    finally { setIsSubmitting(false); }
  };

  const saveNewFollowup = async () => {
    try {
      await axios.post(`${BASE_URL}/followup/add`, {
        customerId: customerList[activeIndex]?.id,
        date: followupUpdate.date,
        response: followupUpdate.response,
      });
      setShowUpdateFollowup(false);
      setFollowupUpdate({ date: getTodayDate(), response: "" });
    } catch (err) { console.log(err); }
  };

  const openHistory = async (item) => {
    try {
      const res = await axios.get(`${BASE_URL}/followups/${item.id}`);
      setSelectedCustomer({ ...item, followups: res.data.followups || [] });
      setShowHistory(true);
    } catch (err) { console.log(err); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-['Lexend'] text-slate-800">
      
      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">CRM Portal</h1>
          <p className="text-slate-500 font-medium">Manage your clients and track project follow-ups</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-slate-200 hover:bg-[#FA9C42] hover:shadow-[#FA9C42]/20 transition-all active:scale-95"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span className="font-bold">New Customer</span>
        </button>
      </div>

      {/* --- STATS OVERVIEW (Visual Polish) --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Leads", val: customerList.length, color: "text-blue-600" },
          { label: "Pending Follow-ups", val: "12", color: "text-orange-500" },
          { label: "Active Projects", val: "08", color: "text-emerald-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex justify-between items-center">
            <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">{stat.label}</span>
            <span className={`text-3xl font-black ${stat.color}`}>{stat.val}</span>
          </div>
        ))}
      </div>

      {/* --- DATA TABLE --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Customer Info</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Assignment</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Project Details</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customerList.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-medium">No records found. Click "New Customer" to start.</td></tr>
              ) : (
                customerList.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-lg group-hover:bg-[#FA9C42]/10 group-hover:text-[#FA9C42] transition-colors">
                          {item.name[0]}
                        </div>
                        <div>
                          <div className="font-black text-slate-900">{item.name} {item.Last_Name}</div>
                          <div className="text-sm text-slate-500 flex items-center gap-1"><Phone size={12}/> {item.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Employee</span>
                        <span className="font-bold text-slate-700">{item.assignedEmployee}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500">{item.siteType || 'N/A'}</span>
                       <div className="mt-1 font-bold text-slate-700">{item.projectName || 'Unnamed Project'}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openHistory(item)} className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:shadow-md transition-all">
                          <History size={18} />
                        </button>
                        <button 
                          onClick={() => { setActiveIndex(index); setShowUpdateFollowup(true); }}
                          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:border-[#FA9C42] hover:text-[#FA9C42] shadow-sm transition-all"
                        >
                          Follow-up <ChevronRight size={16} />
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

      {/* --- ADD CUSTOMER MODAL (Bento Style) --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-[#FCFCFC] w-full max-w-4xl rounded-[40px] shadow-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-2xl font-black">Register New Client</h2>
              <button onClick={() => setShowModal(false)} className="p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={saveCustomer} className="p-10 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#FA9C42]">Personal Contact</h3>
                  <InputField label="First Name" name="name" value={customer.name} onChange={handleChange} error={errors.name} placeholder="e.g. Rahul" icon={User} />
                  <InputField label="Last Name" name="Last_Name" value={customer.Last_Name} onChange={handleChange} error={errors.Last_Name} placeholder="e.g. Sharma" />
                  <InputField label="Mobile Number" name="phone" value={customer.phone} onChange={handleChange} error={errors.phone} placeholder="98XXXXXXXX" icon={Phone} />
                </div>
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#FA9C42]">Project Assignment</h3>
                  <SelectField label="Employee" name="assignedEmployee" value={customer.assignedEmployee} onChange={handleChange} error={errors.assignedEmployee} options={["Rahul", "Sagar", "Pritesh"]} />
                  <InputField label="Project Name" name="projectName" value={customer.projectName} onChange={handleChange} error={errors.projectName} placeholder="Skyline Heights" icon={Briefcase} />
                  <SelectField label="Site Type" name="siteType" value={customer.siteType} onChange={handleChange} options={["Residential", "Commercial"]} />
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                <button type="submit" disabled={isSubmitting} className="px-10 py-4 bg-[#FA9C42] text-white font-black rounded-2xl shadow-lg shadow-[#FA9C42]/30 hover:scale-105 active:scale-95 transition-all">
                  {isSubmitting ? "Creating..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- FOLLOW-UP MODAL (Compact) --- */}
      {showUpdateFollowup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
           <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-3xl animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black">Log Interaction</h2>
                <button onClick={() => setShowUpdateFollowup(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <div className="space-y-5">
                <InputField label="Date" name="date" value={followupUpdate.date} disabled icon={History} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Notes / Feedback</label>
                  <textarea 
                    name="response" 
                    value={followupUpdate.response} 
                    onChange={handleFollowupInput} 
                    rows={4}
                    placeholder="Customer interested in premium plan..."
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#FA9C42] outline-none transition-all resize-none shadow-inner"
                  />
                </div>
                <button onClick={saveNewFollowup} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-[#FA9C42] transition-colors shadow-lg">Save Follow-up</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}