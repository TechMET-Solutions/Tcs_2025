import { ArrowDownRight, ArrowUpRight, Calendar, Clock, Filter, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getEmployeesAPI } from "../Component/API/employeeApi";
import { getAttendanceAPI, getAttendanceSummaryAPI } from "../Component/API/attendanceApi";
import { formatIndianDate } from "../utils/formatIndianDate";


export default function EmployeeAttendance() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [summary, setSummary] = useState({
    daysPresent: 0,
    avgHours: 0,
  });

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    debugger
    if (!selectedEmployee || !selectedMonth) return;

    (async () => {
      try {
        const res = await getAttendanceSummaryAPI(selectedEmployee, selectedMonth);
        setSummary({
          daysPresent: res?.data?.daysPresent ?? 0,
          avgHours: res?.data?.avgHours ?? 0,
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [selectedEmployee, selectedMonth]);






  // Fetch employee list on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployeesAPI();
      if (response.data && response.data.employees) {
        // Filter out employees with "block" status
        const activeEmployees = response.data.employees.filter(emp => emp.status !== "blocked");
        setEmployees(activeEmployees);
        if (activeEmployees.length > 0) {
          setSelectedEmployee(activeEmployees[0].id);
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to fetch employee list");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!selectedEmployee || !selectedMonth) return;

    const fetchAttendance = async () => {
      try {
        const res = await getAttendanceAPI(selectedEmployee, selectedMonth);
        setFilteredRecords(res.data.records || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAttendance();
  }, [selectedEmployee, selectedMonth]);

  // // useEffect(() => {
  // //   const records = attendanceData[selectedEmployee] || [];
  // //   const filtered = records.filter((r) => r.date.startsWith(selectedMonth));
  // //   setFilteredRecords(filtered);
  // // }, [selectedEmployee, selectedMonth]);

  const calculateHours = (punchIn, punchOut) => {
    if (!punchIn || !punchOut) {
      return { text: "0h 0m", decimal: 0 };
    }

    const [inH, inM] = punchIn.split(":").map(Number);
    const [outH, outM] = punchOut.split(":").map(Number);

    let start = inH * 60 + inM;
    let end = outH * 60 + outM;

    // Handle overnight shift
    if (end < start) end += 24 * 60;

    const diff = end - start;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    return {
      text: `${hours}h ${mins}m`,
      decimal: +(hours + mins / 60).toFixed(2),
    };
  };

  const isOnTime = (punchIn) => {
    if (!punchIn) return false;
    const [h, m] = punchIn.split(":").map(Number);
    return h < 9 || (h === 9 && m <= 0);
  };


  const currentEmp = employees.find(e => e.id === selectedEmployee);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className=" mx-auto">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Calendar className="text-indigo-600 w-8 h-8" />
              Attendance Tracker
            </h1>
            <p className="text-slate-500 mt-1">Monitor daily punch-in and work durations.</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 px-3">
              <User size={18} className="text-slate-400" />
              <select
                className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer disabled:opacity-50"
                value={selectedEmployee || ""}
                onChange={(e) => setSelectedEmployee(Number(e.target.value))}
                disabled={loading || employees.length === 0}
              >
                <option value="">
                  {loading ? "Loading employees..." : "Select Employee"}
                </option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            <div className="w-[1px] h-6 bg-slate-200"></div>
            <div className="flex items-center gap-2 px-3">
              <Filter size={18} className="text-slate-400" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Calendar size={24} /></div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Active</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Days Present</h3>
            <p className="text-3xl font-bold text-slate-900">{summary.daysPresent}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600"><Clock size={24} /></div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Average</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Avg. Daily Hours</h3>
            <p className="text-3xl font-bold text-slate-900">
              {Number(summary.avgHours || 0).toFixed(1)}h
            </p>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-2xl"><User size={24} /></div>
            </div>
            <h3 className="text-indigo-100 text-sm font-medium">Employee Profile</h3>
            <p className="text-xl font-bold">{currentEmp?.name}</p>
            <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider">{currentEmp?.role}</p>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full border-collapse overflow-hidden rounded-xl shadow-sm bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
                {["Date", "Punch In", "Punch Out", "Duration", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-center text-[11px] font-semibold text-slate-200 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r, index) => (
                  <tr
                    key={index}
                    className="group transition-all hover:bg-indigo-50/40"
                  >
                    {/* Date */}
                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-semibold text-slate-700">
                        {formatIndianDate(r.date)}
                      </span>
                    </td>

                    {/* Punch In */}
                    <td className="px-5 py-4">
                      <div className="flex justify-center items-center gap-2 text-slate-600">
                        <ArrowUpRight size={16} className="text-emerald-500" />
                        <span className="text-sm font-medium">{r.punchIn}</span>
                      </div>
                    </td>

                    {/* Punch Out */}
                    <td className="px-5 py-4">
                      <div className="flex justify-center items-center gap-2 text-slate-600">
                        <ArrowDownRight size={16} className="text-rose-500" />
                        <span className="text-sm font-medium">{r.punchOut}</span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {calculateHours(r.punchIn, r.punchOut).text}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide
                ${isOnTime(r.punchIn)
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                          }
              `}
                      >
                        {isOnTime(r.punchIn) ? "On Time" : "Late"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search size={42} className="text-slate-300" />
                      <p className="text-sm font-medium text-slate-400">
                        No records found for this period
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}