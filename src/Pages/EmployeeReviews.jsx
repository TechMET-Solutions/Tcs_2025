import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getEmployeesAPI } from "../Component/API/employeeApi";

export default function EmployeeReviews() {
  const [employeeList, setEmployeeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reviewType, setReviewType] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await getEmployeesAPI();
    if (res.data.success) {
      setEmployeeList(res.data.employees);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Employee Reviews</h2>

      {/* TABLE */}
      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-[#FA9C42] text-white">
          <tr>
            <th className="p-4">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employeeList.map((emp, i) => (
            <tr key={i} className="border-t text-center">
              <td className="p-4">{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td className="flex gap-2 justify-center p-3">
                <button
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setReviewType("rating");
                    setShowModal(true);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  ⭐ Rating
                </button>

                <button
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setReviewType("feedback");
                    setShowModal(true);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  💬 Feedback
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-xl p-6">
            <div className="flex justify-between mb-3">
              <h3 className="text-lg font-semibold">
                {reviewType === "rating" ? "⭐ Ratings" : "💬 Feedback"}
              </h3>
              <X onClick={() => setShowModal(false)} />
            </div>

            <p className="mb-4">
              Employee: <strong>{selectedEmployee.name}</strong>
            </p>

            {reviewType === "rating" ? (
              <div className="space-y-2">
                {[5, 4, 5].map((r, i) => (
                  <div key={i} className="flex justify-between border p-3 rounded">
                    <span>Client {i + 1}</span>
                    <span>{"⭐".repeat(r)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  "Very professional",
                  "Good communication",
                  "On-time delivery",
                ].map((f, i) => (
                  <div key={i} className="border p-3 rounded bg-gray-50">
                    {f}
                  </div>
                ))}
              </div>
            )}

            <div className="text-right mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
