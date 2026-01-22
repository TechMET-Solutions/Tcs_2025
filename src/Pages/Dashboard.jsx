import {
  ArrowRight,
  ArrowUpCircle,
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
import {
  getPendingRequests,
  updateRequestStatus,
} from "../Component/API/paymentApi";
import { useAuth } from "../utils/AuthContext";
import TodoComponent from "./TodoComponent";
import { getDashboardStats } from "../Component/API/dashboardApi";

export default function Dashboard() {
  const { permissions, user, loading, role } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const salesData = [
    { month: "Jan", sales: 52000, purchase: 31000 },
    { month: "Feb", sales: 68000, purchase: 42000 },
    { month: "Mar", sales: 74000, purchase: 39000 },
    { month: "Apr", sales: 81000, purchase: 52000 },
  ];

  const dailyReport = [
    { day: "Mon", in: 5000, out: 3000 },
    { day: "Tue", in: 6000, out: 2000 },
    { day: "Wed", in: 4500, out: 2500 },
    { day: "Thu", in: 7000, out: 4000 },
    { day: "Fri", in: 8000, out: 3000 },
  ];

    const [stats, setStats] = useState({
    customerCurrentMonthCount: 0,
    monthlyPurchasesTotal: 0,
    monthlyQuestionCount: 0,
    deliveryChallanCount: 0
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

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, []);

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
    fetchRequests();
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
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-600"></span>
                  </span>
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

      {/* --- CHARTS SECTION --- */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
        {/* BAR CHART */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <BarChart3 size={20} />
              </div>
              Sales vs Purchase
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
              <Bar
                dataKey="sales"
                fill="#2563EB"
                radius={[6, 6, 0, 0]}
                barSize={35}
              />
              <Bar
                dataKey="purchase"
                fill="#9333EA"
                radius={[6, 6, 0, 0]}
                barSize={35}
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
      </div>

      {/* --- BOTTOM SUMMARY SECTION --- */}
      <div className="max-w-[1600px] mx-auto bg-slate-900 rounded-[40px] p-10 relative overflow-hidden shadow-2xl shadow-slate-400">
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Performance Update
            </span>
            <h2 className="text-4xl font-black text-white mt-4 tracking-tight">
              Your business is up by 12%
            </h2>
            <p className="text-slate-400 font-medium mt-1 text-lg">
              You have earned{" "}
              <span className="text-emerald-400 font-black">₹68,000</span> more
              than last month.
            </p>
          </div>
          <button className="flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all shadow-xl group">
            View Full Summary{" "}
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
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
