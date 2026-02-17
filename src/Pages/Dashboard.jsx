import axios from "axios";
import {
  BarChart3,
  Bell,
  Calendar,
  Check,
  CreditCard,
  IndianRupee,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDashboardStats } from "../Component/API/dashboardApi";
import {
  getPendingRequests,
  updateRequestStatus,
} from "../Component/API/paymentApi";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";
import TodoComponent from "./TodoComponent";

export default function Dashboard() {
  const { permissions, user, loading, role } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "customers" | "quotations"
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const openModal = (row, type) => {
    setSelectedEmployee(row);
    setModalType(type);
    setShowModal(true);
  };
  const [userWiseData, setUserWiseData] = useState([]);

  const today = new Date();

  // Start = current month ka 1st day
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);

  // Format function (YYYY-MM-DD)
  const formatDate = (date) => date.toISOString().split("T")[0];

  const [dateRange, setDateRange] = useState({
    start: formatDate(startOfMonth),
    end: formatDate(today),
  });

  // const [dateRange, setDateRange] = useState({
  //   start: "2025-01-23",
  //   end: "2026-01-23",
  // });

  const fetchUserWiseOrders = async () => {
    try {
      const res = await axios.get(`${BASEURL}/api/dashboard/user-wise-orders`, {
        params: { start: dateRange.start, end: dateRange.end },
      });
      if (res.data.success) {
        setUserWiseData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching user wise data:", error);
    }
  };

  const [salesData, setSalesData] = useState([]);
  const [dailyReport, setDailyReport] = useState([]);
  const [stats, setStats] = useState({
    customerCurrentMonthCount: 0,
    monthlyPurchasesTotal: 0,
    monthlyQuestionCount: 0,
    deliveryChallanCount: 0,
  });

  // Function to fetch stats
  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchCharts = async () => {
    const res = await axios.get(`${BASEURL}/api/dashboard/charts`);
    if (res.data.success) {
      setSalesData(
        res.data.data.salesVsPurchase.map((i) => ({
          month: i.month,
          sales: 0, // if you later add sales table
          purchase: Number(i.purchase),
        })),
      );

      setDailyReport(
        res.data.data.cashFlow.map((i) => ({
          day: i.day.slice(0, 3),
          in: Number(i.inAmount),
          out: Number(i.outAmount),
        })),
      );
    }
  };

  const cards = [
    {
      title: "Monthly Customers",
      value: stats.customerCurrentMonthCount,
      icon: <ShoppingCart size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Monthly Purchase",
      value: `₹${Number(stats.monthlyPurchasesTotal).toLocaleString()}`,
      icon: <CreditCard size={22} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Quotations",
      value: stats.monthlyQuestionCount,
      icon: <Receipt size={22} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Delivery Challans",
      value: stats.deliveryChallanCount,
      icon: <BarChart3 size={22} />,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      title: "New Architects",
      value: stats.architectsCount,
      icon: <TrendingUp size={22} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "New Products",
      value: stats.productsCount,
      icon: <Wallet size={22} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  const fetchRequests = async () => {
    try {
      const res = await getPendingRequests();
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };
  useEffect(() => {
    fetchStats();
    fetchCharts();
    fetchRequests();
    fetchUserWiseOrders(); // Add this call
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const res = await updateRequestStatus(requestId, status);
      if (res.data.success) {
        alert(res.data.message);
        // Refresh the list locally
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        // Optional: if you are on the ManageQuotation page, refresh that list too
        if (typeof fetchQuotations === "function") fetchQuotations();
      }
    } catch (error) {
      alert("Action failed: " + error.message);
    }
  };
  const goToQuotations = (row) => {
    navigate("/quotation/manage", {
      state: {
        employeeId: row.employeeId,
        employeeName: row.employeeName,
      },
    });
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-['Lexend'] text-slate-800">
      {/* --- HEADER --- */}
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Calendar size={16} /> Real-time analytics for your business status.
          </p>
        </div>
        <div className="flex gap-3">
          {/* New Payment Request Button */}
          {(role === "admin" ||
            role === "superadmin" ||
            permissions?.["Quotation Management_Payment Requests"] ===
              true) && (
            <button
              onClick={() => setIsModalOpen(true)}
              className=" flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-orange-200 group"
            >
              <Bell size={20} className="group-hover:animate-bounce" />
              <span className="hidden sm:inline">Requests</span>

              {/* Notification Badge */}
              {requests.length > 0 && (
                <>
                  {/* The Actual Count Badge */}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-black text-orange-600 shadow-sm">
                    {requests.length > 99 ? "99+" : requests.length}
                  </span>

                  {/* Animated Ping Effect (Optional: gives a 'Live' feel) */}
                  {/* <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-600"></span>
                  </span> */}
                </>
              )}
            </button>
          )}
          <button
            onClick={() => navigate("/work-panel")}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all"
          >
            Work Panel
          </button>

          {/* <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95">Settings</button> */}
          <TodoComponent />
        </div>
      </div>

      {/* --- STAT CARDS GRID --- */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-xl shadow-slate-200/50 hover:translate-y-[-4px] transition-all duration-300 group"
          >
            <div
              className={`${card.bg} ${card.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              {card.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mb-1">
              {card.title}
            </p>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {card.value}
            </h2>
          </div>
        ))}
      </div>
      <div className="max-w-[1600px] mx-auto bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden mb-10">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            User Wise Order
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={fetchUserWiseOrders}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-md"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-sm font-black text-slate-500 uppercase tracking-wider text-center border-b border-slate-100">
                  Name
                </th>
                <th className="p-6 text-sm font-black text-slate-500 uppercase tracking-wider text-center border-b border-slate-100">
                  Total Attended
                </th>
                <th className="p-6 text-sm font-black text-slate-500 uppercase tracking-wider text-center border-b border-slate-100">
                  Quotation Count
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userWiseData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-5 text-center font-bold text-slate-600">
                    {row.employeeName}
                  </td>

                  <td
                    className="p-5 text-center font-bold text-blue-600 cursor-pointer underline"
                    onClick={() => openModal(row, "customers")}
                  >
                    {row.customerCount}
                  </td>

                  <td
                    className="p-5 text-center font-bold text-blue-600 cursor-pointer underline"
                    onClick={() => goToQuotations(row)}
                  >
                    {row.quotationCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* --- CHARTS SECTION --- */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
        {/* BAR CHART */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <BarChart3 size={20} />
              </div>
              Purchase Record
            </h2>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-black uppercase text-slate-500 outline-none">
              <option>Last 4 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={salesData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip
                cursor={{ fill: "#F8FAFC" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  fontWeight: "bold",
                }}
              />

              {/* Only Purchase */}
              <Bar
                dataKey="purchase"
                fill="#9333EA"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <IndianRupee size={20} />
              </div>
              Cash Flow Trend
            </h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> In
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Out
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={dailyReport}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="in"
                stroke="#10B981"
                strokeWidth={4}
                dot={{ r: 6, fill: "#10B981", strokeWidth: 3, stroke: "#fff" }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="out"
                stroke="#EF4444"
                strokeWidth={4}
                dot={{ r: 6, fill: "#EF4444", strokeWidth: 3, stroke: "#fff" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* --- USER WISE ORDER TABLE --- */}
      </div>

      {/* --- MODAL OVERLAY --- */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black">
                {modalType === "customers"
                  ? "Customers Records of"
                  : "Quotations Records of"}{" "}
                {selectedEmployee.employeeName}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {modalType === "customers" && (
                <table className="w-full text-sm border">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEmployee.customers.map((c) => (
                      <tr key={c.id} className="border-t">
                        <td className="p-2">
                          {c.name} {c.lastName}
                        </td>
                        <td className="p-2">{c.phone}</td>
                        <td className="p-2">{c.email || "-"}</td>
                        <td className="p-2">{c.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {modalType === "quotations" && (
                <table className="w-full text-sm border">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2">Client</th>
                      <th className="p-2">Contact</th>
                      <th className="p-2">Total</th>
                      <th className="p-2">Paid</th>
                      <th className="p-2">Due</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEmployee.quotations.map((q) => (
                      <tr key={q.id} className="border-t">
                        <td className="p-2">{q.clientName}</td>
                        <td className="p-2">{q.contactNo}</td>
                        <td className="p-2">{q.grandTotal}</td>
                        <td className="p-2">{q.paidAmount}</td>
                        <td className="p-2">{q.dueAmount}</td>
                        <td className="p-2">{q.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[20px] shadow-2xl overflow-hidden border border-slate-100">
            {/* Header - Using your Logo/Sidebar Orange */}
            <div className="bg-[#ff7300] p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CreditCard className="text-white" size={24} />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Payment Requests
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* List Content */}
            <div className="max-h-[400px] overflow-y-auto bg-white">
              {requests.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-medium">
                  No pending requests found.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 hover:bg-slate-50 transition-colors"
                    >
                      {/* Meta Row: ID & Date */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black bg-slate-800 text-white px-2 py-0.5 rounded uppercase">
                          Quotation #{req.quotation_id}
                        </span>
                        <span className="text-xs text-slate-400 font-bold">
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Client & Amount */}
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-800 leading-none capitalize">
                            {req.client_name}
                          </h4>
                          <p className="text-xs text-[#ff7300] font-bold mt-1 uppercase tracking-wider">
                            {req.payment_type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900">
                            ₹{Number(req.amount).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Remark */}
                      {req.remark && (
                        <div className="mb-4 text-xs text-slate-500 italic bg-slate-100 p-3 rounded-lg border-l-4 border-slate-300">
                          "{req.remark}"
                        </div>
                      )}

                      {/* Buttons - Matching Sidebar Styles */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleStatusUpdate(req.id, "rejected")}
                          className="flex-1 py-2.5 rounded-xl border-2 border-slate-100 text-slate-400 font-bold text-sm hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req.id, "approved")}
                          className="flex-[2] py-2.5 rounded-xl bg-[#ff7300] text-white font-bold text-sm hover:bg-[#e66700] shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                        >
                          Approve Payment <Check size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
