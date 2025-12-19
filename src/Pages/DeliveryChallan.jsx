import {
  ClipboardList,
  Printer
} from "lucide-react";

import { useEffect, useState } from "react";
import {
  getAllDeliveryChallan
} from "../Component/API/quotationApi";

export default function DeliveryChallan() {
  const [challanList, setChallanList] = useState([]);
  const [printData, setPrintData] = useState(null);

  // ---------------- TC MODAL STATES ----------------
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingChallanId, setTrackingChallanId] = useState(null);

  const [trackingDate, setTrackingDate] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("");

  const [trackingList] = useState([
    { id: 1, date: "2025-01-01 10:00 AM", status: "Preparing For Dispatch" },
    { id: 2, date: "2025-01-02 12:00 PM", status: "Dispatched" }
  ]);

  // --------------------------------------------------

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      const res = await getAllDeliveryChallan();
      if (res.data.success) {
        setChallanList(res.data.challans);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // PRINT
  // const printChallan = (item) => {
  //   setPrintData(item);
  //   setTimeout(() => window.print(), 300);
  // };

  // DELETE
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure to delete this challan?")) return;

  //   try {
  //     const res = await deleteChallanById(id);
  //     if (res.data.success) {
  //       fetchChallans();
  //       alert("Challan Deleted Successfully");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // DC PAGE OPEN
 const openDC = (id) => {
  window.open(`http://localhost:5000/api/Quotation/delivery-challan/print/${id}`, "_blank");
};

const printChallan = (id) => {
  window.open(`http://localhost:5000/api/Quotation/delivery-challan/print/${id}`, "_blank");
};

  // ---------------- TC MODAL OPEN FUNCTION ----------------
  const openTrackingModal = (id) => {
    setTrackingChallanId(id);
    setShowTrackingModal(true);
  };
  // --------------------------------------------------------

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <ClipboardList size={26} /> Delivery Challan
        </h2>
      </div>

      {/* TABLE */}
      <table className="w-full rounded-xl overflow-hidden shadow">
        <thead>
          <tr className="bg-gradient-to-r from-purple-100 to-blue-100 text-gray-700">
            <th className="p-3">Challan No</th>
            <th className="p-3">Quotation</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Driver</th>
            <th className="p-3">Tempo</th>
            <th className="p-3">Created</th>
            <th className="p-3">Print</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {challanList.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-6 text-gray-500 italic">
                No delivery challan found.
              </td>
            </tr>
          ) : (
            challanList.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">CH-{item.id}</td>
                <td className="p-3">{item.quotationId}</td>
                <td className="p-3">{item.client}</td>
                <td className="p-3">{item.deliveryBoy}</td>
                <td className="p-3">{item.tempo}</td>
                <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>

                {/* PRINT */}
                <td className="p-3">
                  <td className="p-3">
  <button
    onClick={() => printChallan(item.id)}
    className="bg-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-900 flex items-center gap-1"
  >
    <Printer size={16} /> Print
  </button>
</td>

                </td>

                {/* ACTION */}
                <td className="p-3">
                  <div className="flex gap-3 text-sm">

                    {/* TC BUTTON */}
                    <button
                      onClick={() => openTrackingModal(item.id)}
                      className="text-purple-600 font-semibold hover:underline"
                    >
                      TC
                    </button>

                    <button
                      onClick={() => openDC(item.id)}
                      className="text-green-600 hover:underline"
                    >
                      DC
                    </button>

                    <button
                      // onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ------------------- TC MODAL UI ------------------- */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[550px] rounded-xl p-6 shadow-2xl">

            <h2 className="text-xl font-bold text-center mb-4">
              Tracking Details – Challan #{trackingChallanId}
            </h2>

            {/* DATE */}
            <label className="block font-medium">Date & Time</label>
            <input
              type="datetime-local"
              value={trackingDate}
              onChange={(e) => setTrackingDate(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            {/* STATUS */}
            <label className="block font-medium">Status</label>
            <select
              value={trackingStatus}
              onChange={(e) => setTrackingStatus(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            >
              <option>~~SELECT~~</option>
              <option>Preparing For Dispatch</option>
              <option>Dispatched</option>
              <option>On The Way</option>
              <option>Deliver</option>
            </select>

            {/* TABLE */}
            <table className="w-full text-sm border mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Id</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {trackingList.map((t) => (
                  <tr key={t.id}>
                    <td className="border p-2">{t.id}</td>
                    <td className="border p-2">{t.date}</td>
                    <td className="border p-2">{t.status}</td>
                    <td className="border p-2 text-red-600 cursor-pointer">
                      Delete
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Close
              </button>

              <button
                onClick={() => alert("Saving soon")}
                className="px-4 py-2 bg-purple-700 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ------------------- END MODAL ------------------- */}

    </div>
  );
}
