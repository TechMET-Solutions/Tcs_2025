// import { BadgeCheck, ClipboardCheck, DraftingCompass, FileText, Layers, LayoutDashboard, Package, Save, ShieldCheck, Truck, UserPlus, Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import { getEmployeeRolesAPI, getEmployeesAPI, saveEmployeeRolesAPI } from "../Component/API/employeeApi";

// export default function EmployeeRole() {
//   const [employeeData, setEmployeeData] = useState([]);
//   const [roles, setRoles] = useState({});
//   const [loading, setLoading] = useState(false);

//   const sections = [
//     { title: "Customer Management", icon: <Users className="w-4 h-4" />, items: ["View", "Add", "Edit"] },
//     { title: "Employee Registration", icon: <UserPlus className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Quality Management", icon: <BadgeCheck className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Category Management", icon: <Layers className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Brand Management", icon: <LayoutDashboard className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Product Registration", icon: <Package className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Architect Registration", icon: <DraftingCompass className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete", "Commission"] },
//     { title: "Inventory Management", icon: <ClipboardCheck className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Quotation Management", icon: <FileText className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete", "Pay", "DC", "Payment Requests"] },
//     { title: "Delivery Challans", icon: <Truck className="w-4 h-4" />, items: ["Update Timeline", "Delete", "Print DC", "Return DC"] },
//   ];

//   const allPages = sections.flatMap((s) => s.items.map((item) => `${s.title}_${item}`));

//   // 1. Fetch Employees
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const res = await getEmployeesAPI();
//         if (res.data.success) {
//           const emps = res.data.employees;
//           setEmployeeData(emps);
//           // 2. Fetch Roles for each employee after getting employee list
//           emps.forEach(emp => fetchRoles(emp.id));
//         }
//       } catch (err) { console.error("Init fail", err); }
//     };
//     init();
//   }, []);

//   const fetchRoles = async (id) => {
//     try {
//       const res = await getEmployeeRolesAPI(id);
//       if (res.data.success) {
//         setRoles(prev => ({ ...prev, [id]: res.data.permissions || {} }));
//       }
//     } catch (err) { console.error("Role fetch fail", id, err); }
//   };

//   const handleCheckboxChange = (empId, page) => {
//     setRoles((prev) => ({
//       ...prev,
//       [empId]: { ...prev[empId], [page]: !prev?.[empId]?.[page] },
//     }));
//   };

//   const handleSaveRoles = async () => {
//     setLoading(true);
//     try {
//       // Logic: Save modified roles to database
//       const savePromises = Object.keys(roles).map(empId =>
//         saveEmployeeRolesAPI({ employeeId: empId, permissions: roles[empId] })
//       );
//       await Promise.all(savePromises);
//       alert("Permissions updated successfully!");
//     } catch (err) {
//       alert("Failed to update roles");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-slate-50">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
//               <ShieldCheck className="text-indigo-600 w-8 h-8" /> Role Permissions
//             </h1>
//           </div>
//           <button
//             onClick={handleSaveRoles}
//             disabled={loading}
//             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg disabled:bg-slate-400"
//           >
//             {loading ? "Saving..." : <><Save size={18} /> Save All</>}
//           </button>
//         </div>

