import { UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { BASEURL } from "../Component/API/Url";

export default function EmployeeAttendanceCard() {
  const cardStyle =
    "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between";
  const selectStyle =
    "bg-gray-50 border border-gray-200 text-gray-700 text-[12px] rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-1.5 outline-none w-full";
  const iconBox = "p-2 bg-orange-50 rounded-lg text-orange-600";

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const [selectedEmp, setSelectedEmp] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  // 🔍 Fetch employees from API while typing
  useEffect(() => {
    const controller = new AbortController();

    const fetchEmployees = async () => {
      try {
        const res = await fetch(
          `${BASEURL}/api/employees/list?page=1&limit=20&search=${search}`,
          { signal: controller.signal },
        );
        const data = await res.json();

        if (data.success) {
          // API returns "employees"
          setFiltered(data.employees || []);
        }
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      }
    };

    const t = setTimeout(fetchEmployees, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [search]);

  // 📊 Fetch attendance summary
  //   useEffect(() => {
  //     if (!selectedEmp || !fromDate || !toDate) return;

  //     const fetchAttendance = async () => {
  //       const res = await fetch(
  //         `${BASEURL}/api/dashboard/records?employeeId=${selectedEmp}&from=${fromDate}&to=${toDate}`,
  //       );
  //       const data = await res.json();

  //       if (data.success) {
  //         setPresent(data.present || 0);
  //         setAbsent(data.absent || 0);
  //       }
  //     };

  //     fetchAttendance();
  //   }, [selectedEmp, fromDate, toDate]);

  const downloadExcel = async () => {
    if (!selectedEmp || !fromDate || !toDate) {
      alert("Please select employee and date range");
      return;
    }

    const url = `${BASEURL}/api/dashboard/records?employeeId=${selectedEmp}&from=${fromDate}&to=${toDate}`;

    const res = await fetch(url);
    const blob = await res.blob();

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = `attendance_${selectedEmp}_${fromDate}_to_${toDate}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={cardStyle}>
      <div className="flex items-center gap-3 mb-4">
        <div className={iconBox}>
          <UserCheck size={20} />
        </div>
        <h3 className="font-bold text-slate-700">Employee Attendance</h3>
      </div>

      <div className="mb-3 space-y-2">
        {/* Search */}
        <input
          type="text"
          placeholder="Type employee name..."
          className={selectStyle}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Dropdown */}
        <select
          className="w-full p-1.5 bg-slate-800 text-white rounded-lg text-xs outline-none"
          value={selectedEmp}
          onChange={(e) => setSelectedEmp(e.target.value)}
        >
          <option value="">Select Employee</option>
          {filtered.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        {/* Date range */}
        <div className="flex gap-2">
          <input
            type="date"
            className={selectStyle}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className={selectStyle}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          onClick={downloadExcel}
          className="w-full mt-2 bg-orange-600 text-white text-xs py-2 rounded-lg hover:bg-orange-700 transition"
        >
          Download Excel
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-green-50 p-2 rounded-lg text-green-700 font-bold text-sm">
          Present: {present}
        </div>
        <div className="bg-red-50 p-2 rounded-lg text-red-700 font-bold text-sm">
          Absent: {absent}
        </div>
      </div>
    </div>
  );
}
