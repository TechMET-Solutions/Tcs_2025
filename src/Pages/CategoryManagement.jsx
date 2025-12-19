import axios from "axios";
import { Edit, Plus, Tags, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:5000/api/categories";

export default function CategoryManagement() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [category, setCategory] = useState({
    name: "",
    status: "Available",
  });

  const [categoryList, setCategoryList] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  // ✅ FETCH ALL CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/list`);
      setCategoryList(res.data.categories);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  // ✅ SAVE CATEGORY (CREATE + UPDATE)
  const saveCategory = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/update/${currentId}`, category);
      } else {
        await axios.post(`${BASE_URL}/create`, category);
      }

      setCategory({ name: "", status: "Available" });
      setIsEditing(false);
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  // ✅ EDIT CATEGORY
  const editCategory = (item) => {
    setCategory({ name: item.name, status: item.status });
    setCurrentId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // ✅ CONFIRM DELETE
  const confirmDelete = (item) => {
    setCurrentId(item.id);
    setShowDeleteModal(true);
  };

  // ✅ DELETE CATEGORY
  const deleteCategory = async () => {
    try {
      await axios.delete(`${BASE_URL}/delete/${currentId}`);
      setShowDeleteModal(false);
      fetchCategories();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <Tags size={26} /> Category Management
        </h1>

        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            setCategory({ name: "", status: "Available" });
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* CATEGORY LIST */}
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Category List</h3>

        <table className="w-full rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categoryList.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-6 text-gray-500 italic">
                  No categories added yet.
                </td>
              </tr>
            ) : (
              categoryList.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-medium">{item.name}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-3 text-center flex items-center justify-center gap-3">
                    <button
                      onClick={() => editCategory(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>

                    <button
                      onClick={() => confirmDelete(item)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
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
          <div className="bg-white w-[450px] rounded-xl p-6 shadow-xl animate-scaleIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={saveCategory} className="grid gap-4">
              <div>
                <label className="font-medium">Category Name</label>
                <input
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="border rounded p-2 w-full mt-1"
                  required
                />
              </div>

              <div>
                <label className="font-medium">Status</label>
                <select
                  name="status"
                  value={category.status}
                  onChange={handleChange}
                  className="border rounded p-2 w-full mt-1"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-2"
              >
                {isEditing ? "Update Category" : "Save Category"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white w-[400px] p-6 rounded-xl shadow-xl animate-scaleIn">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? It cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={deleteCategory}
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
          from { transform: scale(0.75); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