//         {/* Permissions Table */}
//         <div className="bg-white rounded-3xl shadow-xl border overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1200px] border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-slate-900 text-white">
//                   <th rowSpan={2} className="sticky left-0 z-20 bg-slate-900 p-4 text-left border-r border-slate-700">Employee Name</th>
//                   {sections.map(s => (
//                     <th key={s.title} colSpan={s.items.length} className="p-3 text-xs uppercase border-l border-slate-700 text-center">
//                       <div className="flex justify-center items-center gap-2">{s.icon} {s.title}</div>
//                     </th>
//                   ))}
//                 </tr>
//                 <tr className="bg-slate-800 text-white">
//                   {allPages.map(page => (
//                     <th key={page} className="p-2 text-[10px] border-l border-slate-700 text-center">{page.split("_")[1]}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {employeeData.map((emp) => (
//                   <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
//                     <td className="sticky left-0 bg-white p-4 border-r border-slate-200 font-bold text-sm">
//                       {emp.name}
//                     </td>
//                     {allPages.map((page) => (
//                       <td key={page} className="p-3 text-center border-l border-slate-100">
//                         <input
//                           type="checkbox"
//                           className="w-4 h-4 accent-indigo-600 cursor-pointer"
//                           checked={!!roles[emp.id]?.[page]}
//                           onChange={() => handleCheckboxChange(emp.id, page)}
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { BadgeCheck, ClipboardCheck, DraftingCompass, Factory, FileText, Layers, LayoutDashboard, Package, Save, ShieldCheck, Truck, UserPlus, Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import { getEmployeeRolesAPI, getEmployeesAPI, saveEmployeeRolesAPI } from "../Component/API/employeeApi";

// export default function EmployeeRole() {
//   const [employeeData, setEmployeeData] = useState([]);
//   const [roles, setRoles] = useState({});
//   const [loading, setLoading] = useState(false);

//   const sections = [
//     { title: "Customer Management", icon: <Users className="w-4 h-4" />, items: ["View", "Add", "Edit"] },
//     { title: "Employee Registration", icon: <UserPlus className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Quality Management", icon: <BadgeCheck className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Category Management", icon: <Layers className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Brand Management", icon: <LayoutDashboard className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Supplier  Management", icon: <Factory className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Product Registration", icon: <Package className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Architect Registration", icon: <DraftingCompass className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete", "Commission"] },
//     { title: "Inventory Management", icon: <ClipboardCheck className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
//     { title: "Quotation Management", icon: <FileText className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete", "Pay", "DC", "Payment Requests"] },
//     { title: "Delivery Challans", icon: <Truck className="w-4 h-4" />, items: ["View","Update Timeline", "Delete", "Print DC", "Return DC"] },
//   ];

//   // Generate a flat list of all "Section_Item" keys
//   const allPages = sections.flatMap((s) => s.items.map((item) => `${s.title}_${item}`));

//   /**
//    * Helper: Creates an object where every key from allPages is explicitly false
//    */
//   const getInitialPermissionState = () => {
//     return allPages.reduce((acc, key) => {
//       acc[key] = false;
//       return acc;
//     }, {});
//   };

//   // 1. Fetch Employees and then their specific roles
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const res = await getEmployeesAPI();
//         if (res.data.success) {
//           const emps = res.data.employees;
//           setEmployeeData(emps);
          
//           // Fetch roles for each employee found
//           emps.forEach(emp => fetchRoles(emp.id));
//         }
//       } catch (err) {
//         console.error("Initialization failed:", err);
//       }
//     };
//     init();
//   }, []);

//   const fetchRoles = async (id) => {
//     try {
//       const res = await getEmployeeRolesAPI(id);
      
//       // We start with a "perfect" false base
//       const defaultState = getInitialPermissionState();

//       if (res.data.success && res.data.permissions) {
//         const apiPerms = typeof res.data.permissions === 'string'
//           ? JSON.parse(res.data.permissions)
//           : res.data.permissions;

//         // Merge API data over the false base.
//         // Anything not in the API will remain 'false'.
//         setRoles(prev => ({
//           ...prev,
//           [id]: { ...defaultState, ...apiPerms }
//         }));
//       } else {
//         // If no roles exist in DB yet, initialize with all false
//         setRoles(prev => ({ ...prev, [id]: defaultState }));
//       }
//     } catch (err) {
//       console.error(`Role fetch fail for ID ${id}:`, err);
//       // Fallback to all false on error
//       setRoles(prev => ({ ...prev, [id]: getInitialPermissionState() }));
//     }
//   };

//   const handleCheckboxChange = (empId, page) => {
//     setRoles((prev) => ({
//       ...prev,
//       [empId]: {
//         ...prev[empId],
//         [page]: !prev?.[empId]?.[page]
//       },
//     }));
//   };

//   const handleSaveRoles = async () => {
//     setLoading(true);
//     try {
//       // Because we initialized with all keys, roles[empId] now contains
//       // the full map (View: true, Add: false, etc.)
//       const savePromises = Object.keys(roles).map(empId =>
//         saveEmployeeRolesAPI({
//             employeeId: empId,
//             permissions: roles[empId] // This is now a complete object
//         })
//       );
//       await Promise.all(savePromises);
//       alert("Permissions updated successfully!");
//     } catch (err) {
//       alert("Failed to update roles");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-slate-50">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
//               <ShieldCheck className="text-indigo-600 w-8 h-8" /> Role Permissions
//             </h1>
//             <p className="text-slate-500 mt-1">Manage feature access for all employees.</p>
//           </div>
//           <button
//             onClick={handleSaveRoles}
//             disabled={loading}
//             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg disabled:bg-slate-400 transition-all active:scale-95"
//           >
//             {loading ? "Saving..." : <><Save size={18} /> Save All Changes</>}
//           </button>
//         </div>

//         {/* Permissions Table */}
//         <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1200px] border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-slate-900 text-white">
//                   <th rowSpan={2} className="sticky left-0 z-20 bg-slate-900 p-4 text-left border-r border-slate-700 font-semibold">
//                     Employee Name
//                   </th>
//                   {sections.map(s => (
//                     <th key={s.title} colSpan={s.items.length} className="p-3 text-[11px] uppercase border-l border-slate-700 text-center tracking-wider">
//                       <div className="flex justify-center items-center gap-2">
//                         <span className="opacity-70">{s.icon}</span>
//                         {s.title}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//                 <tr className="bg-slate-800 text-white">
//                   {allPages.map(page => (
//                     <th key={page} className="p-2 text-[9px] border-l border-slate-700 text-center font-normal opacity-80">
//                       {page.split("_")[1]}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {employeeData.map((emp) => (
//                   <tr key={emp.id} className="hover:bg-indigo-50/30 transition-colors group">
//                     <td className="sticky left-0 bg-white group-hover:bg-slate-50 p-4 border-r border-slate-200 font-bold text-sm text-slate-700 shadow-[2px_0_5px_rgba(0,0,0,0,0.05)]">
//                       {emp.name}
//                     </td>
//                     {allPages.map((page) => (
//                       <td key={page} className="p-3 text-center border-l border-slate-100">
//                         <div className="flex justify-center">
//                           <input
//                             type="checkbox"
//                             className="w-5 h-5 accent-indigo-600 cursor-pointer rounded border-slate-300 focus:ring-indigo-500"
//                             checked={!!roles[emp.id]?.[page]}
//                             onChange={() => handleCheckboxChange(emp.id, page)}
//                           />
//                         </div>
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { BadgeCheck, CheckSquare, ClipboardCheck, DraftingCompass, Factory, FileText, Layers, LayoutDashboard, Package, Save, ShieldCheck, Truck, UserPlus, Users } from "lucide-react";
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
    { title: "Supplier Management", icon: <Factory className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
    { title: "Product Registration", icon: <Package className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete"] },
    { title: "Architect Registration", icon: <DraftingCompass className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete", "Commission"] },
    { title: "Inventory Management", icon: <ClipboardCheck className="w-4 h-4" />, items: ["View", "Add", "Delete"] },
    { title: "Quotation Management", icon: <FileText className="w-4 h-4" />, items: ["View", "Add", "Edit", "Delete", "Pay", "DC", "Payment Requests"] },
    { title: "Delivery Challans", icon: <Truck className="w-4 h-4" />, items: ["View", "Update Timeline", "Delete", "Print DC", "Return DC"] },
  ];

  const allPages = sections.flatMap((s) => s.items.map((item) => `${s.title}_${item}`));

  const getInitialPermissionState = () => {
    return allPages.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
  };

  // --- BULK ACTION HANDLERS ---

  // 1. Toggle EVERYTHING (Global)
  const handleToggleAll = () => {
    const isAllChecked = employeeData.every(emp => 
      allPages.every(page => roles[emp.id]?.[page])
    );
    const nextState = !isAllChecked;
    const newRoles = { ...roles };
    employeeData.forEach(emp => {
      newRoles[emp.id] = allPages.reduce((acc, page) => ({ ...acc, [page]: nextState }), {});
    });
    setRoles(newRoles);
  };

  // 2. Toggle one specific employee (Row)
  const handleToggleRow = (empId) => {
    const isRowFull = allPages.every(page => roles[empId]?.[page]);
    const nextState = !isRowFull;
    setRoles(prev => ({
      ...prev,
      [empId]: allPages.reduce((acc, page) => ({ ...acc, [page]: nextState }), {})
    }));
  };

  // 3. Toggle one specific section for all employees (Column Group)
  const handleToggleSection = (sectionTitle, items) => {
    const sectionKeys = items.map(item => `${sectionTitle}_${item}`);
    const isSectionFull = employeeData.every(emp => sectionKeys.every(key => roles[emp.id]?.[key]));
    const nextState = !isSectionFull;
    
    setRoles(prev => {
      const updated = { ...prev };
      employeeData.forEach(emp => {
        updated[emp.id] = {
          ...updated[emp.id],
          ...sectionKeys.reduce((acc, key) => ({ ...acc, [key]: nextState }), {})
        };
      });
      return updated;
    });
  };

  // --- DATA FETCHING ---

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getEmployeesAPI();
        if (res.data.success) {
          const emps = res.data.employees;
          setEmployeeData(emps);
          emps.forEach(emp => fetchRoles(emp.id));
        }
      } catch (err) {
        console.error("Initialization failed:", err);
      }
    };
    init();
  }, []);

  const fetchRoles = async (id) => {
    try {
      const res = await getEmployeeRolesAPI(id);
      const defaultState = getInitialPermissionState();
      if (res.data.success && res.data.permissions) {
        const apiPerms = typeof res.data.permissions === 'string' ? JSON.parse(res.data.permissions) : res.data.permissions;
        setRoles(prev => ({ ...prev, [id]: { ...defaultState, ...apiPerms } }));
      } else {
        setRoles(prev => ({ ...prev, [id]: defaultState }));
      }
    } catch (err) {
      setRoles(prev => ({ ...prev, [id]: getInitialPermissionState() }));
    }
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
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="text-indigo-600 w-8 h-8" /> Role Permissions
            </h1>
            <p className="text-slate-500 mt-1">Manage feature access for all employees.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleToggleAll}
              className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-all font-medium shadow-sm"
            >
              <CheckSquare size={18} /> Toggle Everything
            </button>
            <button 
              onClick={handleSaveRoles} 
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg disabled:bg-slate-400 transition-all active:scale-95 font-semibold"
            >
              {loading ? "Saving..." : <><Save size={18} /> Save All Changes</>}
            </button>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th rowSpan={2} className="sticky left-0 z-30 bg-slate-900 p-4 text-left border-r border-slate-700 font-semibold min-w-[220px]">
                    <div className="flex items-center gap-2">
                       Employee Name
                    </div>
                  </th>
                  {sections.map(s => (
                    <th 
                      key={s.title} 
                      colSpan={s.items.length} 
                      className="p-3 text-[11px] uppercase border-l border-slate-700 text-center tracking-wider hover:bg-slate-800 transition-colors cursor-pointer group"
                      onClick={() => handleToggleSection(s.title, s.items)}
                      title="Click to toggle entire section"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <span className="opacity-70 group-hover:scale-110 transition-transform">{s.icon}</span>
                        {s.title}
                      </div>
                    </th>
                  ))}
                </tr>
                <tr className="bg-slate-800 text-white">
                  {allPages.map(page => (
                    <th key={page} className="p-2 text-[9px] border-l border-slate-700 text-center font-normal opacity-80">
                      {page.split("_")[1]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employeeData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50 p-4 border-r border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-700">{emp.name}</span>
                        <button 
                          onClick={() => handleToggleRow(emp.id)}
                          className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                        >
                          Toggle Row
                        </button>
                      </div>
                    </td>
                    {allPages.map((page) => (
                      <td key={page} className="p-3 text-center border-l border-slate-100">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-indigo-600 cursor-pointer rounded border-slate-300 focus:ring-indigo-500"
                            checked={!!roles[emp.id]?.[page]}
                            onChange={() => handleCheckboxChange(emp.id, page)}
                          />
                        </div>
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