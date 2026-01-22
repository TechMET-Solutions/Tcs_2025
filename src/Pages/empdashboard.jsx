import axios from "axios";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  PhoneCall,
  Send,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";
import TodoComponent from "./TodoComponent";

const EmpDashboard = () => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentStatus, setCurrentStatus] = useState(""); // READY, IN, or COMPLETED
  console.log(currentStatus, "currentStatus")
  const [stats, setStats] = useState({ quotationCount: 0, followUpCount: 0 });
  const [followUps, setFollowUps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState("pending");


  const [selectedTask, setSelectedTask] = useState(null);
  const [remark, setRemark] = useState("");
  const { user } = useAuth();
  console.log(user, "user")
  // 1. Fetch all dashboard data on component mount
  useEffect(() => {
    if (user?.id) {
      fetchInitialData();
    }
  }, [user]);

  const fetchMyTasks = async () => {
    try {
      const res = await axios.get(`${BASEURL}/api/tasks/employee/${user?.id}`);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMyTasks();
  }, [user?.id]);
  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [statusRes, dataRes] = await Promise.all([
        axios.get(`${BASEURL}/api/employees/status/${user.id}`),
        axios.get(`${BASEURL}/api/employees/attendance-summary/${user.id}`)
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

  const handleUpdateStatus = async (taskId) => {
    if (!remark.trim()) {
      alert("Please provide a remark before completing the task.");
      return;
    }

    try {
      const res = await axios.put(`${BASEURL}/api/tasks/update/${taskId}`, {
        status: taskStatus,
        remark: remark
      });

      if (res.data.success) {
        setRemark("");
        setTaskStatus("done");
        setSelectedTask(null);
        fetchMyTasks();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };


  const handlePunch = async (type) => {
    setLoading(true);
    setMessage("");

    try {
      const url =
        type === "IN"
          ? `${BASEURL}/api/employees/punch-in`
          : `${BASEURL}/api/employees/punch-out`;

      const res = await axios.post(url, {
        employeeId: user.id,
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
      <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 gap-3">
        {/* PUNCH IN BUTTON */}
        <button
          disabled={loading || currentStatus !== "READY"}
          onClick={() => handlePunch("IN")}
          className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${currentStatus !== "READY"
            ? "bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100"
            : "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-100"
            }`}
        >
          {currentStatus !== "READY" && <CheckCircle size={18} />}
          {currentStatus === "READY" ? "Punch In" : "Already Punched In"}
        </button>

        <button

          disabled={loading || currentStatus !== "IN"}
          onClick={() => handlePunch("OUT")}
          className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${currentStatus !== "IN"
            ? "bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-100"
            : "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-100"
            }`}
        >
          {currentStatus === "COMPLETED" && <CheckCircle size={18} />}
          {currentStatus === "COMPLETED" ? "Shift Completed" : "Punch Out"}
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
            {user?.profile_photo ? (
              <img
                src={`${BASEURL}/uploads/employees/${user.profile_photo}`}
                alt={user.name}
                className="w-28 h-28 rounded-3xl object-cover shadow-xl"
              />
            ) : (
              <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-3xl flex items-center justify-center shadow-xl">
                <User size={48} className="text-white" />
              </div>
            )}

            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
          </div>


          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{user?.name || "Member Name"}</h3>
          <p className="text-sm font-medium text-slate-400 flex items-center gap-1 mt-1">
            <Briefcase size={14} /> Employee ID: {user?.id || "—"}
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

          {/* <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-lg">
            <p className="text-xs text-slate-400 font-medium">Monthly Salary</p>
            <p className="text-2xl font-black mt-1">
              ₹{Number(user?.salary || 0).toFixed(2)}
            </p>

            <div className="mt-4 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-2/3"></div>
            </div>
          </div> */}
        </div>

        {/* <button className="mt-auto flex items-center justify-center gap-2 text-rose-500 font-bold py-4 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100">
          <LogOut size={18} /> Logout Session
        </button> */}
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-6 md:p-10">

        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daily Workspace</h1>
            <p className="text-slate-500 font-medium mt-1">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <TodoComponent />
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
        <div className="space-y-6">
          <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-black text-slate-800">My Assigned Tasks</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Status:</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black rounded-full uppercase">Pending</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Task Details</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date Assigned</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.length > 0 ? tasks.map((task) => (
                    <tr key={task.id} className="group hover:bg-slate-50/80 transition-all">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{task.title}</div>
                        <div className="text-xs text-slate-400 mt-1 max-w-md italic">"{task.description}"</div>
                        {task.remark && (() => {
                          let arr = [];
                          try {
                            arr = JSON.parse(task.remark);
                          } catch { }

                          return arr.length ? (
                            <div className="mt-2 space-y-1">
                              {arr.map((r, i) => (
                                <div key={i} className="text-[10px] bg-indigo-50 text-indigo-500 p-2 rounded-lg font-medium">
                                  <strong>{r.status}:</strong> {r.text}
                                </div>
                              ))}
                            </div>
                          ) : null;
                        })()}


                      </td>
                      <td className="px-8 py-5 text-slate-500 font-medium text-sm">
                        {new Date(task.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                        {task.status === 'pending' ? (
                          <button
                            onClick={() => setSelectedTask(task.id)}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-extrabold hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2 ml-auto"
                          >
                            <Clock size={14} /> Mark as Done
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-green-500 font-black text-[10px] uppercase">
                            <CheckCircle size={14} /> Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="px-8 py-20 text-center text-slate-400 font-bold">
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* MODAL / OVERLAY FOR REMARK */}
          {selectedTask && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
                <h4 className="text-xl font-black text-slate-800 mb-2">Complete Task</h4>
                <p className="text-sm text-slate-500 mb-6">Please provide a brief remark on what was done.</p>



                <textarea
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all"
                  placeholder="Type your remark here..."
                  rows="4"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />

                <select
                  className={`w-full border-2 rounded-2xl p-3 text-sm outline-none transition-all mb-4
                     ${taskStatus === "done"
                      ? " bg-emerald-50 text-emerald-700"
                      : " bg-amber-50 text-amber-700"}
                     `}
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="done">Done</option>
                </select>


                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedTask)}
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default EmpDashboard;