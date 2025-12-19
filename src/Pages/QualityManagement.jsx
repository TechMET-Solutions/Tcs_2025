import axios from "axios";
import { Edit, Layers, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Images } from "../assets";

const BASE_URL = "http://localhost:5000/api/qualities";

export default function QualityManagement() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [quality, setQuality] = useState({
    name: "",
    status: "Available",
  });

  const [qualityList, setQualityList] = useState([]);

  // ✅ FETCH DATA FROM BACKEND
  const fetchQualities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/list`);
      setQualityList(res.data.qualities);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchQualities();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setQuality({ ...quality, [e.target.name]: e.target.value });
  };

  // ✅ SAVE (CREATE + UPDATE)
  const saveQuality = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/update/${currentId}`, quality);
      } else {
        await axios.post(`${BASE_URL}/create`, quality);
      }

      setQuality({ name: "", status: "Available" });
      setIsEditing(false);
      setShowModal(false);
      fetchQualities();
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  // ✅ EDIT
  const editQuality = (item) => {
    setQuality({ name: item.name, status: item.status });
    setCurrentId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // ✅ CONFIRM DELETE
  const confirmDelete = (item) => {
    setCurrentId(item.id);
    setShowDeleteModal(true);
  };

  // ✅ DELETE
  const deleteQuality = async () => {
    try {
      await axios.delete(`${BASE_URL}/delete/${currentId}`);
      setShowDeleteModal(false);
      fetchQualities();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="p-6 font-['Lexend']">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 px-4 py-2 border rounded-xl">
        <h1 className="text-2xl font-semibold flex items-center gap-3 text-gray-800">
          Quality Management
        </h1>
        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            setQuality({ name: "", status: "Available" });
          }}
          className="flex items-center gap-2  text-[#FA9C42] px-4 py-2 rounded-lg border border-[#FA9C42]"
        >
          <Plus size={18} /> Add Quality
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full rounded-2xl text-center overflow-hidden shadow">
        <thead>
          <tr className="bg-[#FA9C42] text-white ">
            <th className="py-6 px-2">Quality Name</th>
            <th className="py-6 px-2">Status</th>
            <th className="py-6 px-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {qualityList.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center p-8 text-gray-500 italic">
                No quality added yet.
              </td>
            </tr>
          ) : (
            qualityList.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-blue-50/40 transition-all"
              >
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3 flex items-center justify-center gap-3">
                  <button
                    onClick={() => editQuality(item)}
                    className="px-3 py-2 rounded-lg text-balck hover:scale-105 transition"
                  >
                    <Edit size={20} />
                  </button>

                  <button
                    onClick={() => confirmDelete(item)}
                    className="px-3 py-2 rounded-lg font-bold text-red-700 hover:scale-105 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="w-[460px] bg-[#FFF7EF] rounded-2xl p-7 shadow-xl">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={Images.User} alt="Add User" className="w-8 h-8" />
                <h2 className="text-xl font-bold text-gray-800"> {isEditing ? "Edit Quality" : "Add Quality"}</h2>
              </div>
              <button onClick={() => setShowModal(false)}>
                <img
                  src={Images.Cross}
                  alt="Close"
                  className="w-8 h-8"
                />
              </button>
            </div>

            <form onSubmit={saveQuality} className="grid gap-4">
              <input
                name="name"
                value={quality.name}
                onChange={handleChange}
                placeholder="Quality Name"
                className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none border-[#FA9C42]"
                required
              />

              <select
                name="status"
                value={quality.status}
                onChange={handleChange}
                className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none border-[#FA9C42]"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>

              <div className="pt-2 flex justify-end mr-5">
                <button
                  type="submit"
                  className="w-[120px] bg-[#f57a00] text-white p-2 rounded-xl font-semibold transition"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[400px] p-7 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Delete Quality?</h2>
            <p className="mb-6 text-gray-600">This action cannot be undone.</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={deleteQuality}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
