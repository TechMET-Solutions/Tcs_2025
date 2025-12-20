import {
  Plus,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  createEmployeeAPI,
  getEmployeesAPI,
} from "../Component/API/employeeApi";

export default function EmployeeRegistration() {
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewType, setReviewType] = useState(""); // rating | feedback
  const [selectedEmployee, setSelectedEmployee] = useState(null);
const [documents, setDocuments] = useState({
  aadhar: null,
  pancard: null,
});

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    commission: "",
    birthdate: "",
    phone: "",
    salary: "",
    expense: "",
    advance: "",
  });

  const [employeeList, setEmployeeList] = useState([]);

  // ===================== INPUT =====================
  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  // ===================== FETCH =====================
  const fetchEmployeesFromDB = async () => {
    try {
      const res = await getEmployeesAPI();
      if (res.data.success) {
        setEmployeeList(res.data.employees);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEmployeesFromDB();
  }, []);

  // ===================== SAVE =====================
  const saveEmployee = async (e) => {
    e.preventDefault();

    try {
      await createEmployeeAPI(employee);
      fetchEmployeesFromDB();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }

    setEmployee({
      name: "",
      email: "",
      password: "",
      commission: "",
      birthdate: "",
      phone: "",
      salary: "",
      expense: "",
      advance: "",
    });
  };
const handleFileChange = (e) => {
  const { name, files } = e.target;

  setDocuments((prev) => ({
    ...prev,
    [name]: files[0],
  }));
};

  return (
    <div className="p-6">

      {/* HEADER */}
      {/* <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold flex items-center gap-2">
          <User /> Employee Registration
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Add Employee
        </button>
      </div> */}
 <div className="flex justify-between items-center mb-10 px-4 py-2 border rounded-xl">
              <h1 className="text-2xl font-semibold flex items-center gap-3 text-gray-800">
                {/* <Users size={30} className="text-blue-600" /> */}
        Employee Registration
              </h1>
              <button
                onClick={() => {
                  setShowModal(true);
                  // setIsEditing(false);
                  // setQuality({ name: "", status: "Available" });
                }}
                className="flex items-center gap-2  text-[#FA9C42] px-4 py-2 rounded-lg border border-[#FA9C42] hover:bg-orange-500 hover:text-white "
              >
                <Plus size={18} /> Add Employee
              </button>
            </div>
      {/* TABLE */}
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Name",
              "Email",
              "Phone",
              "Commission",
              "Salary",
              "Expense",
              "Birthdate",
              "Actions",
            ].map((h) => (
              <th key={h} className="p-4 text-center bg-[#FA9C42] text-white py-6 px-2 ">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {employeeList.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-6 text-gray-400">
                No employees found
              </td>
            </tr>
          ) : (
            employeeList.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.email}</td>
                <td className="p-4">{item.phone}</td>
                <td className="p-4">{item.commission}%</td>
                <td className="p-4">₹{item.salary}</td>
                <td className="p-4">₹{item.expense}</td>
                <td className="p-4">{item.birthdate}</td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedEmployee(item);
                      setReviewType("rating");
                      setShowReviewModal(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    ⭐ Rating
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEmployee(item);
                      setReviewType("feedback");
                      setShowReviewModal(true);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    💬 Feedback
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ADD EMPLOYEE MODAL */}
     {showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-[700px] rounded-xl p-6 shadow-xl">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Add Employee</h3>
        <X
          className="cursor-pointer"
          onClick={() => setShowModal(false)}
        />
      </div>

      <form onSubmit={saveEmployee} className="space-y-5">

        {/* ROW 1 */}
        <div className="flex gap-8 justify-center">
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={employee.name}
              onChange={handleChange}
              className="border p-2 w-[260px] rounded mt-1"
              required
            />
          </div>

          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="Last_Name"
              value={employee.Last_Name}
              onChange={handleChange}
              className="border p-2 w-[260px] rounded mt-1"
              required
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="flex gap-8 justify-center">
          <div>
            <label>Mobile No</label>
            <input
              type="text"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              className="border p-2 w-[260px] rounded mt-1"
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              className="border p-2 w-[260px] rounded mt-1"
              required
            />
          </div>
        </div>

        {/* ROW 3 */}
        <div className="flex gap-8 justify-center">
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={employee.password}
              onChange={handleChange}
              className="border p-2 w-[260px] rounded mt-1"
              required
            />
          </div>

          <div>
            <label>Commission (%)</label>
            <input
              type="number"
              name="commission"
              value={employee.commission}
              onChange={handleChange}
              className="border p-2 w-[260px] rounded mt-1"
            />
          </div>
        </div>

        {/* ROW 4 */}
        <div className="flex gap-8 justify-center">
          <div>
            <label>Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={employee.birthdate}
              onChange={handleChange}
              className="border p-2 w-[260px] rounded mt-1"
            />
          </div>

          <div>
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              className="border p-2 w-[260px] rounded mt-1"
            />
          </div>
        </div>

        {/* ROW 5 – DOCUMENT UPLOAD */}
        <div className="flex gap-8 justify-center">
          <div>
            <label>Upload Aadhar Photo</label>
            <input
              type="file"
              name="aadhar"
              onChange={handleFileChange}
              className="border p-2 w-[260px] rounded mt-1"
            />
          </div>

          <div>
            <label>Upload Pancard Photo</label>
            <input
              type="file"
              name="pancard"
              onChange={handleFileChange}
              className="border p-2 w-[260px] rounded mt-1"
            />
          </div>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg"
          >
            Save Employee
          </button>
        </div>

      </form>
    </div>
  </div>
)}

      {/* RATING / FEEDBACK MODAL */}
      {showReviewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-xl p-6">
            <div className="flex justify-between mb-3">
              <h3 className="text-lg font-semibold">
                {reviewType === "rating"
                  ? "⭐ Client Ratings"
                  : "💬 Client Feedback"}
              </h3>
              <X onClick={() => setShowReviewModal(false)} />
            </div>

            <p className="text-sm mb-4">
              Employee: <strong>{selectedEmployee.name}</strong>
            </p>

            {reviewType === "rating" ? (
              <div className="space-y-2">
                {[5, 4, 5].map((r, i) => (
                  <div
                    key={i}
                    className="flex justify-between border p-3 rounded"
                  >
                    <span>Client {i + 1}</span>
                    <span>{"⭐".repeat(r)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-auto">
                {[
                  "Very professional",
                  "Great communication",
                  "Handled project smoothly",
                ].map((msg, i) => (
                  <div key={i} className="border p-3 rounded bg-gray-50">
                    {msg}
                  </div>
                ))}
              </div>
            )}

            <div className="text-right mt-4">
              <button
                onClick={() => setShowReviewModal(false)}
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
