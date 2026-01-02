import React, { useEffect, useState } from "react";
import { getEmployeeRolesAPI, getEmployeesAPI, saveEmployeeRolesAPI } from "../Component/API/employeeApi";
import {
  ShieldCheck, User, Save, Lock, Layout, Users, LayoutDashboard,
  UserPlus,
  ClipboardCheck,
  Layers,
  BadgeCheck,
  Package,
  DraftingCompass,
  FileText,
  Truck,
} from "lucide-react";

export default function EmployeeRole() {
  const [employeeData, setEmployeeData] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(false);

  // Grouped pages for better organization
  const sections = [
    {
      title: "Customer Management",
      icon: <Users className="w-4 h-4" />,
      items: ["View", "Add", "Edit"],
    },
    {
      title: "Employee Registration",
      icon: <UserPlus className="w-4 h-4" />,
      items: ["View", "Add", "Edit", "Delete"],
    },
    {
      title: "Quality Management",
      icon: <BadgeCheck className="w-4 h-4" />,
      items: ["View", "Add", "Edit", "Delete"],
    },
    {
      title: "Category Management",
      icon: <Layers className="w-4 h-4" />,
      items: ["View", "Add", "Edit", "Delete"],
    },
    {
      title: "Brand Management",
      icon: <LayoutDashboard className="w-4 h-4" />,
      items: ["View", "Add", "Edit", "Delete"],
    },
    {
      title: "Product Registration",
      icon: <Package className="w-4 h-4" />,
      items: ["View", "Add", "Edit", "Delete"],
    },
    {
      title: "Architect Registration",
      icon: <DraftingCompass className="w-4 h-4" />,
      items: ["View", "Add", "Edit", "Delete", "Commission"],
    },
    {
      title: "Inventory Management",
      icon: <ClipboardCheck className="w-4 h-4" />,
      items: ["View", "Add", "Edit", "Delete"],
    },
    {
      title: "Quotation Management",
      icon: <FileText className="w-4 h-4" />,
      items: ["View", "Add", "Edit", "Delete", "Pay", "DC", "Payment Requests"],
    },
    {
      title: "Delivery Challans",
      icon: <Truck className="w-4 h-4" />,
      items: ["Update Timeline", "Delete", "Print DC", "Return DC"],
    },
  ];


  const allPages = sections.flatMap((section) =>
    section.items.map((item) => `${section.title}_${item}`)
  );


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
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="text-indigo-600 w-8 h-8" />
              Role Permissions
            </h1>
            <p className="text-slate-500 mt-1">
              Define which parts of the system employees can access.
            </p>
          </div>

          <button
            onClick={handleSaveRoles}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-slate-400"
          >
            {loading ? (
              <span className="animate-spin mr-1">●</span>
            ) : (
              <Save size={18} />
            )}
            {loading ? "Saving Changes..." : "Save All Permissions"}
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[1400px] border-separate border-spacing-0">
              <thead className="sticky top-0 z-50">
                {/* SECTION HEADERS */}
                <tr className="bg-slate-900 text-white">
                  <th
                    rowSpan={2}
                    className="sticky left-0 z-60 w-64 bg-slate-900 text-sm font-bold text-gray-100
                       border-b border-r border-slate-700 px-4 py-3 text-left"
                  >
                    Employee Name
                  </th>

                  {sections.map((section) => (
                    <th
                      key={section.title}
                      colSpan={section.items.length}
                      className="border-b border-l border-slate-700 px-3 py-3
                         text-xs uppercase tracking-wider font-bold text-center"
                    >
                      <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                        {section.icon}
                        {section.title}
                      </div>
                    </th>
                  ))}
                </tr>

                {/* PAGE HEADERS */}
                <tr className="bg-slate-800 text-white">
                  {allPages.map((page) => (
                    <th
                      key={page}
                      className="w-[110px] min-w-[110px] max-w-[110px]
                         border-b border-l border-slate-700 px-3 py-2
                         text-[11px] font-semibold text-center whitespace-nowrap"
                    >
                      {page.split("_")[1]}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {employeeData.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* EMPLOYEE COLUMN */}
                    <td
                      className="sticky left-0 z-40 w-64 bg-white hover:bg-slate-50
                         border-r border-slate-200 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700
                                flex items-center justify-center font-bold text-xs">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">
                            {emp.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* PERMISSIONS */}
                    {allPages.map((page) => (
                      <td
                        key={page}
                        className="w-[110px] min-w-[110px] max-w-[110px]
                           border-l border-slate-100 px-3 py-3 text-center"
                      >
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={roles?.[emp.id]?.[page] || false}
                            onChange={() => handleCheckboxChange(emp.id, page)}
                          />
                          <div className="w-10 h-5 bg-slate-200 rounded-full
                                  peer-checked:bg-indigo-600 transition-colors
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                  after:h-4 after:w-4 after:bg-white after:rounded-full
                                  after:transition-transform peer-checked:after:translate-x-5" />
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* Mobile Hint */}
        <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs md:hidden">
          <User size={14} />
          Swipe horizontally to see all permissions
        </div>
      </div>
    </div>
  );
}