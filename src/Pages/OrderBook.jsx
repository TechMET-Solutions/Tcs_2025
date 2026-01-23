import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, ChevronDown, X, Edit3 } from 'lucide-react';
import axios from "axios";
import { formatIndianDate } from '../utils/formatIndianDate';
import { BASEURL } from '../Component/API/Url';
import { getProductAPI } from "../Component/API/productApi";
import DeleteModal from '../Component/DeleteModal';

const API = `${BASEURL}/api/orderBook`;

const OrderBook = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orders, setOrders] = useState([]);

    const getToday = () => new Date().toISOString().split("T")[0];


    const [form, setForm] = useState({
        name: "",
        size: "",
        quality: "",
        date: getToday(),
        quantity: "",
    });
    const [editId, setEditId] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState("");

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);




    // FETCH ALL
    const fetchOrders = async () => {
        const res = await axios.get(
            `${API}/list?page=${currentPage}&limit=${limit}`
        );

        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
    };


    useEffect(() => {
        fetchOrders();
    }, [currentPage]);


    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setForm({
            name: "",
            size: "",
            quality: "",
            date: getToday(),
            quantity: ""
        });
        setRows([{ ...emptyRow }]);
        setDropdownPos({
            top: 0,
            left: 0,
            width: 0,
            rowIndex: null,
            type: null
        });
    };



    // CREATE / UPDATE
    const handleSubmit = async () => {
        if (editId) {
            await axios.put(`${API}/update/${editId}`, form);
        } else {
            await axios.post(`${API}/create`, form);
        }

        closeModal();
        fetchOrders();
    };

    // EDIT
    const handleEdit = (item) => {
        const formattedDate = item.date
            ? new Date(item.date).toISOString().split("T")[0]
            : "";

        setEditId(item.id);

        // form state
        setForm({
            name: item.name || "",
            size: item.size || "",
            quality: item.quality || "",
            date: formattedDate,
            quantity: item.quantity || ""
        });

        // 🔥 rows state (for product input)
        setRows([
            {
                productId: item.id,
                productName: item.name,
                size: item.size,
                quality: item.quality,
                quantity: item.quantity,
                filteredProducts: []
            }
        ]);

        setIsModalOpen(true);
    };


    // DELETE
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        await axios.delete(`${API}/delete/${deleteId}`);
        setIsDeleteOpen(false);
        setDeleteId(null);
        fetchOrders();
    };


    const filteredOrders = orders.filter((order) =>
        order.name.toLowerCase().includes(search.toLowerCase())
    );


    // Product Fetching
    const [products, setProducts] = useState([]);
    const [rows, setRows] = useState([]);
    const [dropdownPos, setDropdownPos] = useState({
        top: 0,
        left: 0,
        width: 0,
        rowIndex: null,
        type: null
    });

    const emptyRow = { productId: "", size: "", quality: "", quantity: "" };

    useEffect(() => {
        getProductAPI().then((res) => {
            setProducts(res.data.products || []);
            setRows([{ ...emptyRow }]);
            
        });
    }, []);

    // --- PRODUCT LOGIC ---
    const handleProductSearch = (i, value) => {
        const updated = [...rows];
        updated[i].productName = value;
        updated[i].filteredProducts = products.filter((p) =>
            p.name.toLowerCase().includes(value.toLowerCase())
        );
        setRows(updated);
    };

    const selectProductFromSearch = (i, product) => {
        const updated = [...rows];
        updated[i] = {
            ...updated[i],
            productId: product.id,
            productName: product.name,
            size: product.size,
            quality: product.quality,
            rate: Number(product.rate),
            batches: product.batches || [],
            availQty: 0,
            qty: "",
            total: 0,
            batchNo: ""
        };
        setRows(updated);

        // 🔥 Sync with form (this fixes "Missing fields")
        setForm((prev) => ({
            ...prev,
            name: product.name,
            size: product.size,
            quality: product.quality,
        }));

        setDropdownPos({ top: 0, left: 0, width: 0, rowIndex: null, type: null });
    };




    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-600">
            {/* Top Header Section */}
            <div className="mb-10 flex flex-wrap items-center justify-between rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Order Book Management</h1>
                    <p className="text-sm text-slate-400 mt-1">Track and customer orders</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-72 rounded-xl border-none bg-slate-50 py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-[#FF9F43] px-6 py-3 font-bold text-white shadow-lg shadow-orange-200 hover:bg-[#f08e33] transition-all active:scale-95"
                    >
                        <Plus className="h-5 w-5 stroke-[3px]" />
                        Create New Order
                    </button>
                </div>
            </div>

            {/* Main Table Section */}
            <div className="w-full">
                <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                                <th className="px-8 py-6">#</th>
                                <th className="px-4 py-6">Product Name</th>
                                <th className="px-4 py-6 text-center">Size</th>
                                <th className="px-4 py-6 text-center">Quality</th>
                                <th className="px-4 py-6 text-center">Date</th>
                                <th className="px-4 py-6 text-center">Quantity</th>
                                <th className="px-8 py-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.map((order, index) => (
                                <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-400 ring-4 ring-orange-50/30">
                                            {(currentPage - 1) * limit + index + 1}
                                        </span>
                                    </td>

                                    <td className="px-4 py-5 font-semibold text-slate-700">{order.name}</td>
                                    <td className="px-4 py-5 text-center font-medium text-slate-600">{order.size}</td>
                                    <td className="px-4 py-5 text-center font-medium text-slate-600">{order.quality}</td>
                                    <td className="px-4 py-5 text-center font-medium text-slate-500">{formatIndianDate(order.date)}</td>
                                    <td className="px-4 py-5 text-center font-black text-slate-800 text-lg">
                                        {order.quantity}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-center gap-6">

                                            <button
                                                onClick={() => handleEdit(order)}
                                                className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(order.id)}
                                                className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                            Page <span className="text-slate-900">{currentPage}</span> of{" "}
                            {totalPages}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
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
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
                    <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-200">


                        {/* Form Card */}
                        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">

                                <h2 className="mb-6 text-2xl font-semibold text-slate-800">
                                    <h2>{editId ? "Update Order" : "Add Order"}</h2>
                                </h2>
                                {/* Close Button */}
                                <button
                                    onClick={closeModal}
                                    className=" text-black/80 hover:text-black transition"
                                    aria-label="Close"
                                >
                                    <X className="h-7 w-7" />
                                </button>
                            </div>

                            <form className="space-y-5 " onSubmit={(e) => e.preventDefault()}>
                                {rows.map((r, i) => (
                                    <div key={i}>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Product Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                value={r.productName || ""}
                                                placeholder="Search Product..."
                                                onChange={(e) => handleProductSearch(i, e.target.value)}
                                                onFocus={(e) => {
                                                    const rect = e.target.getBoundingClientRect();
                                                    setDropdownPos({
                                                        top: rect.bottom,
                                                        left: rect.left,
                                                        width: rect.width,
                                                        rowIndex: i,
                                                        type: "product"
                                                    });
                                                }}
                                                className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                                            />
                                        </div>
                                    </div>
                                ))}


                                {/* Size / Quality */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Size
                                        </label>
                                        <input
                                            readOnly
                                            type="text"
                                            value={form.size}
                                            onChange={(e) => setForm({ ...form, size: e.target.value })}
                                            placeholder="e.g. XL"
                                            className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Quality
                                        </label>
                                        <input
                                            readOnly
                                            type="text"
                                            value={form.quality}
                                            onChange={(e) => setForm({ ...form, quality: e.target.value })}
                                            placeholder="Standard"
                                            className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Quantity / Price */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Order Date
                                        </label>
                                        <input
                                            type="date"
                                            value={form.date}
                                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                                            className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        />

                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={form.quantity}
                                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                            className="w-full rounded-xl bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        />
                                    </div>
                                </div>

                                {/* Date */}


                                <button
                                    onClick={handleSubmit}
                                    className="mt-2 w-full rounded-2xl bg-[#FF9F43] py-3.5 font-semibold text-white shadow-lg shadow-orange-200/40 hover:bg-[#f08e33] transition active:scale-[0.98]"
                                >
                                    {editId ? "Update" : "Add"} Order
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            )}

            <DeleteModal
                isOpen={isDeleteOpen}
                title="Delete Order"
                description="Are you sure you want to delete this order? This action cannot be undone."
                onCancel={() => {
                    setIsDeleteOpen(false);
                    setDeleteId(null);
                }}
                onConfirm={confirmDelete}
            />


            {dropdownPos.type === "product" && dropdownPos.rowIndex !== null && (
                <div
                    className="fixed z-[9999] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                    style={{
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        width: dropdownPos.width
                    }}
                >
                    {rows[dropdownPos.rowIndex].filteredProducts?.length > 0 ? (
                        rows[dropdownPos.rowIndex].filteredProducts.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => selectProductFromSearch(dropdownPos.rowIndex, p)}
                                className="p-3 hover:bg-orange-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                            >
                                <p className="text-sm font-bold text-slate-700">{p.name}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                                    Size: {p.size} | Quality: {p.quality}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-xs text-slate-400 italic">
                            No matches found
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default OrderBook;


{/* Product List */ }
