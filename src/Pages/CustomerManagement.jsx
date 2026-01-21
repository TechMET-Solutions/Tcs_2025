import axios from "axios";
import {
  Briefcase,
  Calendar,
  ChevronRight,
  Edit2,
  History,
  Mail,
  MapPin,
  Phone,
  Plus,
  Receipt,
  Search,
  User,
  X,
  FileText,
  ChevronLeft,
  Package,
   Eye 
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";

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
const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  icon: Icon,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <Icon
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FA9C42] transition-colors"
        />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${Icon ? "pl-11" : "px-4"} py-3 rounded-2xl bg-white border border-slate-200 transition-all outline-none focus:ring-4 focus:ring-[#FA9C42]/10 focus:border-[#FA9C42] shadow-sm ${error ? "border-red-400 ring-4 ring-red-500/10" : ""}`}
      />
    </div>
    {error && (
      <p className="text-[10px] text-red-500 font-bold mt-0.5 ml-1 uppercase tracking-tight">
        {error}
      </p>
    )}
  </div>
);

const SelectField = ({ label, name, value, onChange, error, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">
      {label}
    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-2xl bg-white border transition-all outline-none appearance-none cursor-pointer shadow-sm
        ${
          error
            ? "border-red-400 ring-4 ring-red-500/10"
            : "border-slate-200 focus:border-[#FA9C42] focus:ring-4 focus:ring-[#FA9C42]/10"
        }`}
    >
      <option value="">Select Option</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>

    {error && (
      <p className="text-[10px] text-red-500 font-bold mt-0.5 ml-1 uppercase tracking-tight">
        {error}
      </p>
    )}
  </div>
);

export default function CustomerManagement() {
  const BASE_URL = `${BASEURL}api/users`;
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpdateFollowup, setShowUpdateFollowup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [customerList, setCustomerList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const [followupUpdate, setFollowupUpdate] = useState({
    date: getTodayDate(),
    response: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentPage, "currentPage");
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // You can make this dynamic if needed
  const { permissions, user, loading, role } = useAuth();
  console.log(permissions, user, loading, role);
  const [employees, setEmployees] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  console.log(employees, "employees");
  const [architects, setArchitects] = useState([]);
  const [architectsData, setArchitectsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    Last_Name: "",
    phone: "",
    altphone: "",
    email: "",
    assignedEmployee: "",
    assignedArchitect: "",
    status: "New",
    notes: "",
    projectName: "",
    siteName: "",
    billingName: "",
    siteType: "",
    priority: "Low",
    assignedEmployeeId: "",
    assignedArchitectId: "",
  });
  const [priorityFilter, setPriorityFilter] = useState("");
  console.log(customer, "custoemr");
  const fetchCustomers = async (page = 1) => {
    debugger;
    try {
      let url;

      // Check if the user is an employee based on the role data you provided
      if (role === "employee") {
        // Use the NEW route and pass the employee ID as a query parameter
        url = `${BASE_URL}/list/employee?page=${page}&limit=${itemsPerPage}&employeeId=${user.id}`;
      } else {
        // Admin/Superadmin uses the original route
        url = `${BASE_URL}/list?page=${page}&limit=${itemsPerPage}`;
      }

      const res = await axios.get(url);

      setCustomerList(res.data.customers || []);
      setTotalPages(res.data.pagination.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientQuotations, setClientQuotations] = useState([]);
  const [qPage, setQPage] = useState(1);
  const [qTotalPages, setQTotalPages] = useState(1);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${BASEURL}/api/employees/list`);

      const employeeNames = res.data.employees.map((emp) => emp.name);

      setEmployees(employeeNames);
      setEmployeesData(res.data.employees);
      console.log("Employee Names:", employeeNames);
    } catch (err) {
      console.log("Error fetching employees:", err);
    }
  };

  const fetchArchitects = async () => {
    try {
      const res = await axios.get(`${BASEURL}/api/architects/list`);

      const architectNames = res.data.architects.map((arch) =>
        `${arch.firstname} ${arch.lastname}`.trim(),
      );

      setArchitects([...architectNames]);
      setArchitectsData(res.data.architects);
      console.log("Architect Names:", architectNames);
    } catch (err) {
      console.log("Error fetching architects:", err);
    }
  };

  const apiCalled = useRef(false);

  useEffect(() => {
    debugger;
    // 1. Check if role exists (not null/undefined/empty)
    // 2. Ensure api hasn't been called yet
    if (role && !apiCalled.current) {
      // If it's an employee, we also need the user.id to be present
      if (role === "employee" && !user?.id) {
        return; // Wait until user data is fully loaded
      }

      apiCalled.current = true;

      fetchEmployees();
      fetchArchitects();
    }
    fetchCustomers(currentPage);
  }, [role, user, currentPage]); // Added dependencies to re-run if they change

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "assignedEmployee") {
      const selectedEmployee = employeesData.find((emp) => emp.name === value);

      setCustomer((prev) => ({
        ...prev,
        assignedEmployee: value,
        assignedEmployeeName: value,
        assignedEmployeeId: selectedEmployee ? selectedEmployee.id : "",
      }));
    } else if (name === "assignedArchitect") {
      const selectedArchitect = architectsData.find(
        (arch) => `${arch.firstname} ${arch.lastname}`.trim() === value,
      );

      setCustomer((prev) => ({
        ...prev,
        assignedArchitect: value,
        assignedArchitectName: value,
        assignedArchitectId: selectedArchitect ? selectedArchitect.id : "",
      }));
    } else {
      setCustomer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFollowupInput = (e) =>
    setFollowupUpdate({ ...followupUpdate, [e.target.name]: e.target.value });

  const validate = () => {
    let newErrors = {};

    // Mandatory Fields
    if (!customer.name?.trim()) newErrors.name = "First name is required";
    if (!customer.Last_Name?.trim())
      newErrors.Last_Name = "Last name is required";
    if (!customer.phone?.trim()) newErrors.phone = "Mobile number is required";
    if (!customer.assignedEmployee?.trim())
      newErrors.assignedEmployee = "Employee assignment is required";
    if (!customer.assignedArchitect?.trim())
      newErrors.assignedArchitect = "Architect assignment is required";

    setErrors(newErrors);

    // Returns true only if no errors found
    return Object.keys(newErrors).length === 0;
  };

  const saveCustomer = async (e) => {
    e.preventDefault();

    // 1. Run Validation
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // 2. Prepare Data: Convert empty strings to NULL
      const dataToSave = Object.keys(customer).reduce((acc, key) => {
        const value = customer[key];
        acc[key] =
          typeof value === "string" && value.trim() === "" ? null : value;
        return acc;
      }, {});

      // 3. API Call
      let response;
      if (isEditing) {
        response = await axios.put(
          `${BASE_URL}/update/${customer.id}`,
          dataToSave,
        );
      } else {
        response = await axios.post(`${BASE_URL}/add`, dataToSave);
      }

      // 4. Success Actions
      fetchCustomers();
      setShowModal(false);
      setErrors({});
      alert("✅ Customer saved successfully!");
    } catch (err) {
      console.error("Save Error:", err);

      // 5. Extract the specific error message from the backend
      const errorMessage =
        err.response?.data?.message || "Operation failed. Please try again.";

      // 6. Show the Alert with the specific error (e.g., "Already Exists")
      alert(errorMessage);

      // Also set it in state if you want to show it on the UI
      setErrors({ server: errorMessage });
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
    } catch (err) {
      console.log(err);
    }
  };

  const openHistory = async (item) => {
    debugger;
    try {
      const res = await axios.get(`${BASE_URL}/followups/${item.id}`);
      setSelectedCustomer({ ...item, followups: res.data.followups || [] });
      setShowHistory(true);
    } catch (err) {
      console.log(err);
    }
  };
  const handleOpenModal = () => {
    setIsEditing(false);
    setCustomer({
      name: "",
      Last_Name: "",
      phone: "",
      altphone: "",
      email: "",
      assignedEmployee: "",
      assignedArchitect: "",
      status: "New",
      notes: "",
      projectName: "",
      siteName: "",
      billingName: "",
      siteType: "",
      priority: "Low",
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCustomer(item); // Populate form with existing data
    setShowModal(true);
  };

  const priorityStyles = {
    Urgent: "bg-red-50 hover:bg-red-100/80 border-l-4 border-l-red-600",
    High: "bg-orange-50 hover:bg-orange-100/80 border-l-4 border-l-orange-500",
    Medium: "bg-blue-50 hover:bg-blue-100/80 border-l-4 border-l-blue-400",
    Low: "bg-white hover:bg-slate-50",
  };
  const openCustomerQuotations = async (client, page = 1) => {
    try {
      setSelectedClient(client);
      setIsQuotationModalOpen(true);

      const res = await fetch(
        `${BASEURL}/api/Quotation/customer/${client.id}?page=${page}&limit=10`,
      );
      const result = await res.json();

      if (result.success) {
        setClientQuotations(result.quotations);
        setQTotalPages(result.pagination.totalPages);
        setQPage(result.pagination.currentPage);
      } else {
        setClientQuotations([]);
      }
    } catch (err) {
      console.error("Failed to fetch customer quotations", err);
      setClientQuotations([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-['Lexend'] text-slate-800">
      {/* --- HEADER SECTION --- */}
      <div className=" mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            CRM Portal
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your clients and track project follow-ups
          </p>
        </div>
        {(role === "admin" ||
          role === "superadmin" ||
          permissions?.["Customer Management_Add"] === true) && (
          <button
            onClick={() => handleOpenModal()}
            className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-slate-200 hover:bg-[#FA9C42] hover:shadow-[#FA9C42]/20 transition-all active:scale-95"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
            <span className="font-bold">New Customer</span>
          </button>
        )}
      </div>

      {/* --- STATS OVERVIEW (Visual Polish) --- */}
      <div className="mx-auto mb-10 flex flex-wrap items-center justify-between gap-6">
        {/* Stats */}

        {/* Search and Filters */}
        <div className="flex gap-4 items-end">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              {
                label: "Total Leads",
                val: customerList.length,
                color: "text-blue-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex justify-between items-center min-w-[220px]"
              >
                <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className={`text-3xl font-black ${stat.color}`}>
                  {stat.val}
                </span>
              </div>
            ))}
          </div>
          <div className="relative bg-white rounded-2xl shadow-sm flex justify-between items-center min-w-[320px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2  border-[#FA9C42]/80 bg-white outline-none transition-all"
            />
          </div>
          <div className="bg-white rounded-2xl shadow-sm min-w-[200px]">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#FA9C42]/80 bg-white outline-none transition-all cursor-pointer appearance-none font-bold text-slate-700"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className=" mx-auto bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Customer Info
                </th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Assignment
                </th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Project Details
                </th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">
                  PRIORITY LEVEL
                </th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customerList.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-20 text-slate-400 font-medium"
                  >
                    No records found. Click "New Customer" to start.
                  </td>
                </tr>
              ) : (
                customerList
                  .filter(
                    (item) =>
                      ((item.name || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                        (item.Last_Name || "")
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        (item.phone || "").includes(searchTerm)) &&
                      (priorityFilter === "" ||
                        item.priority === priorityFilter),
                  )
                  .map((item, index) => {
                    // --- COLOR LOGIC START ---

                    return (
                      <tr key={index} className={` transition-colors group`}>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-lg group-hover:bg-[#FA9C42]/10 group-hover:text-[#FA9C42] transition-colors"
                              onClick={() => openCustomerQuotations(item)}
                            >
                              {(item.name?.[0] || "").toUpperCase()}
                              {(item.Last_Name?.[0] || "").toUpperCase()}
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
                        <td className="px-8 py-6">
                          <select
                            value={item.priority || "Low"}
                            onChange={async (e) => {
                              const newPriority = e.target.value;
                              const updatedItem = {
                                ...item,
                                priority: newPriority,
                              };
                              const newList = [...customerList];
                              newList[index] = updatedItem;
                              setCustomerList(newList);
                              try {
                                await axios.put(
                                  `${BASE_URL}/update/${item.id}`,
                                  updatedItem,
                                );
                                fetchCustomers();
                              } catch (err) {
                                console.log("Error updating priority:", err);
                                setCustomerList(customerList);
                              }
                            }}
                            className="px-3 py-2 rounded-lg text-xs font-bold uppercase border border-slate-200 bg-white cursor-pointer focus:border-[#FA9C42] focus:ring-2 focus:ring-[#FA9C42]/20 transition-all hover:shadow-md"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                          </select>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-3 items-end">
                            <div className="flex justify-end gap-3 transition-opacity">
                              {(role === "admin" ||
                                role === "superadmin" ||
                                permissions?.["Customer Management_Edit"] ===
                                  true) && (
                                <button
                                  onClick={() => handleEdit(item)}
                                  title="Edit Details"
                                  className="p-2.5 rounded-xl border border-slate-200 text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all active:scale-95"
                                >
                                  <Edit2 size={18} />
                                </button>
                              )}
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
                          </div>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
          {isQuotationModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop with blur */}
              <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setIsQuotationModalOpen(false)}
              ></div>

              <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-5 border-b flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Quotation History
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      Client: {selectedClient?.name} {selectedClient?.Last_Name}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsQuotationModalOpen(false)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Main Content Area */}
                <div className="p-6 overflow-y-auto space-y-4 bg-slate-50/30">
                  {clientQuotations.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText size={32} className="text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium">
                        No quotations found for this client.
                      </p>
                    </div>
                  ) : (
                    clientQuotations.map((q) => (
                      <div
                        key={q.id}
                        className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          {/* Left Side: ID and Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm">
                                #Q{q.id}
                              </span>
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                  Number(q.due_amount) <= 0
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {Number(q.due_amount) <= 0
                                  ? "Settled"
                                  : "Pending"}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400 text-xs">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />{" "}
                                {new Date(q.createdAt).toLocaleDateString(
                                  "en-GB",
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package size={12} /> {q.items?.length || 0}{" "}
                                Products
                              </span>
                            </div>
                          </div>

                          {/* Right Side: Financials */}
                          <div className="flex items-center gap-6">
                            <div className="text-right border-r pr-6 border-slate-100">
                              <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">
                                Total Amount
                              </p>
                              <p className="text-lg font-black text-slate-800">
                                ₹{Number(q.grandTotal).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">
                                Due Balance
                              </p>
                              <p
                                className={`text-lg font-black ${Number(q.due_amount) > 0 ? "text-rose-600" : "text-emerald-600"}`}
                              >
                                ₹{Number(q.due_amount).toLocaleString()}
                              </p>
                            </div>
                            {/* Quick Action inside card */}
                            <button className="p-2 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <Eye size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Item Preview (Optional) */}
                        {q.items && q.items.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-dashed border-slate-100">
                            <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">
                              Primary Item
                            </p>
                            <div className="flex items-center justify-between text-sm text-slate-600">
                              <span>{q.items[0].productName}</span>
                              <span className="font-medium">
                                {q.items[0].size} | {q.items[0].box} Boxes
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination Footer */}
                <div className="px-8 py-4 border-t bg-white flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-medium">
                    Showing Page {qPage} of {qTotalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={qPage === 1}
                      onClick={() =>
                        openCustomerQuotations(selectedClient, qPage - 1)
                      }
                      className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-600 border rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    <div className="flex gap-1">
                      {[...Array(qTotalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            openCustomerQuotations(selectedClient, i + 1)
                          }
                          className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                            qPage === i + 1
                              ? "bg-blue-600 text-white shadow-lg"
                              : "text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={qPage === qTotalPages}
                      onClick={() =>
                        openCustomerQuotations(selectedClient, qPage + 1)
                      }
                      className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-slate-600 border rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- PAGINATION FOOTER --- */}
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 font-medium">
              Showing page{" "}
              <span className="text-slate-900 font-bold">{currentPage}</span> of{" "}
              <span className="text-slate-900 font-bold">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      currentPage === i + 1
                        ? "bg-[#FA9C42] text-white shadow-lg shadow-[#FA9C42]/20"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
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
                <p className="text-slate-500 text-sm font-medium">
                  Fill in the details to create a new project record
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={saveCustomer}
              className="p-10 overflow-y-auto custom-scrollbar bg-[#FCFCFC]"
            >
              <div className="space-y-12">
                {/* SECTION 1: PERSONAL CONTACT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="col-span-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#FA9C42]">
                      Personal Contact
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                      Basic information about the client and how to reach them.
                    </p>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="First Name"
                      name="name"
                      value={customer.name}
                      onChange={handleChange}
                      error={errors.name}
                      placeholder="e.g. Rahul"
                      icon={User}
                    />
                    <InputField
                      label="Last Name"
                      name="Last_Name"
                      value={customer.Last_Name}
                      onChange={handleChange}
                      error={errors.Last_Name}
                      placeholder="e.g. Sharma"
                    />
                    <InputField
                      type="number"
                      label="Mobile Number"
                      name="phone"
                      value={customer.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      placeholder="98XXXXXXXX"
                      icon={Phone}
                    />
                    <InputField
                      type="number"
                      label="Alt Mobile Number"
                      name="altphone"
                      value={customer.altphone}
                      onChange={handleChange}
                      error={errors.altphone}
                      placeholder="98XXXXXXXX"
                      icon={Phone}
                    />
                    <InputField
                      label="Email Address"
                      name="email"
                      value={customer.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="rahul@example.com"
                      icon={Mail}
                    />
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* SECTION 2: PROJECT SPECIFICS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="col-span-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#FA9C42]">
                      Project Details
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                      Specifics about the construction site or project location.
                    </p>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Project Name"
                      name="projectName"
                      value={customer.projectName}
                      onChange={handleChange}
                      placeholder="e.g. Skyline Heights"
                      icon={Briefcase}
                    />
                    <InputField
                      label="Site Name/Location"
                      name="siteName"
                      value={customer.siteName}
                      onChange={handleChange}
                      placeholder="e.g. Bandra West"
                      icon={MapPin}
                    />
                    <SelectField
                      label="Site Type"
                      name="siteType"
                      value={customer.siteType}
                      onChange={handleChange}
                      options={[
                        "Residential",
                        "Commercial",
                        "Industrial",
                        "Other",
                      ]}
                    />
                    <SelectField
                      label="Priority Level"
                      name="priority"
                      value={customer.priority}
                      onChange={handleChange}
                      options={["Low", "Medium", "High", "Urgent"]}
                    />
                    <InputField
                      label="Billing Name"
                      name="billingName"
                      value={customer.billingName}
                      onChange={handleChange}
                      placeholder="e.g. Billing Name"
                      icon={Receipt}
                    />
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* SECTION 3: ASSIGNMENT & NOTES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="col-span-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#FA9C42]">
                      Internal Assignment
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                      Assign team members and add administrative remarks.
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SelectField
                        label="Assigned Employee"
                        name="assignedEmployee"
                        value={customer.assignedEmployee} // This is now the ID, so it matches the option values
                        onChange={handleChange}
                        options={employees}
                        error={errors.assignedEmployee}
                      />

                      <SelectField
                        label="Associated Architect"
                        name="assignedArchitect"
                        value={customer.assignedArchitect}
                        onChange={handleChange}
                        options={architects}
                        error={errors.assignedArchitect}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Additional Notes
                      </label>
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
                      ? isEditing
                        ? "Updating..."
                        : "Creating..."
                      : isEditing
                        ? "Update Record"
                        : "Confirm & Save Record"}

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
                <h2 className="text-2xl font-black text-slate-900">
                  Interaction History
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Timeline for {selectedCustomer.name}
                </p>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-3 bg-white rounded-full shadow-sm hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Timeline Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {selectedCustomer.followups &&
              selectedCustomer.followups.length > 0 ? (
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-10">
                  {selectedCustomer.followups.map((log, idx) => (
                    <div key={idx} className="relative pl-8">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-[#FA9C42] shadow-sm"></div>

                      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-[#FA9C42]/30 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#FA9C42] bg-[#FA9C42]/10 px-3 py-1 rounded-full">
                            {new Date(log.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <History size={14} className="text-slate-300" />
                        </div>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          {log.response ||
                            "No notes provided for this interaction."}
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
                    <p className="text-sm text-slate-300">
                      Start a follow-up to see logs here.
                    </p>
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
              <button
                onClick={() => setShowUpdateFollowup(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-5">
              <InputField
                label="Date"
                name="date"
                value={followupUpdate.date}
                disabled
                icon={History}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                  Notes / Feedback
                </label>
                <textarea
                  name="response"
                  value={followupUpdate.response}
                  onChange={handleFollowupInput}
                  rows={4}
                  placeholder="Customer interested in premium plan..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#FA9C42] outline-none transition-all resize-none shadow-inner"
                />
              </div>
              <button
                onClick={saveNewFollowup}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-[#FA9C42] transition-colors shadow-lg"
              >
                Save Follow-up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
