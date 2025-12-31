import React, { useState, useEffect } from "react";
import { Calendar, User, Clock, Search, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function EmployeeAttendance() {
  const employees = [
    { id: 1, name: "Rahul Sharma", role: "Sales Executive" },
    { id: 2, name: "Pooja Patil", role: "Architect" },
    { id: 3, name: "Amit Desai", role: "Warehouse Mgr" },
  ];

  const attendanceData = {
    1: [
      { date: "2025-12-01", punchIn: "09:15 AM", punchOut: "06:20 PM" },
      { date: "2025-12-02", punchIn: "09:05 AM", punchOut: "06:10 PM" },
      { date: "2025-12-03", punchIn: "09:25 AM", punchOut: "06:00 PM" },
    ],
    2: [
      { date: "2025-12-01", punchIn: "09:10 AM", punchOut: "06:30 PM" },
      { date: "2025-12-02", punchIn: "09:20 AM", punchOut: "06:40 PM" },
    ],
    3: [],
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedEmployee, setSelectedEmployee] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const records = attendanceData[selectedEmployee] || [];
    const filtered = records.filter((r) => r.date.startsWith(selectedMonth));
    setFilteredRecords(filtered);
  }, [selectedEmployee, selectedMonth]);

  const calculateHours = (punchIn, punchOut) => {
    const start = new Date(`2025-01-01 ${punchIn}`);
    const end = new Date(`2025-01-01 ${punchOut}`);
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { text: `${hours}h ${mins}m`, decimal: hours + mins / 60 };
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
                  className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:ring-0 outline-none cursor-pointer"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(Number(e.target.value))}
                >
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
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Calendar size={24}/></div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Active</span>
             </div>
             <h3 className="text-slate-500 text-sm font-medium">Days Present</h3>
             <p className="text-3xl font-bold text-slate-900">{filteredRecords.length}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-600"><Clock size={24}/></div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Average</span>
             </div>
             <h3 className="text-slate-500 text-sm font-medium">Avg. Daily Hours</h3>
             <p className="text-3xl font-bold text-slate-900">
                {filteredRecords.length > 0 
                  ? (filteredRecords.reduce((acc, curr) => acc + calculateHours(curr.punchIn, curr.punchOut).decimal, 0) / filteredRecords.length).toFixed(1) 
                  : "0"}h
             </p>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 text-white">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/20 rounded-2xl"><User size={24}/></div>
             </div>
             <h3 className="text-indigo-100 text-sm font-medium">Employee Profile</h3>
             <p className="text-xl font-bold">{currentEmp?.name}</p>
             <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider">{currentEmp?.role}</p>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Punch In</th>
                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Punch Out</th>
                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-500">
                          <span className="text-[10px] font-bold uppercase">{new Date(r.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-sm font-bold leading-none">{new Date(r.date).getDate()}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{r.date}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <ArrowUpRight size={16} className="text-green-500" />
                        <span className="text-sm font-medium">{r.punchIn}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <ArrowDownRight size={16} className="text-rose-500" />
                        <span className="text-sm font-medium">{r.punchOut}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {calculateHours(r.punchIn, r.punchOut).text}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                        r.punchIn.includes("09:0") || r.punchIn.includes("08:") 
                        ? "bg-green-100 text-green-700" 
                        : "bg-amber-100 text-amber-700"
                      }`}>
                        {r.punchIn.includes("09:0") || r.punchIn.includes("08:") ? "On Time" : "Late"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Search size={40} className="text-slate-200" />
                       <p className="text-slate-400 font-medium">No records found for this period.</p>
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