import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  User, FileText, Clock, PhoneCall, LogOut, 
  CheckCircle, AlertCircle, Calendar, Briefcase, Mail 
} from "lucide-react";
import { BASEURL } from "../Component/API/Url";

const EmpDashboard = ({ user }) => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentStatus, setCurrentStatus] = useState(""); // READY, IN, or COMPLETED
  const [stats, setStats] = useState({ quotationCount: 0, followUpCount: 0 });
  const [followUps, setFollowUps] = useState([]);

  // Static ID as per your requirement
  const STATIC_USER_ID = 1;

  // 1. Fetch all dashboard data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch Status, Stats, and Followups in parallel for better performance
      const [statusRes, dataRes] = await Promise.all([
        axios.get(`${BASEURL}/api/employees/status/${STATIC_USER_ID}`),
        axios.get(`${BASEURL}/api/employees/dashboard-summary/${STATIC_USER_ID}`)
      ]);

      if (statusRes.data.success) {
        setCurrentStatus(statusRes.data.status);
      }

      if (dataRes.data.success) {
        setStats(dataRes.data.stats);
        setFollowUps(dataRes.data.followUps);
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Punch In/Out Logic
  // const handlePunch = async (type) => {
  //   setLoading(true);
  //   setMessage("");
  //   try {
  //     const response = await axios.post(`${BASEURL}/api/employees/punch`, {
  //       employeeId: STATIC_USER_ID,
  //       status: type
  //     });

  //     if (response.data.success) {
  //       setMessage(`Success: ${type} Recorded!`);
  //       // If they just punched out, lock the dashboard for today
  //       if (type === "OUT") {
  //         setCurrentStatus("COMPLETED");
  //       } else {
  //         setCurrentStatus("IN");
  //       }
  //     }
  //   } catch (err) {
  //     setMessage(err.response?.data?.message || "Punch failed. Try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePunch = async (type) => {
    setLoading(true);
    setMessage("");

    try {
      const url =
        type === "IN"
          ? `${BASEURL}/api/employees/punch-in`
          : `${BASEURL}/api/employees/punch-out`;

      const res = await axios.post(url, {
        employeeId: STATIC_USER_ID,
        image: null // later you can send base64 / selfie
      });

      setMessage(res.data.message);

      if (type === "IN") {
        setCurrentStatus("IN");
      } else {
        setCurrentStatus("COMPLETED");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Punch failed");
    } finally {
      setLoading(false);
    }
  };


  // 3. Helper Component for Punch Section
  const PunchControl = () => {
    if (currentStatus === "COMPLETED") {
      return (
        <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-2xl flex items-center gap-3 text-green-700 font-bold shadow-sm">
          <CheckCircle size={20} />
          <span>Work Finished for Today</span>
        </div>
      );
    }

    return (
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 gap-2">
        <button
          disabled={loading || currentStatus === "IN"}
          onClick={() => handlePunch("IN")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
            currentStatus === "IN" 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-100"
          }`}
        >
          {currentStatus === "IN" ? <CheckCircle size={16} /> : null}
          {currentStatus === "IN" ? "Already In" : "Punch In"}
        </button>

        <button
          disabled={loading || currentStatus !== "IN"}
          onClick={() => handlePunch("OUT")}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            currentStatus !== "IN"
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-100"
          }`}
        >
          Punch Out
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans">
      
      {/* --- SIDEBAR: PERSONAL INFO --- */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 p-8 flex flex-col">
        <div className="flex flex-col items-center text-center pb-8 border-b border-slate-100">
          <div className="relative">
            <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-3xl flex items-center justify-center mb-4 rotate-3 shadow-xl">
              <User size={48} className="text-white -rotate-3" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{user?.name || "Member Name"}</h3>
          <p className="text-sm font-medium text-slate-400 flex items-center gap-1 mt-1">
            <Briefcase size={14} /> Employee ID: {STATIC_USER_ID}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Detail</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg"><Mail size={16} /></div>
                <span className="text-sm truncate">{user?.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg"><PhoneCall size={16} /></div>
                <span className="text-sm">{user?.phone || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-lg">
            <p className="text-xs text-slate-400 font-medium">Monthly Salary</p>
            <p className="text-2xl font-black mt-1">₹{user?.salary || "0.00"}</p>
            <div className="mt-4 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-2/3"></div>
            </div>
          </div>
        </div>

        <button className="mt-auto flex items-center justify-center gap-2 text-rose-500 font-bold py-4 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100">
          <LogOut size={18} /> Logout Session
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-6 md:p-10">
        
        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daily Workspace</h1>
            <p className="text-slate-500 font-medium mt-1">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <PunchControl />
        </header>

        {/* MESSAGES */}
        {message && (
          <div className="mb-8 p-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-indigo-100 animate-bounce">
            <AlertCircle size={20} /> {message}
          </div>
        )}

        {/* KPI DASHBOARD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><FileText size={24} /></div>
              <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-lg">+12%</span>
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Quotations</p>
            <h3 className="text-4xl font-black text-slate-800 mt-2">{stats.quotationCount}</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><Clock size={24} /></div>
              <span className="text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg">Action Required</span>
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Today's Follow-ups</p>
            <h3 className="text-4xl font-black text-slate-800 mt-2">{stats.followUpCount}</h3>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><Calendar size={24} /></div>
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Attendance Status</p>
            <h3 className={`text-2xl font-black mt-2 ${currentStatus === "IN" ? "text-green-600" : currentStatus === "COMPLETED" ? "text-slate-400" : "text-blue-600"}`}>
              {currentStatus === "IN" ? "ON DUTY" : currentStatus === "COMPLETED" ? "SHIFT ENDED" : "AWAITING IN"}
            </h3>
          </div>
        </div>

        {/* FOLLOW UPS DATA TABLE */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="text-xl font-black text-slate-800">Priority Follow-ups</h3>
            <div className="flex gap-2">
               <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><AlertCircle size={20} className="text-slate-400" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Requirement</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {followUps.length > 0 ? followUps.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{item.customer_name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Corporate Client</div>
                    </td>
                    <td className="px-8 py-5 text-slate-600 font-medium">{item.phone}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg truncate block max-w-[200px]">
                        {item.requirement || "General Inquiry"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2 rounded-xl text-xs font-extrabold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <CheckCircle size={48} className="text-slate-100 mb-4" />
                        <p className="text-slate-400 font-bold">Great job! No pending follow-ups for today.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
};

export default EmpDashboard;