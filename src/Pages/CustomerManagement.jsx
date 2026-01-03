import axios from "axios";
import {
  Briefcase,
  ChevronRight,
  Edit2,
  History,
  Mail,
  MapPin,
  Phone,
  Plus,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BASEURL } from "../Component/API/Url";

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
  const BASE_URL = `${BASEURL}/api/users`;
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpdateFollowup, setShowUpdateFollowup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const [followupUpdate, setFollowupUpdate] = useState({ date: getTodayDate(), response: "" });

  const [customer, setCustomer] = useState({
    name: "", Last_Name: "", phone: "", email: "", assignedEmployee: "",
    assignedArchitect: "", status: "New", 
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
    if (isEditing) {
      // UPDATE EXISTING
      await axios.put(`${BASE_URL}/update/${customer.id}`, customer);
    } else {
      // CREATE NEW
      await axios.post(`${BASE_URL}/add`, customer);
    }
    fetchCustomers();
    setShowModal(false);
    setErrors({});
  } catch (err) { 
    setErrors({ server: "Operation failed." }); 
  } finally { 
    setIsSubmitting(false); 
  }
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
const handleOpenModal = () => {
  setIsEditing(false);
  setCustomer({
    name: "", Last_Name: "", phone: "", email: "", assignedEmployee: "",
    assignedArchitect: "", status: "New", 
    notes: "", projectName: "", siteName: "", siteType: "", priority: "Low"
  });
  setShowModal(true);
};

  const handleEdit = (item) => {
  setIsEditing(true);
  setCustomer(item); // Populate form with existing data
  setShowModal(true);
};
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-['Lexend'] text-slate-800">
      
      {/* --- HEADER SECTION --- */}
      <div className=" mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">CRM Portal</h1>
          <p className="text-slate-500 font-medium">Manage your clients and track project follow-ups</p>
        </div>
        <button
          onClick={()=>handleOpenModal()}
          className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-slate-200 hover:bg-[#FA9C42] hover:shadow-[#FA9C42]/20 transition-all active:scale-95"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span className="font-bold">New Customer</span>
        </button>
      </div>

      {/* --- STATS OVERVIEW (Visual Polish) --- */}
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Leads", val: customerList.length, color: "text-blue-600" },
          
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex justify-between items-center">
            <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">{stat.label}</span>
            <span className={`text-3xl font-black ${stat.color}`}>{stat.val}</span>
          </div>
        ))}
      </div>

      {/* --- DATA TABLE --- */}
      <div className=" mx-auto bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
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
    <tr>
      <td colSpan="4" className="text-center py-20 text-slate-400 font-medium">
        No records found. Click "New Customer" to start.
      </td>
    </tr>
  ) : (
    customerList.map((item, index) => (
      <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
        <td className="px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-lg group-hover:bg-[#FA9C42]/10 group-hover:text-[#FA9C42] transition-colors">
              {item.name[0]}
            </div>
            <div>
              <div className="font-black text-slate-900">
                {item.name} {item.Last_Name}
              </div>
              <div className="text-sm text-slate-500 flex items-center gap-1">
                <Phone size={12} /> {item.phone}
              </div>
            </div>
          </div>
        </td>
        <td className="px-8 py-6">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Employee
            </span>
            <span className="font-bold text-slate-700">
              {item.assignedEmployee}
            </span>
          </div>
        </td>
        <td className="px-8 py-6">
          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500">
            {item.siteType || "N/A"}
          </span>
          <div className="mt-1 font-bold text-slate-700">
            {item.projectName || "Unnamed Project"}
          </div>
        </td>

        {/* --- ACTIONS COLUMN: ALWAYS VISIBLE --- */}
        <td className="px-8 py-6">
          <div className="flex justify-end gap-3 transition-opacity">
            <button
    onClick={() => handleEdit(item)}
    title="Edit Details"
    className="p-2.5 rounded-xl border border-slate-200 text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all active:scale-95"
  >
    <Edit2 size={18} />
  </button>
            <button
              onClick={() => openHistory(item)}
              title="View History"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:shadow-md transition-all active:scale-95"
            >
              <History size={18} />
            </button>
            <button
              onClick={() => {
                setActiveIndex(index);
                setShowUpdateFollowup(true);
              }}
              className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:border-[#FA9C42] hover:text-[#FA9C42] hover:shadow-md transition-all active:scale-95"
            >
              Follow-up <ChevronRight size={16} />
            </button>
          </div>
        </td>
        {/* -------------------------------------- */}
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
    <div className="bg-[#FCFCFC] w-full max-w-5xl rounded-[40px] shadow-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
      
      {/* Header */}
      <div className="px-10 py-8 flex justify-between items-center border-b border-slate-100 bg-white">
        <div>
         <h2 className="text-2xl font-black text-slate-900">
  {isEditing ? "Edit Client Details" : "Register New Client"}
</h2>
          <p className="text-slate-500 text-sm font-medium">Fill in the details to create a new project record</p>
        </div>
        <button 
          onClick={() => setShowModal(false)} 
          className="p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
        >
          <X size={20}/>
        </button>
      </div>
      
      <form onSubmit={saveCustomer} className="p-10 overflow-y-auto custom-scrollbar bg-[#FCFCFC]">
        <div className="space-y-12">
          
          {/* SECTION 1: PERSONAL CONTACT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="col-span-1">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#FA9C42]">Personal Contact</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">Basic information about the client and how to reach them.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="First Name" name="name" value={customer.name} onChange={handleChange} error={errors.name} placeholder="e.g. Rahul" icon={User} />
              <InputField label="Last Name" name="Last_Name" value={customer.Last_Name} onChange={handleChange} error={errors.Last_Name} placeholder="e.g. Sharma" />
              <InputField label="Mobile Number" name="phone" value={customer.phone} onChange={handleChange} error={errors.phone} placeholder="98XXXXXXXX" icon={Phone} />
              <InputField label="Email Address" name="email" value={customer.email} onChange={handleChange} error={errors.email} placeholder="rahul@example.com" icon={Mail} />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 2: PROJECT SPECIFICS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="col-span-1">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#FA9C42]">Project Details</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">Specifics about the construction site or project location.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Project Name" name="projectName" value={customer.projectName} onChange={handleChange} placeholder="e.g. Skyline Heights" icon={Briefcase} />
              <InputField label="Site Name/Location" name="siteName" value={customer.siteName} onChange={handleChange} placeholder="e.g. Bandra West" icon={MapPin} />
              <SelectField label="Site Type" name="siteType" value={customer.siteType} onChange={handleChange} options={["Residential", "Commercial", "Industrial", "Other"]} />
              <SelectField label="Priority Level" name="priority" value={customer.priority} onChange={handleChange} options={["Low", "Medium", "High", "Urgent"]} />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* SECTION 3: ASSIGNMENT & NOTES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="col-span-1">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#FA9C42]">Internal Assignment</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">Assign team members and add administrative remarks.</p>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField label="Assigned Employee" name="assignedEmployee" value={customer.assignedEmployee} onChange={handleChange} options={["Rahul", "Sagar", "Pritesh"]} />
                <SelectField label="Associated Architect" name="assignedArchitect" value={customer.assignedArchitect} onChange={handleChange} options={["Ar. Mehta", "Ar. Deshmukh", "None"]} />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Additional Notes</label>
                <textarea 
                  name="notes"
                  value={customer.notes}
                  onChange={handleChange}
                  placeholder="Any specific requirements or follow-up instructions..."
                  className="w-full p-4 min-h-[120px] bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-[#FA9C42]/10 focus:border-[#FA9C42] outline-none transition-all resize-none text-slate-700 font-medium"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end items-center gap-6">
          <button 
            type="button" 
            onClick={() => setShowModal(false)} 
            className="font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Discard Changes
          </button>
          <button 
  type="submit" 
  disabled={isSubmitting} 
  className="group relative px-12 py-4 bg-[#FA9C42] text-white font-black rounded-2xl shadow-xl shadow-[#FA9C42]/20 hover:bg-[#e88b32] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-slate-300 disabled:shadow-none"
>
  <span className="flex items-center gap-2">
    {/* Dynamic Text Logic */}
    {isSubmitting 
      ? (isEditing ? "Updating..." : "Creating...") 
      : (isEditing ? "Update Record" : "Confirm & Save Record")
    }
    
    {/* Dynamic Icon Logic */}
    {!isSubmitting && (
      <ChevronRight 
        size={18} 
        className="group-hover:translate-x-1 transition-transform" 
      />
    )}
  </span>
</button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* --- FOLLOW-UP MODAL (Compact) --- */}
      {/* --- HISTORY SLIDE-OVER / MODAL --- */}
{showHistory && selectedCustomer && (
  <div className="fixed inset-0 z-[120] flex justify-end bg-slate-900/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-lg h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
      
      {/* Header */}
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Interaction History</h2>
          <p className="text-slate-500 text-sm font-medium">Timeline for {selectedCustomer.name}</p>
        </div>
        <button 
          onClick={() => setShowHistory(false)} 
          className="p-3 bg-white rounded-full shadow-sm hover:text-red-500 transition-colors"
        >
          <X size={20}/>
        </button>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {selectedCustomer.followups && selectedCustomer.followups.length > 0 ? (
          <div className="relative border-l-2 border-slate-100 ml-3 space-y-10">
            {selectedCustomer.followups.map((log, idx) => (
              <div key={idx} className="relative pl-8">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-[#FA9C42] shadow-sm"></div>
                
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-[#FA9C42]/30 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FA9C42] bg-[#FA9C42]/10 px-3 py-1 rounded-full">
                      {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <History size={14} className="text-slate-300" />
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {log.response || "No notes provided for this interaction."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
              <History size={32} className="text-slate-200" />
            </div>
            <div>
              <p className="font-bold text-slate-400">No History Found</p>
              <p className="text-sm text-slate-300">Start a follow-up to see logs here.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-8 border-t border-slate-100 bg-slate-50/30">
        <button 
          onClick={() => setShowHistory(false)}
          className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all"
        >
          Close History
        </button>
      </div>
    </div>
  </div>
)}
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