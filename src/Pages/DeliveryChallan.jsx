import axios from "axios";
import {
  Activity,
  ClipboardList,
  Printer,
  Search,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getAllDeliveryChallan } from "../Component/API/quotationApi";
import {
  addTracking,
  deleteTracking,
  getTrackingByChallan,
} from "../Component/API/trackingApi";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";

const API_URL = `${BASEURL}/api/Quotation`;

export default function DeliveryChallan() {
  const [challanList, setChallanList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState(""); // Stores search when button is clicked
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Tracking Modal States
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingChallanId, setTrackingChallanId] = useState(null);
  const [trackingDate, setTrackingDate] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("");
  const [trackingList, setTrackingList] = useState([]);

  const [loadingTracking, setLoadingTracking] = useState(false);

  const { permissions, role } = useAuth();

  // Optimized Fetch Function
  const fetchChallans = useCallback(async (page, search) => {
    setLoading(true);
    try {
      // API call should accept (page, limit, search)
      const res = await getAllDeliveryChallan(page, 10, search);
      if (res.data.success) {
        setChallanList(res.data.challans);
        setTotalPages(res.data.pagination.totalPages);
        setCurrentPage(res.data.pagination.currentPage);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch when page changes or search is triggered
  useEffect(() => {
    fetchChallans(currentPage, activeSearch);
  }, [currentPage, activeSearch, fetchChallans]);

  const handleSearchTrigger = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    setActiveSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  const handleDeleteItem = async (challanId) => {
    if (!window.confirm("Delete this delivery challan?")) return;
    try {
      await axios.delete(`${API_URL}/delivery-challan/delete/${challanId}`);
      setChallanList((prev) => prev.filter((item) => item.id !== challanId));
    } catch (error) {
      alert("Failed to delete delivery challan");
    }
  };

  const printChallan = (id) =>
    window.open(
      `${BASEURL}/api/Quotation/delivery-challan/print/${id}`,
      "_blank",
    );
  const printChallan2 = (id) =>
    window.open(
      `${BASEURL}/api/Quotation/delivery-challan/printreturn/${id}`,
      "_blank",
    );

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-6 md:p-12 font-['Lexend'] text-slate-800">
      {/* HEADER & SEARCH SECTION */}
      <div className="max-w-[1500px] mx-auto mb-10 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Activity size={12} /> Logistics Hub
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Delivery{" "}
            <span className="text-orange-500 underline underline-offset-8">
              Challans
            </span>
          </h1>
        </div>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSearchTrigger}
          className="flex w-full max-w-lg gap-2"
        >
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by ID, Client, or Quote ID..."
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-orange-500 transition-all active:scale-95"
          >
            Search
          </button>
        </form>

        <div className="bg-gray-100 px-4 py-2 rounded-2xl flex items-center gap-4 border border-slate-200">
          <div className="p-2 bg-slate-900 rounded-xl text-white">
            <ClipboardList size={20} />
          </div>
          <div>
            <span className="block text-lg font-black text-slate-900">
              {challanList.length}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Showing results
            </span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w-[1500px] mx-auto bg-white shadow-xl shadow-slate-200 rounded-[24px] overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-widest font-black text-slate-400">
                <th className="px-8 py-6">ID / Date</th>
                <th className="px-8 py-6">Quote ID</th>
                <th className="px-8 py-6">Party Name</th>
                <th className="px-6 py-6 text-center">Tracking</th>
                <th className="px-6 py-6 text-center">Manage</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-20 font-bold text-slate-400 animate-pulse"
                  >
                    Loading Data...
                  </td>
                </tr>
              ) : challanList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-40">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Truck size={64} />
                      <span className="text-2xl font-black italic">
                        No Records Found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                challanList.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-8 py-5 font-black text-slate-900">
                      CH-{item.id}
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-600">
                      {item.quotationId}
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-800">
                      {item.client}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={async () => {
                          setTrackingChallanId(item.id);
                          setShowTrackingModal(true);
                          setLoadingTracking(true);

                          const res = await getTrackingByChallan(item.id);
                          setTrackingList(res.data || []);

                          setLoadingTracking(false);
                        }}
                        className="px-3 py-1 border rounded-full text-xs"
                      >
                        Update Timeline
                      </button>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => printChallan(item.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase hover:bg-orange-500 transition-all"
                        >
                          <Printer size={14} /> DC
                        </button>
                        <button
                          onClick={() => printChallan2(item.id)}
                          className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs font-bold text-slate-400 uppercase">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? "bg-orange-500 text-white shadow-lg shadow-orange-100" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg relative">
            <button
              onClick={() => setShowTrackingModal(false)}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">Update Tracking</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!trackingDate || !trackingStatus) {
                  alert("Please select date & status");
                  return;
                }

                await addTracking({
                  challanId: trackingChallanId,
                  trackedAt: trackingDate,
                  status: trackingStatus,
                });

                const res = await getTrackingByChallan(trackingChallanId);
                setTrackingList(res.data || []);
                setTrackingDate("");
                setTrackingStatus("");
              }}
              className="flex gap-2 mb-4"
            >
              <input
                type="date"
                value={trackingDate}
                onChange={(e) => setTrackingDate(e.target.value)}
                className="border p-2 rounded flex-1"
              />

              <select
                value={trackingStatus}
                onChange={(e) => setTrackingStatus(e.target.value)}
                className="border p-2 rounded flex-1"
              >
                <option value="">~ SELECT ~</option>
                <option value="Preparing For Dispatch">
                  Preparing For Dispatch
                </option>
                <option value="Dispatched">Dispatched</option>
                <option value="On The Way">On The Way</option>
                <option value="Delivered">Delivered</option>
              </select>

              <button className="bg-orange-500 text-white px-4 rounded">
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {trackingList.length === 0 ? (
                <p className="text-center text-gray-400">No Tracking Found</p>
              ) : (
                trackingList.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between border p-2 rounded"
                  >
                    <div>
                      <p className="font-bold">{t.status}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(t.tracked_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        await deleteTracking(t.id);
                        const res =
                          await getTrackingByChallan(trackingChallanId);
                        setTrackingList(res.data.data || []);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
