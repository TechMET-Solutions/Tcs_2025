import axios from "axios";
import { AlertCircle, CheckCircle, Edit, Plus, Trash2, X, User, Tags } from "lucide-react";
import { useEffect, useState } from "react";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";

const BASE_URL = `${BASEURL}/api/suppliers`;

export default function Supplier() {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [supplierList, setSupplierList] = useState([]);
    const [supplier, setSupplier] = useState({
        name: "",
        mobile: "",
    });

    const { permissions, role } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    /* ---------------- FETCH SUPPLIERS ---------------- */
    const fetchSuppliers = async (page = 1) => {
        try {
            const res = await axios.get(
                `${BASE_URL}/list?page=${page}&limit=${limit}`
            );
            if (res.data.success) {
                setSupplierList(res.data.suppliers || []);
                setTotalPages(res.data.pagination.totalPages);
                setCurrentPage(res.data.pagination.currentPage);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => {
        fetchSuppliers(currentPage);
    }, [currentPage]);

    /* ---------------- HANDLERS ---------------- */
    const handleChange = (e) =>
        setSupplier({ ...supplier, [e.target.name]: e.target.value });

    const saveSupplier = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${BASE_URL}/update/${currentId}`, supplier);
            } else {
                await axios.post(`${BASE_URL}/create`, supplier);
            }
            setShowModal(false);
            setSupplier({ name: "", mobile: "" });
            fetchSuppliers();
        } catch (err) {
            console.error("Save Error:", err);
        }
    };

    const editSupplier = (item) => {
        setSupplier({
            name: item.name,
            mobile: item.mobile,
        });
        setCurrentId(item.id);
        setIsEditing(true);
        setShowModal(true);
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-['Lexend'] text-slate-800">

            {/* HEADER */}
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase">Supplier Registry</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Manage and track registered suppliers.
                    </p>
                </div>

                {(role === "admin" ||
                    role === "superadmin" ||
                    permissions?.["Supplier_Add"]) && (
                        <button
                            onClick={() => {
                                setShowModal(true);
                                setIsEditing(false);
                                setSupplier({ name: "", mobile: "" });
                            }}
                            className="flex items-center gap-2 bg-[#FA9C42] text-white px-8 py-4 rounded-2xl shadow-xl hover:bg-orange-600 transition-all"
                        >
                            <Plus size={22} />
                            <span className="font-bold text-lg">Add Supplier</span>
                        </button>
                    )}
            </div>

            {/* TABLE */}
            <div className="max-w-[1400px] mx-auto bg-white rounded-[32px] shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b text-center">
                            <th className="px-10 py-7 text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Index</th>
                                <th className="px-10 py-7 text-left text-xs font-black uppercase tracking-widest text-slate-400">
                                    Supplier
                                </th>
                                <th className="px-10 py-7 text-xs font-black uppercase tracking-widest text-slate-400">
                                    Mobile No
                                </th>
                                <th className="px-10 py-7 text-xs font-black uppercase tracking-widest text-slate-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {supplierList.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-24 text-center text-slate-400">
                                        No suppliers found.
                                    </td>
                                </tr>
                            ) : (
                                supplierList.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-10 py-6 text-slate-400 font-mono text-sm">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FA9C42]">
                                                   <Tags size={22} />
                                                </div>
                                                <span className="font-black text-lg">{item.name}</span>
                                            </div>
                                        </td>

                                        <td className="px-10 py-6 text-center font-bold">
                                            {item.mobile}
                                        </td>

                                        <td className="px-10 py-6">
                                            <div className="flex justify-end gap-4">
                                                <button
                                                    onClick={() => editSupplier(item)}
                                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#FA9C42] hover:border-[#FA9C42] hover:shadow-md transition-all active:scale-95"
                                                >
                                                    <Edit size={18} />
                                                    <span className="font-bold text-sm">Modify</span>
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setCurrentId(item.id);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 hover:shadow-md transition-all active:scale-95"
                                                >
                                                    <Trash2 size={18} />
                                                    <span className="font-bold text-sm">Remove</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            Page <span className="text-slate-900">{currentPage}</span> of {totalPages}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>

                            <div className="flex gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-11 h-11 rounded-xl text-sm font-black transition-all ${currentPage === i + 1
                                            ? "bg-[#FA9C42] text-white shadow-lg shadow-orange-200"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ADD / EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-10">
                        <div className="flex justify-between mb-6">
                            <h2 className="text-2xl font-black">
                                {isEditing ? "Edit Supplier" : "Add Supplier"}
                            </h2>
                            <button onClick={() => setShowModal(false)}>
                                <X />
                            </button>
                        </div>

                        <form onSubmit={saveSupplier} className="space-y-6">
                            <input
                                name="name"
                                value={supplier.name}
                                onChange={handleChange}
                                placeholder="Supplier Name"
                                required
                                className="w-full px-6 py-4 rounded-xl border font-bold"
                            />

                            <input
                                type="number"
                                name="mobile"
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // typing ke time max 10 digits
                                    if (value.length <= 10) {
                                        handleChange(e);
                                    }
                                }}
                                onWheel={(e) => e.target.blur()}
                                value={supplier.mobile}
                                placeholder="Mobile Number"
                                required
                                maxLength={10}
                                className="w-full px-6 py-4 rounded-xl border font-bold"
                            />

                            <button
                                type="submit"
                                className="w-full py-4 bg-[#FA9C42] text-white font-black rounded-xl"
                            >
                                {isEditing ? "Update Supplier" : "Save Supplier"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-10 rounded-3xl text-center max-w-md">
                        <h2 className="text-2xl font-black mb-4">Delete Supplier?</h2>
                        <p className="text-slate-500 mb-8">
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 border rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await axios.delete(`${BASE_URL}/delete/${currentId}`);
                                    setShowDeleteModal(false);
                                    fetchSuppliers();
                                }}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl"
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
