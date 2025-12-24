import { Edit3, Eye, Search, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPurchaseListAPI,
} from "../Component/API/inventoryApi";

export default function ManageInventory() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [purchases, setPurchases] = useState([]);
  const [query, setQuery] = useState("");

  // ✅ VIEW MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // ✅ SAFE FETCH
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const res = await getPurchaseListAPI();
        setPurchases(res.data.purchases || []);
      } catch (err) {
        console.log("Fetch Error:", err);
      }
    };

    fetchData();
  }, []);

  const editItem = (id) => {
    navigate("/inventory/add", { state: { editId: id } });
  };

  // ✅ VIEW DETAILS
  const viewItem = (purchase) => {
    setSelectedPurchase(purchase);
    setShowModal(true);
  };

  // ✅ SEARCH FILTER
  const filtered = purchases.filter((p) => {
    if (!query) return true;
    const q = query.toLowerCase();

    return (
      p.bill_no?.toString().toLowerCase().includes(q) ||
      p.client_name?.toLowerCase().includes(q) ||
      p.purchase_date?.toLowerCase().includes(q)
    );
  });
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  return (
    <div className="p-6 font-['Lexend']">
      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border shadow-lg">

        {/* ✅ SEARCH + REFRESH */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 w-72 px-4 py-2 rounded-xl border bg-gray-50 shadow-sm">
            <Search size={18} className="text-gray-500" />
            <input
              placeholder="Search by Bill, Client or Date"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-700"
            />
          </div>

          <button
            onClick={async () => {
              const res = await getPurchaseListAPI();
              setPurchases(res.data.purchases || []);
            }}
            className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        {/* ✅ TABLE */}
        <div className="overflow-x-auto rounded-xl shadow-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-purple-100 to-blue-100 text-gray-700">
                <th className="p-3">ID</th>
                <th className="p-3">Purchase Date</th>
                <th className="p-3">Bill No</th>
                <th className="p-3">Client Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Sub Total</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                    No purchases found
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="p-3">{p.id}</td>
                    <td className="p-3"><td className="p-3">
  {formatDate(p.purchase_date)}
</td>
</td>
                    <td className="p-3 font-semibold">{p.bill_no}</td>
                    <td className="p-3">{p.client_name}</td>
                    <td className="p-3">{p.client_contact}</td>
                    <td className="p-3 font-semibold text-green-600">
                      ₹ {p.subtotal}
                    </td>

                    <td className="p-3 flex justify-center gap-3">

                      {/* ✅ VIEW */}
                      <button
                        onClick={() => viewItem(p)}
                        className="px-3 py-1 rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 shadow flex items-center gap-1"
                      >
                        <Eye size={16} /> View
                      </button>

                      {/* ✅ EDIT */}
                      <button
                        onClick={() => editItem(p.id)}
                        className="px-3 py-1 rounded-lg text-white bg-blue-500 hover:bg-blue-600 shadow flex items-center gap-1"
                      >
                        <Edit3 size={16} /> Edit
                      </button>

                      {/* ✅ DELETE (UI only) */}
                      <button
                        className="px-3 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600 shadow flex items-center gap-1"
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
      </div>

      {/* ✅ VIEW MODAL */}
     {/* ✅ VIEW MODAL */}
{showModal && selectedPurchase && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 relative">

      {/* CLOSE */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-600 hover:text-black"
      >
        <X />
      </button>

      <h2 className="text-xl font-bold mb-4 text-center">
        Purchase Details
      </h2>

      {/* ✅ PURCHASE INFO */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <p><b>Bill No:</b> {selectedPurchase.bill_no}</p>
        <p><b>Date:</b> {new Date(selectedPurchase.purchase_date).toLocaleDateString()}</p>
        <p><b>Client:</b> {selectedPurchase.client_name}</p>
        <p><b>Contact:</b> {selectedPurchase.client_contact}</p>
        <p className="col-span-2 text-green-600 font-bold">
          <b>Sub Total:</b> ₹ {selectedPurchase.subtotal}
        </p>
      </div>

      {/* ✅ ITEM LIST */}
      <h3 className="font-semibold mb-2">Item Details</h3>

      {selectedPurchase.items && selectedPurchase.items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Product ID</th>
                <th className="p-2">Batch</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Rate</th>
                <th className="p-2">COV</th>
                <th className="p-2">Total</th>
                <th className="p-2">Godown</th>
              </tr>
            </thead>

            <tbody>
              {selectedPurchase.items.map((item, idx) => (
                <tr key={item.id} className="border-b text-center">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{item.product_id}</td>
                  <td className="p-2">{item.batch_no}</td>
                  <td className="p-2">{item.qty}</td>
                  <td className="p-2">₹ {item.rate}</td>
                  <td className="p-2">{item.cov}</td>
                  <td className="p-2 font-semibold">₹ {item.total}</td>
                  <td className="p-2">{item.godown}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 italic mt-4">
          No items found for this purchase.
        </div>
      )}

    </div>
  </div>
)}

    </div>
  );
}
