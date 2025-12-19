import React, { useEffect, useState } from "react";
import { getEmployeeRolesAPI, getEmployeesAPI, saveEmployeeRolesAPI } from "../Component/API/employeeApi";


export default function EmployeeRole() {
  const [employeeData, setEmployeeData] = useState([]);
  const [roles, setRoles] = useState({});

  const pages = [
    "Dashboard",
    "Product Registration",
    "Architect Registration",
    "Generate Quote",
    "Employee Registration",
    "Delivery Challan",
    "Customer Management",
    "Category Management",
    "Quality Management",
    "Brand Management",
    "Add Inventory",
    "Manage Inventory",
    "Add Quotation",
    "Manage Quotation",
  ];

  // ===================== FETCH EMPLOYEES =====================
  const fetchEmployees = async () => {
    try {
      const res = await getEmployeesAPI();
      if (res.data.success) {
        setEmployeeData(res.data.employees);
      }
    } catch (err) {
      console.log("Employee fetch failed", err);
    }
  };

  // ===================== FETCH ROLES =====================
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
      console.log("Role fetch failed", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    employeeData.forEach((emp) => fetchEmployeeRoles(emp.id));
  }, [employeeData]);

  // ===================== HANDLE CHECKBOX =====================
  const handleCheckboxChange = (empId, page) => {
    setRoles((prev) => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [page]: !prev?.[empId]?.[page],
      },
    }));
  };

  // ===================== SAVE ROLES =====================
  const handleSaveRoles = async () => {
    try {
      for (const empId in roles) {
        await saveEmployeeRolesAPI({
          employeeId: empId,
          permissions: roles[empId],
        });
      }
      alert("Roles saved successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to save roles");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Employee Role Management
      </h1>

      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Employee</th>
              {pages.map((page) => (
                <th key={page} className="p-2 border text-sm">
                  {page}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {employeeData.map((emp) => (
              <tr key={emp.id} className="border">
                <td className="p-2 border font-medium">
                  {emp.name}
                  <br />
                  <small className="text-gray-500">{emp.email}</small>
                </td>

                {pages.map((page) => (
                  <td key={page} className="p-2 border text-center">
                    <input
                      type="checkbox"
                      checked={roles?.[emp.id]?.[page] || false}
                      onChange={() =>
                        handleCheckboxChange(emp.id, page)
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        onClick={handleSaveRoles}
      >
        Save Roles
      </button>
    </div>
  );
}
