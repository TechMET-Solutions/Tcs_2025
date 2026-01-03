import { BadgeCheck, ClipboardCheck, DraftingCompass, FileText, Layers, LayoutDashboard, Package, Save, ShieldCheck, Truck, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getEmployeeRolesAPI, getEmployeesAPI, saveEmployeeRolesAPI } from "../Component/API/employeeApi";

export default function EmployeeRole() {
  const [employeeData, setEmployeeData] = useState([]);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(false);

  const sections = [
    { title: "Customer Management", icon: <Users className="w-4 h-4" />, items: ["View", "Add", "Edit"] },
    { title: "Employee Registration", icon: <UserPlus className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
    { title: "Quality Management", icon: <BadgeCheck className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
    { title: "Category Management", icon: <Layers className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
    { title: "Brand Management", icon: <LayoutDashboard className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
    { title: "Product Registration", icon: <Package className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
    { title: "Architect Registration", icon: <DraftingCompass className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete", "Commission"] },
    { title: "Inventory Management", icon: <ClipboardCheck className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
    { title: "Quotation Management", icon: <FileText className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete", "Pay", "DC", "Payment Requests"] },
    { title: "Delivery Challans", icon: <Truck className="w-4 h-4" />, items: ["Update Timeline", "Delete", "Print DC", "Return DC"] },
  ];

  const allPages = sections.flatMap((s) => s.items.map((item) => `${s.title}_${item}`));

  // 1. Fetch Employees
  useEffect(() => {
    const init = async () => {
      try {
        const res = await getEmployeesAPI();
        if (res.data.success) {
          const emps = res.data.employees;
          setEmployeeData(emps);
          // 2. Fetch Roles for each employee after getting employee list
          emps.forEach(emp => fetchRoles(emp.id));
        }
      } catch (err) { console.error("Init fail", err); }
    };
    init();
  }, []);

  const fetchRoles = async (id) => {
    try {
      const res = await getEmployeeRolesAPI(id);
      if (res.data.success) {
        setRoles(prev => ({ ...prev, [id]: res.data.permissions || {} }));
      }
    } catch (err) { console.error("Role fetch fail", id, err); }
  };

  const handleCheckboxChange = (empId, page) => {
    setRoles((prev) => ({
      ...prev,
      [empId]: { ...prev[empId], [page]: !prev?.[empId]?.[page] },
    }));
  };

  const handleSaveRoles = async () => {
    setLoading(true);
    try {
      // Logic: Save modified roles to database
      const savePromises = Object.keys(roles).map(empId => 
        saveEmployeeRolesAPI({ employeeId: empId, permissions: roles[empId] })
      );
      await Promise.all(savePromises);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="text-indigo-600 w-8 h-8" /> Role Permissions
            </h1>
          </div>
          <button 
            onClick={handleSaveRoles} 
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg disabled:bg-slate-400"
          >
            {loading ? "Saving..." : <><Save size={18} /> Save All</>}
          </button>
        </div>

        {/* Permissions Table */}
        <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th rowSpan={2} className="sticky left-0 z-20 bg-slate-900 p-4 text-left border-r border-slate-700">Employee Name</th>
                  {sections.map(s => (
                    <th key={s.title} colSpan={s.items.length} className="p-3 text-xs uppercase border-l border-slate-700 text-center">
                      <div className="flex justify-center items-center gap-2">{s.icon} {s.title}</div>
                    </th>
                  ))}
                </tr>
                <tr className="bg-slate-800 text-white">
                  {allPages.map(page => (
                    <th key={page} className="p-2 text-[10px] border-l border-slate-700 text-center">{page.split("_")[1]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employeeData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="sticky left-0 bg-white p-4 border-r border-slate-200 font-bold text-sm">
                      {emp.name}
                    </td>
                    {allPages.map((page) => (
                      <td key={page} className="p-3 text-center border-l border-slate-100">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-indigo-600 cursor-pointer"
                          checked={!!roles[emp.id]?.[page]}
                          onChange={() => handleCheckboxChange(emp.id, page)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}