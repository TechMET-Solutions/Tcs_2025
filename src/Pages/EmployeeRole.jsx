import React, { useEffect, useState } from "react";
import { getEmployeeRolesAPI, getEmployeesAPI, saveEmployeeRolesAPI } from "../Component/API/employeeApi";
import { ShieldCheck, User, Save, Lock, Layout, Package, Users } from "lucide-react";

export default function EmployeeRole() {
  const [employeeData, setEmployeeData] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(false);

  // Grouped pages for better organization
  const sections = [
    {
      title: "Core Services",
      icon: <Layout className="w-4 h-4" />,
      items: ["Dashboard", "Delivery Challan", "Add Inventory", "Manage Inventory"],
    },
    {
      title: "Sales & Quotes",
      icon: <Package className="w-4 h-4" />,
      items: ["Generate Quote", "Add Quotation", "Manage Quotation"],
    },
    {
      title: "Registrations",
      icon: <Users className="w-4 h-4" />,
      items: ["Product Registration", "Architect Registration", "Employee Registration", "Customer Management"],
    },
    {
      title: "Configuration",
      icon: <Lock className="w-4 h-4" />,
      items: ["Category Management", "Quality Management", "Brand Management"],
    },
  ];

  const allPages = sections.flatMap((s) => s.items);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployeesAPI();
      if (res.data.success) {
        setEmployeeData(res.data.employees);
      }
    } catch (err) {
      console.error("Employee fetch failed", err);
    }
  };

  const fetchEmployeeRoles = async (employeeId) => {
    try {
      const res = await getEmployeeRolesAPI(employeeId);
      if (res.data.success) {
        setRoles((prev) => ({
          ...prev,
          [employeeId]: res.data.permissions || {},
        }));
      }
    } catch (err) {
      console.error("Role fetch failed", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    employeeData.forEach((emp) => fetchEmployeeRoles(emp.id));
  }, [employeeData]);

  const handleCheckboxChange = (empId, page) => {
    setRoles((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [page]: !prev?.[empId]?.[page],
      },
    }));
  };

  const handleSaveRoles = async () => {
    setLoading(true);
    try {
      for (const empId in roles) {
        await saveEmployeeRolesAPI({
          employeeId: empId,
          permissions: roles[empId],
        });
      }
      alert("Permissions updated successfully!");
    } catch (err) {
      alert("Failed to update roles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="text-indigo-600 w-8 h-8" />
              Role Permissions
            </h1>
            <p className="text-slate-500 mt-1">Define which parts of the system employees can access.</p>
          </div>
          <button
            onClick={handleSaveRoles}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-slate-400"
          >
            {loading ? <span className="animate-spin mr-2">●</span> : <Save size={18} />}
            {loading ? "Saving Changes..." : "Save All Permissions"}
          </button>
        </div>

        {/* Matrix Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {/* Section Headers */}
                <tr className="bg-slate-50">
                  <th className="p-4 border-b sticky left-0 bg-slate-50 z-20 w-64"></th>
                  {sections.map((section) => (
                    <th
                      key={section.title}
                      colSpan={section.items.length}
                      className="p-3 border-b border-l border-slate-200 text-xs uppercase tracking-wider font-bold text-slate-500"
                    >
                      <div className="flex items-center justify-center gap-2">
                        {section.icon} {section.title}
                      </div>
                    </th>
                  ))}
                </tr>
                {/* Page Headers */}
                <tr className="bg-white">
                  <th className="p-4 border-b sticky left-0 bg-white z-20 text-left text-sm font-bold text-slate-700 w-64">
                    Employee Name
                  </th>
                  {allPages.map((page) => (
                    <th
                      key={page}
                      className="p-3 border-b border-l border-slate-100 text-[11px] font-semibold text-slate-600 whitespace-nowrap min-w-[100px]"
                    >
                      <span className="inline-block hover:text-indigo-600 cursor-default transition-colors">
                        {page}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {employeeData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Employee Name Column (Sticky) */}
                    <td className="p-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{emp.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Checkboxes */}
                    {allPages.map((page) => (
                      <td
                        key={page}
                        className="p-3 text-center border-l border-slate-50 group-hover:bg-indigo-50/20 transition-all"
                      >
                        <label className="relative inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={roles?.[emp.id]?.[page] || false}
                            onChange={() => handleCheckboxChange(emp.id, page)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Info */}
        <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs">
          <User size={14} />
          <span>Horizontal scroll to see all permissions</span>
        </div>
      </div>
    </div>
  );
}