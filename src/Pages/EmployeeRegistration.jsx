import axios from "axios";
import {
  Ban,
  Camera,
  CheckCircle,
  CheckCircle2,
  Edit3,
  Eye, EyeOff,
  Plus,
  Search,
  Trash2,
  Upload,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { deleteEmployeeAPI, getEmployeesAPI, toggleStatusAPI } from "../Component/API/employeeApi";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";

export default function EmployeeRegistration() {
  const { permissions, user, loading, role } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [showPass, setShowPass] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    commission: "",
    birthdate: "",
    phone: "",
    salary: "",
    expense: "",
    aadhar: null,
    pancard: null,
    status: "active", // added status field
    profile: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  console.log(employee, "employee")
  const fetchEmployeesFromDB = async (page = 1) => {
    try {
      // Note: Update your getEmployeesAPI to handle the URL: `${BASEURL}/api/employees?page=${page}&limit=${limit}`
      const res = await getEmployeesAPI(page, limit);

      if (res.data.success) {
        setEmployeeList(res.data.employees);
        setTotalPages(res.data.pagination.totalPages);
        setCurrentPage(res.data.pagination.currentPage);
      }
    } catch (err) { console.log(err); }
  };

  // Update useEffect to watch currentPage
  useEffect(() => {
    fetchEmployeesFromDB(currentPage);
  }, [currentPage]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedEmployee = { ...employee, [name]: value };

    // Auto-generate email if name field is being changed
    if (name === "name" && value) {
      updatedEmployee.email = value.toLowerCase().replace(/\s+/g, '.') + '@theceramicstudio.com';
    }

    setEmployee(updatedEmployee);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleEdit = (item) => {
    setEmployee(item);
    setModalMode("edit");
    setShowModal(true);
  };

  // NEW: Toggle Block/Unblock Status
  const handleToggleStatus = async (id, currentStatus) => {
    // Determine the new status to send
    debugger
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';

    try {
      const response = await toggleStatusAPI(id, newStatus);

      if (response.data.success) {
        // Update the local state list so the button changes instantly
        setEmployeeList(prevList =>
          prevList.map(emp =>
            emp.id === id ? { ...emp, status: newStatus } : emp
          )
        );
        // Optional: Add a toast notification here
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Error updating status. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this employee?")) {
      try {
        await deleteEmployeeAPI(id);
        fetchEmployeesFromDB();
      } catch (err) { console.log(err); }
    }
  };
  const saveEmployee = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // 1. Append Text Fields
    const textFields = [
      'name', 'email', 'password', 'commission', 'birthdate',
      'phone', 'salary', 'expense', 'advance', 'status'
    ];

    textFields.forEach(field => {
      formData.append(field, employee[field] ?? "");
    });

    // 2. Append File Objects (Names must match backend upload.fields)
    if (employee.aadhar instanceof File) formData.append("aadhar", employee.aadhar);
    if (employee.pancard instanceof File) formData.append("pancard", employee.pancard);
    if (employee.profile instanceof File) formData.append("profile", employee.profile);

    try {
      // IMPORTANT: Ensure your axios call uses these headers
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      let response;
      if (modalMode === "add") {
        response = await axios.post(`${BASEURL}/api/employees/add`, formData, config);
      } else {
        response = await axios.put(`${BASEURL}api/employees/update/${employee.id}`, formData, config);
      }

      if (response.data.success) {
        fetchEmployeesFromDB();
        setShowModal(false);
        resetForm();
        alert("Employee Profile Created Successfully!");
      }
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to save employee");
    }
  };

  const resetForm = () => {
    setEmployee({ name: "", email: "", password: "", commission: "", birthdate: "", phone: "", salary: "", expense: "", advance: "", aadhar: null, pancard: null, status: "active" });
  };

  return (
    <div className="p-8 bg-[#fcfcfc] min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Title */}
          <div className="min-w-[240px]">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Employee Directory
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              Manage team members, payroll, and access status
            </p>
          </div>

          <div className="flex gap-6">
            {/* Search */}
            <div className="relative w-full sm:w-[320px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FA9C42]/20 focus:border-[#FA9C42] transition-all"
              />
            </div>

            {/* Button */}
            {(role === "admin" ||
              role === "superadmin" ||
              permissions?.["Employee Registration_Add"] === true) && (
                <button
                  onClick={() => {
                    setModalMode("add");
                    resetForm();
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 bg-[#FA9C42] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-[#e88b32] transition-all active:scale-95 shrink-0"
                >
                  <Plus size={20} strokeWidth={3} />
                  Add New Employee
                </button>
              )}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Employee Details", "Phone", "Salary", "Status", "Actions"].map((h) => (
                <th key={h} className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {employeeList
              .filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone.includes(searchTerm)
              )
              .map((item, index) => (
                <tr key={index} className={`hover:bg-slate-50/80 transition-all ${item.status === 'blocked' ? 'bg-slate-50/50' : ''}`}>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${item.status === 'blocked' ? 'bg-slate-200 text-slate-500' : 'bg-orange-100 text-[#FA9C42]'}`}>
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-bold ${item.status === 'blocked' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.name}</p>
                        <p className="text-xs text-slate-400">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-sm font-medium text-slate-600">{item.phone}</td>
                  <td className="p-5">
                    <span className="font-bold text-slate-700">₹{item.salary}</span>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${item.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-2">
                      {/* TOGGLE STATUS BUTTON */}


                      <button
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`p-2 rounded-lg transition-all ${item.status === 'active' ? 'text-slate-300 hover:text-red-500 hover:bg-red-50' : 'text-red-500 bg-red-50 hover:bg-red-100'}`}
                        title={item.status === 'active' ? "Block Employee" : "Unblock Employee"}
                      >
                        {item.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                      </button>
                      {(role === "admin" || role === "superadmin" || permissions?.["Employee Registration_Edit"] === true) && (
                        <button onClick={() => handleEdit(item)} className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit3 size={18} />
                        </button>

                      )}
                      {/* EDIT BUTTON */}


                      {/* DELETE BUTTON */}
                      {(role === "admin" || role === "superadmin" || permissions?.["Employee Registration_Delete"] === true) && (
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>

                      )}

                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* --- PAGINATION FOOTER --- */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1
                    ? "bg-[#FA9C42] text-white shadow-md shadow-orange-100"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL SECTION - RESTORED ALL FIELDS */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="w-full max-w-[850px] bg-[#FFF7EF] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20">
            <div className="px-10 pt-8 pb-4 shrink-0 flex justify-between items-center bg-white/40 border-b border-orange-100">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                  {modalMode === "edit" ? "Update Profile" : "New Registration"}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Complete all fields to manage employee data</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={saveEmployee} className="px-10 pb-10 pt-6 overflow-y-auto flex-grow custom-scrollbar">
              <div className="space-y-10">

                {/* SECTION 1: PERSONAL */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FA9C42] border-b border-orange-100 pb-2">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-5">
                    <input name="name" value={employee.name} onChange={handleChange} placeholder="Full Name" className="p-4 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-[#FA9C42] transition-all font-medium" required />
                    <input name="phone" value={employee.phone} placeholder="Mobile Number" className="p-4 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-[#FA9C42] transition-all font-medium" required onKeyDown={(e) => {
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
                      onWheel={(e) => e.target.blur()}
                    />
                    <input
                      type="date"
                      name="birthdate"
                      // This split ensures that if the date is ISO, it only takes the YYYY-MM-DD part
                      value={employee.birthdate ? employee.birthdate.split("T")[0] : ""}
                      onChange={handleChange}
                      className="p-4 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-[#FA9C42] transition-all font-medium text-slate-500"
                    />
                    <input name="email" value={employee.email} readOnly placeholder="Auto-generated Email" className="p-4 rounded-xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-[#FA9C42] transition-all font-medium text-slate-500 cursor-not-allowed" required />
                  </div>
                </div>

                {/* SECTION 2: SYSTEM & PAYROLL */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FA9C42] border-b border-orange-100 pb-2">Payroll & Access</h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} name="password" value={employee.password} onChange={handleChange} placeholder="Access Password"
                        className="w-full p-4 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-[#FA9C42] transition-all font-medium" required />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-5 text-slate-300 hover:text-orange-500">
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <input type="number" name="salary" value={employee.salary} onChange={handleChange} placeholder="Monthly Salary (₹)" className="p-4 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-[#FA9C42] transition-all font-bold text-green-600" />
                    <input type="number" name="expense" value={employee.expense} onChange={handleChange} placeholder="Allowed Expense" className="p-4 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-[#FA9C42] transition-all font-medium" />

                    <input type="number" name="commission" value={employee.commission} onChange={handleChange} placeholder="Commission (%)" className="p-4 rounded-xl border-2 border-slate-100 bg-white outline-none focus:border-[#FA9C42] transition-all font-medium" />
                  </div>
                </div>

                {/* SECTION 3: DOCUMENTS */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FA9C42] border-b border-orange-100 pb-2">Verification Documents</h3>
                  <div className="grid grid-cols-2 gap-8">
                    {['aadhar', 'pancard'].map((doc) => {
                      // 1. Identify the file state (newly picked file)
                      const selectedFile = employee[doc];

                      // 2. Identify the existing URL from your JSON (aadhar_url or pancard_url)
                      const existingUrl = doc === 'aadhar' ? employee.aadhar_url : employee.pancard_url;

                      // 3. Determine what to show in the preview
                      let previewSrc = null;
                      if (selectedFile instanceof File) {
                        previewSrc = URL.createObjectURL(selectedFile);
                      } else if (existingUrl) {
                        previewSrc = existingUrl;
                      }

                      return (
                        <label key={doc} className={`relative group flex flex-col items-center justify-center h-44 border-2 border-dashed rounded-3xl cursor-pointer transition-all overflow-hidden ${previewSrc ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                          {previewSrc ? (
                            <>
                              {/* Actual Image Preview */}
                              <img
                                src={previewSrc}
                                alt={doc}
                                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                              />

                              {/* Hover Overlay to signal they can change the image */}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <div className="flex flex-col items-center gap-2">
                                  <Upload className="text-white" size={20} />
                                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change {doc}</span>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div className="absolute top-3 right-3 bg-green-500 p-1 rounded-full shadow-lg z-10">
                                <CheckCircle2 className="text-white" size={14} />
                              </div>
                            </>
                          ) : (
                            <>
                              <Upload className="text-slate-300 mb-2 group-hover:scale-110 transition-transform" size={24} />
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload {doc}</span>
                            </>
                          )}

                          <input
                            type="file"
                            name={doc}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col items-center mb-6">
                  <label className="relative cursor-pointer group">
                    <div className="w-32 h-32 rounded-full border-4 border-orange-100 overflow-hidden bg-slate-100 flex items-center justify-center transition-all group-hover:border-[#FA9C42]">
                      {employee.profile ? (
                        <img
                          src={employee.profile instanceof File ? URL.createObjectURL(employee.profile) : employee.profile_url}
                          className="w-full h-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        <Camera className="text-slate-300" size={40} />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[#FA9C42] p-2 rounded-full text-white shadow-lg">
                      <Upload size={16} />
                    </div>
                    <input
                      type="file"
                      name="profile"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  <p className="text-[10px] font-bold uppercase text-slate-400 mt-2 tracking-widest">Face Reference Photo</p>
                </div>
              </div>

              {/* STICKY FOOTER ACTION */}
              <div className="flex justify-end gap-4 mt-12 border-t border-slate-100 pt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors">Discard</button>
                <button type="submit" className="px-12 py-3 bg-[#FA9C42] text-white rounded-2xl font-black shadow-xl shadow-orange-200 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-wider text-sm">
                  {modalMode === "edit" ? "Update Member" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}