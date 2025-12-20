import axios from "axios";
import { Badge, Edit, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Images } from "../assets";

const BASE_URL = "http://localhost:5000/api/brands";

export default function BrandManagement() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [brand, setBrand] = useState({
    name: "",
    status: "Available",
  });

  const [brandList, setBrandList] = useState([]);

  // ✅ FETCH ALL BRANDS
  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/list`);
      setBrandList(res.data.brands);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setBrand({ ...brand, [e.target.name]: e.target.value });
  };

  // ✅ SAVE BRAND (CREATE + UPDATE)
  const saveBrand = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/update/${currentId}`, brand);
      } else {
        await axios.post(`${BASE_URL}/create`, brand);
      }

      setBrand({ name: "", status: "Available" });
      setIsEditing(false);
      setShowModal(false);
      fetchBrands();
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  // ✅ EDIT BRAND
  const editBrand = (item) => {
    setBrand({ name: item.name, status: item.status });
    setCurrentId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // ✅ CONFIRM DELETE
  const confirmDelete = (item) => {
    setCurrentId(item.id);
    setShowDeleteModal(true);
  };

  // ✅ DELETE BRAND
  const deleteBrand = async () => {
    try {
      await axios.delete(`${BASE_URL}/delete/${currentId}`);
      setShowDeleteModal(false);
      fetchBrands();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 px-4 py-2 border rounded-xl">
        <h1 className="text-2xl font-semibold flex items-center gap-3 text-gray-800">
          Brand Management
        </h1>
        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            setBrand({ name: "", status: "Available" });
          }}
          className="flex items-center gap-2  text-[#FA9C42] px-4 py-2 rounded-lg border border-[#FA9C42]"
        >
          <Plus size={18} /> Add Quality
        </button>
      </div>

      {/* BRAND LIST */}
      <div className="w-full rounded-2xl text-center overflow-hidden shadow">
        <table className="w-full rounded-xl overflow-hidden">
          <thead className="bg-[#FA9C42] text-white text-center">
            <tr>
              <th className="py-6 px-2">Brand Name</th>
              <th className="py-6 px-2">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {brandList.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500 italic">
                  No brand added yet.
                </td>
              </tr>
            ) : (
              brandList.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{item.name}</td>

                  <td className="p-3">
                    <span
                      className={`inline-block text-center px-3 py-1 border-2 rounded-lg font-medium
      w-32
      ${item.status === "Available"
                          ? "border-green-600 text-green-700"
                          : "border-red-600 text-red-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <button
                      onClick={() => editBrand(item)}
                      className="px-3 py-2 rounded-lg text-balck hover:scale-105 transition"
                    >
                      <Edit size={20} />
                    </button>

                    <button
                      onClick={() => confirmDelete(item)}
                      className="px-3 py-2 rounded-lg text-red-600 hover:scale-105 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-[#FFF7EF] w-[450px] rounded-xl p-6 shadow-xl animate-scaleIn">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={Images.User} alt="Add User" className="w-8 h-8" />
                <h2 className="text-xl font-bold text-gray-800"> {isEditing ? "Edit Brand" : "Add Brand"}</h2>
              </div>
              <button onClick={() => setShowModal(false)}>
                <img
                  src={Images.Cross}
                  alt="Close"
                  className="w-8 h-8"
                />
              </button>
            </div>

            <form onSubmit={saveBrand} className="grid gap-4">
              <div>
                <label className="font-medium">Brand Name</label>
                <input
                  name="name"
                  value={brand.name}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  className="w-full mt-1 border-2 rounded-lg px-3 py-2 focus:outline-none border-[#FA9C42]"
                  required
                />
              </div>

              <div>
                <label className="font-medium">Status</label>
                <select
                  name="status"
                  value={brand.status}
                  onChange={handleChange}
                  className="w-full mt-1 border-2 rounded-lg px-3 py-2 focus:outline-none border-[#FA9C42]"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white w-[400px] p-6 rounded-xl shadow-xl animate-scaleIn">
            <h2 className="text-xl font-semibold mb-3">Delete Brand?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this brand? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={deleteBrand}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANIMATION */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
