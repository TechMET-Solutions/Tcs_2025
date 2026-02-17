import axios from "axios";
import { useEffect, useState } from "react";
// Importing all necessary icons
import {
  Award,
  Calendar,
  Edit3,
  Percent,
  Phone,
  Plus,
  Search,
  Trash2,
  UserCircle,
  Users,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatIndianDate } from "../utils/formatIndianDate";

import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";

const BASE_URL = `${BASEURL}/api/architects`;


export default function ArchitectRegistration() {
  // --- STATE ---
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [searchTerm, setSearchTerm] = useState("");
  const [architectList, setArchitectList] = useState([]);
  const navigate = useNavigate();
  const [architect, setArchitect] = useState({
    firstname: "",
    lastname: "",
    whatsapp: "",
    // commission: "",
    birthdate: "",
    loyaltyPoints: "",
    remark: ""
  });
  const { permissions, user, loading, role } = useAuth();

  const [customerCounts, setCustomerCounts] = useState({});


  // --- API CALLS ---
  // const fetchArchitects = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/list`);
  //     setArchitectList(res.data.architects || []);
  //     console.log("Fetched Architects:", res.data.architects);
  //   } catch (err) {
  //     console.error("Fetch Error:", err);
  //   }
  // };

  const fetchArchitects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/list`);
      const architects = res.data.architects || [];
      setArchitectList(architects);

      // Fetch customer count for each architect
      const counts = {};
      await Promise.all(
        architects.map(async (arch) => {
          try {
            const r = await axios.get(
              `${BASEURL}/api/architects/getCustomersById/${arch.id}?page=1&limit=1`
            );
            counts[arch.id] = r.data.pagination.totalItems || 0;
          } catch {
            counts[arch.id] = 0;
          }
        })
      );

      setCustomerCounts(counts);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };


  useEffect(() => {
    fetchArchitects();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert value to uppercase for all text fields
    // If you want to exclude numbers (like whatsapp), you can add a condition
    const formattedValue = (name === "firstname" || name === "lastname" || name === "remark")
      ? value.toUpperCase()
      : value;

    setArchitect({
      ...architect,
      [name]: formattedValue
    });
  };

  const handleOpenAddModal = () => {
    setArchitect({
      firstname: "",
      lastname: "",
      whatsapp: "",
      // commission: "",
      birthdate: "",
      loyaltyPoints: "",
      remark: ""
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

  const deleteArchitect = async (id) => {
    if (!window.confirm("Are you sure you want to delete this architect?")) return;
    try {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      fetchArchitects();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };


  // --- FILTER LOGIC ---
  const filteredList = architectList.filter(item =>
    item.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // --- NEW STATE FOR CUSTOMER MODAL ---
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedArchitectName, setSelectedArchitectName] = useState("");
  const [associatedCustomers, setAssociatedCustomers] = useState([]);
  const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentArchitectId, setCurrentArchitectId] = useState(null);

  const [totalCustomerCount, setTotalCustomerCount] = useState(0);

  const fetchAssociatedCustomers = async (architect, page = 1) => {
    setIsFetchingCustomers(true);
    setCurrentArchitectId(architect.id);
    setSelectedArchitectName(`${architect.firstname} ${architect.lastname}`);

    try {
      const res = await axios.get(
        `${BASEURL}/api/architects/getCustomersById/${architect.id}?page=${page}&limit=5`
      );

      setAssociatedCustomers(res.data.customers || []);
      setTotalPages(res.data.pagination.totalPages);
      setCurrentPage(res.data.pagination.currentPage);

      // Capture the total length here
      setTotalCustomerCount(res.data.pagination.totalItems);

      setShowCustomerModal(true);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setIsFetchingCustomers(false);
    }
  };


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
          <div className="flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FA9C42]/20 focus:border-[#FA9C42] transition-all w-full"
            />
          </div>

          {(role === "admin" || role === "superadmin" || permissions?.["Architect Registration_Add"] === true) && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 bg-[#FA9C42] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-[#e88b32] transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus size={20} strokeWidth={3} /> Add Architect
            </button>

          )}

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
                {/* <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Commission</th> */}
                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Birthdate</th>
                <th className="py-5 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Client Count</th>
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
                    {/* <td className="py-4 px-6 cursor-pointer" onClick={() => navigate(`/architect/${item.id}`)}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#FA9C42] group-hover:text-white transition-all">
                          <UserCircle size={20} />
                        </div>
                        <span className="font-bold text-slate-700 hover:text-[#FA9C42] underline decoration-dotted">
                          {item.firstname} {item.lastname}
                        </span>

                      </div>
                    </td> */}
                    <td
                      className={`py-4 px-6 ${(role === "admin" || role === "superadmin") ? "cursor-pointer" : "cursor-default"}`}
                      onClick={() => {
                        if (role === "admin" || role === "superadmin") {
                          navigate(`/architect/${item.id}`);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 transition-all ${(role === "admin" || role === "superadmin") ? "group-hover:bg-[#FA9C42] group-hover:text-white" : ""}`}>
                          <UserCircle size={20} />
                        </div>

                        <span className={`font-bold text-slate-700 transition-all ${(role === "admin" || role === "superadmin") ? "hover:text-[#FA9C42] underline decoration-dotted" : ""}`}>
                          {item.firstname} {item.lastname}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-green-500" /> {item.whatsapp}
                      </div>
                    </td>
                    {/* <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 bg-orange-50 text-[#FA9C42] rounded-full text-xs font-black">
                        {item.commission}%
                      </span>
                    </td> */}
                    <td className="py-4 px-6 text-sm text-slate-500 font-medium">{formatIndianDate(item.birthdate)}</td>
                    <td
                      className="py-4 px-6 cursor-pointer group/points"
                      onClick={() => fetchAssociatedCustomers(item)}
                    >
                      <div className="flex items-center gap-1.5 text-blue-600 font-bold group-hover/points:text-blue-800 transition-colors">
                        <Award size={16} className={isFetchingCustomers ? "animate-spin" : ""} />
                        <span className="border-b border-blue-200 group-hover/points:border-blue-600">
                          {customerCounts[item.id] ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 transition-opacity">
                        {(role === "admin" || role === "superadmin" || permissions?.["Architect Registration_Edit"] === true) && (
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 hover:bg-white rounded-lg shadow-sm border border-slate-100 text-slate-400 hover:text-[#FA9C42] hover:border-[#FA9C42] "
                          >
                            <Edit3 size={16} />
                          </button>

                        )}

                        {(role === "admin" || role === "superadmin" || permissions?.["Architect Registration_Delete"] === true) && (
                          <button
                            onClick={() => deleteArchitect(item.id)}
                            className="p-2 hover:bg-white rounded-lg shadow-sm border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-500">
                            <Trash2 size={16} />
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
                  <input
                    name="firstname"
                    value={architect.firstname}
                    onChange={handleChange}
                    placeholder="e.g. Rahul"
                    className="w-full px-4 uppercase py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42]"
                    required
                  />

                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Last Name *</label>
                  <input
                    name="lastname"
                    value={architect.lastname}
                    onChange={handleChange}
                    placeholder="e.g. Mehta"
                    className="w-full px-4 py-3 rounded-xl uppercase bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all font-medium text-slate-700"
                    required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input name="whatsapp"
                      type="number"
                      value={architect.whatsapp}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;

                        // typing ke time max 10 digits
                        if (value.length <= 10) {
                          handleChange(e);
                        }
                      }}
                      onWheel={(e) => e.target.blur()} placeholder="+91 XXXXXXXXXX" className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all font-medium" required />
                  </div>
                </div>
                {/* <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Commission Rate</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FA9C42]" size={16} />
                    <input type="number" name="commission" value={architect.commission} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all font-bold text-[#FA9C42]" required />
                  </div>
                </div> */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Birthdate</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="date"
                      name="birthdate"
                      // value={architect.birthdate}
                      value={architect.birthdate ? architect.birthdate.split("T")[0] : ""}

                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all font-medium" />
                  </div>
                </div>
                {/* <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Loyalty Points</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                    <input type="number" name="loyaltyPoints" value={architect.loyaltyPoints} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#FA9C42] outline-none transition-all font-bold text-blue-600" />
                  </div>
                </div> */}
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


      {/* --- CUSTOMER LIST MODAL --- */}
      {/* --- CUSTOMER LIST MODAL (Quotation Style Layout) --- */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">

            {/* HEADER */}
            <div className="px-8 py-6 flex justify-between items-center border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black text-[#334155] tracking-tight">Referred Customers</h2>
                <p className="text-slate-500 font-medium">Architect: {selectedArchitectName}</p>
              </div>
              <button onClick={() => setShowCustomerModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* CONTENT AREA */}
            <div className="p-6 overflow-y-auto bg-white space-y-4">
              {associatedCustomers.length === 0 ? (
                <div className="text-center py-20">
                  <Users size={48} className="mx-auto mb-4 text-slate-200" />
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-sm">No customers linked</p>
                </div>
              ) : (
                associatedCustomers.map((customer, index) => (
                  <div
                    key={customer.id}
                    className={`relative p-6 rounded-[20px] border transition-all ${index === 0
                      ? "border-blue-400 bg-white shadow-md shadow-blue-50"
                      : "border-slate-100 bg-white"
                      }`}
                  >
                    {/* TOP ROW: Name & Contact Status */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-black">
                          #{customer.id}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-slate-800">
                            {customer.name} {customer.Last_Name}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> Registered
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Phone</p>
                          <p className="text-lg font-bold text-slate-700">{customer.phone}</p>
                        </div>
                        <div className="text-right border-l border-slate-100 pl-8">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-red-500">Alt Phone</p>
                          <p className="text-lg font-bold text-red-500">{customer.altphone || "N/A"}</p>
                        </div>
                        
                      </div>
                    </div>

                    {/* BOTTOM ROW: Secondary Info */}
                    <div className="pt-4 border-t border-dashed border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</p>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">{customer.email}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER - Pagination Style */}
            <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-between items-center">
              <p className="text-xs font-bold text-slate-400">
                Showing Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => fetchAssociatedCustomers({ id: currentArchitectId }, currentPage - 1)}
                  className="px-4 py-2 border rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-slate-50 transition-all"
                >
                  Prev
                </button>

                <div className="bg-[#FA9C42] text-white px-4 py-2 rounded-xl text-sm font-bold">
                  {currentPage}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => fetchAssociatedCustomers({ id: currentArchitectId }, currentPage + 1)}
                  className="px-4 py-2 border rounded-xl text-sm font-bold disabled:opacity-30 hover:bg-slate-50 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}