import React, { useState, useEffect } from "react";

export default function EmployeeAttendance() {
  const employees = [
    { id: 1, name: "Rahul Sharma" },
    { id: 2, name: "Pooja Patil" },
    { id: 3, name: "Amit Desai" },
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

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const [selectedEmployee, setSelectedEmployee] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    filterByMonth();
  }, [selectedEmployee, selectedMonth]);

  const filterByMonth = () => {
    const records = attendanceData[selectedEmployee] || [];
    const filtered = records.filter((r) => r.date.startsWith(selectedMonth));
    setFilteredRecords(filtered);
  };

  const calculateHours = (punchIn, punchOut) => {
    try {
      const start = new Date(`2025-01-01 ${punchIn}`);
      const end = new Date(`2025-01-01 ${punchOut}`);
      const diffMs = end - start;

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${mins}m`;
    } catch {
      return "-";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Employee Attendance</h1>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">

        {/* Employee Dropdown */}
        <select
          className="border p-2 rounded-lg"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(Number(e.target.value))}
        >
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>

        {/* Month Selector */}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded-lg"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white p-4 rounded-xl shadow border">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-sm">Date</th>
              <th className="p-2 border text-sm">Punch In</th>
              <th className="p-2 border text-sm">Punch Out</th>
              <th className="p-2 border text-sm">Total Hours</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((r, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border text-sm">{r.date}</td>
                  <td className="p-2 border text-sm">{r.punchIn}</td>
                  <td className="p-2 border text-sm">{r.punchOut}</td>
                  <td className="p-2 border font-medium text-sm">
                    {calculateHours(r.punchIn, r.punchOut)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-4 text-gray-500 font-medium"
                >
                  No attendance records for this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
