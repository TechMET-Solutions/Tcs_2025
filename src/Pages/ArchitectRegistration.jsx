import axios from "axios";
import { Plus, User, X } from "lucide-react";
import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000/api/architects";

export default function ArchitectRegistration() {
  const [showModal, setShowModal] = useState(false);

  const [architect, setArchitect] = useState({
    name: "",
    whatsapp: "",
    commission: "",
    birthdate: "",
    loyaltyPoints: "",
    remark:""
  });

  const [architectList, setArchitectList] = useState([]);

  // ✅ FETCH ARCHITECTS
  const fetchArchitects = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/list`);
      setArchitectList(res.data.architects);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchArchitects();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setArchitect({ ...architect, [e.target.name]: e.target.value });
  };

  // ✅ SAVE ARCHITECT
  const saveArchitect = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/create`, architect);
      fetchArchitects();
      setShowModal(false);

      setArchitect({
        name: "",
        whatsapp: "",
        commission: "",
        birthdate: "",
        loyaltyPoints: "",
        remark:""
      });
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <User size={26} /> Architect Registration
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <Plus size={18} /> Add Architect
        </button>
      </div>

      {/* Architect List */}
      <div className="bg-white p-6 shadow-xl rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Architect List</h3>

        <table className="w-full rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">WhatsApp</th>
              <th className="p-3">Commission (%)</th>
              <th className="p-3">Birthdate</th>
              <th className="p-3">Loyalty Points</th>
              <th className="p-3">remark</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {architectList.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-gray-500 italic">
                  No architects registered yet.
                </td>
              </tr>
            ) : (
              architectList.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.whatsapp}</td>
                  <td className="p-3">{item.commission}%</td>
                  <td className="p-3">{item.birthdate}</td>
                  <td className="p-3">{item.loyaltyPoints}</td>
                   <td className="p-3">{item.remark}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Architect Modal */}
     {showModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
    <div className="bg-white w-[600px] rounded-xl p-6 shadow-xl">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Add Architect</h2>
        <button onClick={() => setShowModal(false)}>
          <X />
        </button>
      </div>

      <form className="grid grid-cols-2 gap-4" onSubmit={saveArchitect}>
        <input
          name="name"
          value={architect.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2"
          required
        />

        <input
          name="whatsapp"
          value={architect.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp"
          className="border p-2"
          required
        />

        <input
          type="number"
          name="commission"
          value={architect.commission}
          onChange={handleChange}
          placeholder="Commission %"
          className="border p-2"
          required
        />

        <input
          type="date"
          name="birthdate"
          value={architect.birthdate}
          onChange={handleChange}
          className="border p-2"
          required
        />

        <input
          type="number"
          name="loyaltyPoints"
          value={architect.loyaltyPoints}
          onChange={handleChange}
          placeholder="Loyalty Points"
          className="border p-2"
        />

        {/* ✅ REMARK FIELD */}
        <textarea
          name="remark"
          value={architect.remark}
          onChange={handleChange}
          placeholder="Remark"
          className="border p-2 col-span-2 resize-none"
          rows={3}
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded-lg mt-2"
        >
          Save Architect
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
