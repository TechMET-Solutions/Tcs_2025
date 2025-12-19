import axios from "axios";
import { MessageCircle, Plus, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ✅ TOOLTIP COMPONENT */
const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap shadow-lg">
        {text}
      </div>
    </div>
  );
};

export default function CustomerManagement() {
  const BASE_URL = "http://localhost:5000/api/users";

  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpdateFollowup, setShowUpdateFollowup] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const [followupUpdate, setFollowupUpdate] = useState({
    date: "",
    response: "",
  });

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    assignedEmployee: "",
    assignedArchitect: "",
    status: "New",
    nextFollowup: "",
    followupResponse: "",
    notes: "",
  });

  const [customerList, setCustomerList] = useState([]);

  /* ✅ STRICT MODE SAFE API CALL (NO RE-RENDER LOOP) */
  const apiCalled = useRef(false);

  useEffect(() => {
    if (!apiCalled.current) {
      apiCalled.current = true;
      fetchCustomers();
    }
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/list`);
      setCustomerList(res.data.customers || []);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleFollowupInput = (e) => {
    setFollowupUpdate({ ...followupUpdate, [e.target.name]: e.target.value });
  };

  /* ✅ SAVE CUSTOMER */
  const saveCustomer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/add`, customer);
      await fetchCustomers();

      setShowModal(false);
      setCustomer({
        name: "",
        phone: "",
        email: "",
        assignedEmployee: "",
        assignedArchitect: "",
        status: "New",
        nextFollowup: "",
        followupResponse: "",
        notes: "",
      });
    } catch (err) {
      console.log("Save Error:", err);
    }
  };

  /* ✅ SAVE FOLLOW-UP */
  const saveNewFollowup = async () => {
    try {
      await axios.post(`${BASE_URL}/followup/add`, {
        customerId: customerList[activeIndex]?.id,
        date: followupUpdate.date,
        response: followupUpdate.response,
      });

      setFollowupUpdate({ date: "", response: "" });
      setShowUpdateFollowup(false);
    } catch (err) {
      console.log("Followup Error:", err);
    }
  };

  /* ✅ OPEN HISTORY */
  const openHistory = async (item) => {
    try {
      const res = await axios.get(`${BASE_URL}/followups/${item.id}`);
      setSelectedCustomer({
        ...item,
        followups: res.data.followups || [],
      });
      setShowHistory(true);
    } catch (err) {
      console.log("History Error:", err);
    }
  };

  return (
    <div className="p-6 font-['Lexend']">

      {/* ✅ HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
          <Users size={30} className="text-blue-600" />
          Customer Management (CRM)
        </h1>

        <Tooltip text="Add New Customer">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl shadow-lg hover:bg-purple-700"
          >
            <Plus size={18} /> Add Customer
          </button>
        </Tooltip>
      </div>

      {/* ✅ TABLE */}
      <table className="w-full rounded-2xl overflow-hidden shadow-xl bg-white">
        <thead>
          <tr className="bg-purple-100 text-gray-700">
            {["Customer", "Phone", "Employee", "Architect", "Status", "Next Follow-up", "Actions"].map(h => (
              <th key={h} className="p-4 text-left text-sm font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customerList.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-10 text-gray-500 italic">
                No customers added yet.
              </td>
            </tr>
          ) : (
            customerList.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-blue-50 border-b">
                <td className="p-4 font-semibold">{item.name}</td>
                <td className="p-4">{item.phone}</td>
                <td className="p-4">{item.assignedEmployee}</td>
                <td className="p-4">{item.assignedArchitect || "-"}</td>
                <td className="p-4">{item.status}</td>
                <td className="p-4">{item.nextFollowup || "-"}</td>

                <td className="p-4 flex gap-2">
                  <Tooltip text="Send Message">
                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg">
                      <MessageCircle size={14} />
                    </button>
                  </Tooltip>

                  <Tooltip text="View History">
                    <button
                      onClick={() => openHistory(item)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded-lg"
                    >
                      History
                    </button>
                  </Tooltip>

                  <Tooltip text="Add Follow-up">
                    <button
                      onClick={() => {
                        setActiveIndex(index);
                        setShowUpdateFollowup(true);
                      }}
                      className="bg-orange-500 text-white px-3 py-1 rounded-lg"
                    >
                      + Follow-up
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ ADD CUSTOMER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="w-[650px] bg-white p-7 rounded-2xl shadow-2xl">
            <div className="flex justify-between mb-5">
              <h2 className="text-xl font-bold">Add Customer</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>

            <form className="grid grid-cols-2 gap-5" onSubmit={saveCustomer}>
              <input name="name" onChange={handleChange} value={customer.name} placeholder="Name" className="border p-2 rounded" required />
              <input name="phone" onChange={handleChange} value={customer.phone} placeholder="Phone" className="border p-2 rounded" required />
              <input name="email" onChange={handleChange} value={customer.email} placeholder="Email" className="border p-2 rounded col-span-2" />
              <select name="assignedEmployee" onChange={handleChange} value={customer.assignedEmployee} className="border p-2 rounded">
                <option value="">Select Employee</option>
                <option>Rahul</option>
                <option>Sagar</option>
                <option>Pritesh</option>
              </select>
              <select name="assignedArchitect" onChange={handleChange} value={customer.assignedArchitect} className="border p-2 rounded">
                <option value="">Select Architect</option>
                <option>Architect 1</option>
                <option>Architect 2</option>
              </select>
              <select name="status" onChange={handleChange} value={customer.status} className="border p-2 rounded">
                <option>New</option>
                <option>Pending</option>
                <option>Hold</option>
                <option>Quoted</option>
                <option>Finalized</option>
              </select>
              <input type="date" name="nextFollowup" onChange={handleChange} value={customer.nextFollowup} className="border p-2 rounded" />
              <textarea name="followupResponse" onChange={handleChange} value={customer.followupResponse} className="border p-2 rounded col-span-2" placeholder="Follow-up response"></textarea>
              <textarea name="notes" onChange={handleChange} value={customer.notes} className="border p-2 rounded col-span-2" placeholder="Notes"></textarea>

              <button type="submit" className="col-span-2 bg-blue-600 text-white py-3 rounded-xl">
                Save Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ✅ ADD FOLLOW-UP MODAL */}
      {showUpdateFollowup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[450px] p-6 rounded-xl shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold">Add New Follow-up</h2>
              <button onClick={() => setShowUpdateFollowup(false)}><X /></button>
            </div>

            <input type="date" name="date" value={followupUpdate.date} onChange={handleFollowupInput} className="border p-2 rounded w-full mb-3" />
            <textarea name="response" value={followupUpdate.response} onChange={handleFollowupInput} className="border p-2 rounded w-full" placeholder="Follow-up response..." />

            <button onClick={saveNewFollowup} className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg">
              Save Follow-up
            </button>
          </div>
        </div>
      )}

      {/* ✅ HISTORY MODAL */}
      {showHistory && selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[500px] p-6 rounded-xl shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold">
                Follow-up History - {selectedCustomer.name}
              </h2>
              <button onClick={() => setShowHistory(false)}><X /></button>
            </div>

            {selectedCustomer.followups.length === 0 ? (
              <p className="text-gray-500 italic">No follow-ups yet.</p>
            ) : (
              selectedCustomer.followups.map((f, i) => (
                <div key={i} className="border p-3 rounded-lg mb-3 bg-gray-50">
                  <p className="text-sm font-semibold">📅 {f.date}</p>
                  <p className="text-gray-700 text-sm mt-1">
                    {f.response || "No response"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
