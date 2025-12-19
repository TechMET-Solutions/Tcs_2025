import { FileDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { createDeliveryChallan, getAllQuotations } from "../Component/API/quotationApi";

export default function ManageQuotation() {
  const [quotationList, setQuotationList] = useState([]);
  const [search, setSearch] = useState("");

  // Modals
  const [openDCModal, setOpenDCModal] = useState(false);
  const [openPayModal, setOpenPayModal] = useState(false);

  // Delivery Challan Header Fields
  const [dcHeader, setDcHeader] = useState({
    deliveryBoy: "",
    contact: "",
    tempo: ""
  });

  // DC Items List
  const [dcItems, setDcItems] = useState([]);

  // Selected Quotation
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  // Payment Modal Data
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentType: "",
    remark: "",
    date: new Date().toISOString().slice(0, 10),
    grandTotal: 0,
    paid: 0,
    due: 0,
  });

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const res = await getAllQuotations();
      if (res.data.success) {
        setQuotationList(res.data.quotations);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = quotationList.filter((q) =>
    q.clientName?.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------------------------------
  // OPEN PAYMENT MODAL
  // ---------------------------------------
  const openPaymentModal = (q) => {
    setSelectedQuotation(q);
    setPaymentData({
      amount: "",
      paymentType: "",
      remark: "",
      date: new Date().toISOString().slice(0, 10),
      grandTotal: q.grandTotal,
      paid: q.paid || 0,
      due: q.grandTotal - (q.paid || 0),
    });
    setOpenPayModal(true);
  };

  // ---------------------------------------
  // OPEN DELIVERY CHALLAN MODAL
  // ---------------------------------------
 const openDeliveryChallan = (q) => {
  setSelectedQuotation(q);

  const formatted = q.items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    totalBox: item.remainingBoxes,   // ✔ फक्त remaining वापर
    currentStock: item.currentStock, // ✔ backend total batch stock
    dispatchBox: 0,                  // default
    qtyPerBox: 0,                    // default
  }));

  setDcItems(formatted);
  setOpenDCModal(true);
};


  // CHANGE DISPATCH BOXES
  const handleDispatchBoxChange = (index, value) => {
    const updated = [...dcItems];
    updated[index].dispatchBox = Number(value);
    updated[index].boxQty = Array(Number(value)).fill(1);
    setDcItems(updated);
  };

  // CHANGE QTY PER BOX
  const handleBoxQtyChange = (pIndex, boxIndex, qty) => {
    const updated = [...dcItems];
    updated[pIndex].boxQty[boxIndex] = Number(qty);
    setDcItems(updated);
  };

  // ---------------------------------------
  // GENERATE DC
  // ---------------------------------------
  // const generateDC = () => {
  //   const finalDC = {
  //     quotationId: selectedQuotation.id,
  //     client: selectedQuotation.clientName,
  //     contact: selectedQuotation.contactNo,
  //     address: selectedQuotation.address,
  //     driverDetails: dcHeader,

  //     items: dcItems.map((p) => {
  //       const totalDispatchQty = p.boxQty.reduce((sum, q) => sum + q, 0);
  //       return {
  //         productId: p.productId,
  //         productName: p.productName,
  //         dispatchBoxes: p.dispatchBox,
  //         boxQty: p.boxQty,
  //         totalDispatchQty,
  //         currentStock: p.currentStock,
  //         remainingStock: p.currentStock - totalDispatchQty,
  //       };
  //     }),
  //   };

  //   console.log("FINAL DC PAYLOAD:", finalDC);

  //   alert("Delivery Challan Generated Successfully!");
  //   setOpenDCModal(false);
  // };
const generateDC = async () => {
  const finalDC = {
    quotationId: selectedQuotation.id,
    client: selectedQuotation.clientName,
    contact: selectedQuotation.contactNo,
    address: selectedQuotation.address,
    driverDetails: dcHeader,

    items: dcItems.map((p) => {
      const totalDispatchQty = p.dispatchBox * p.qtyPerBox;

      return {
        productId: p.productId,
        productName: p.productName,
        dispatchBoxes: p.dispatchBox,
        qtyPerBox: p.qtyPerBox,
        totalDispatchQty,
      };
    }),
  };

  try {
    const res = await createDeliveryChallan(finalDC);

    if (res.data.success) {
      alert("Delivery Challan Created Successfully!");
      setOpenDCModal(false);
      fetchQuotations(); // 🔥 Refresh quotation stock
    }
  } catch (error) {
    console.log(error);
    alert("Failed to generate Delivery Challan");
  }
};
  return (
    <div className="p-6 font-['Lexend']">
      <h2 className="text-2xl font-semibold mb-5">Manage Quotation</h2>

      {/* Search */}
      <div className="flex items-center bg-white border px-3 py-2 rounded-lg shadow-sm w-80 mb-4">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          className="outline-none w-full"
          placeholder="Search quotation..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg overflow-hidden shadow border">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
            <tr>
              {["ID", "Client", "Items", "Date", "Total", "Options", "PDF"].map(
                (h) => (
                  <th key={h} className="p-3 text-center">{h}</th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {filteredData.map((q) => (
              <tr key={q.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-center">{q.id}</td>
                <td className="p-3">{q.clientName}</td>
                <td className="p-3 text-center">{q.items.length}</td>
                <td className="p-3 text-center">
                  {new Date(q.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">₹ {q.grandTotal}</td>

                <td className="p-3 text-center flex gap-2 justify-center">
                  <button className="blue-btn" onClick={() => openPaymentModal(q)}>
                    Pay
                  </button>

                  <button className="blue-btn" onClick={() => openDeliveryChallan(q)}>
                    DC
                  </button>
                </td>

                {/* PDF BUTTON */}
                <td className="p-3 text-center">
                  <button
                    className="blue-btn"
                    onClick={() =>
                      window.open(
                        `http://localhost:5000/api/Quotation/print/${q.id}`,
                        "_blank"
                      )
                    }
                  >
                    <FileDown size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------------
         PAYMENT MODAL
      ------------------------------------------------------ */}
      {openPayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[380px] rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">💰 Payment Details</h3>

            <div className="space-y-3">
              <label>Grand Total</label>
              <input className="modal-input bg-gray-100" disabled value={paymentData.grandTotal} />

              <label>Paid Amount</label>
              <input className="modal-input bg-gray-100" disabled value={paymentData.paid} />

              <label>Due Amount</label>
              <input className="modal-input bg-gray-100" disabled value={paymentData.due} />

              <label>Payment Type</label>
              <select
                className="modal-input"
                onChange={(e) =>
                  setPaymentData({ ...paymentData, paymentType: e.target.value })
                }
              >
                <option>Select Type</option>
                <option>Cash</option>
                <option>Online</option>
                <option>Cheque</option>
              </select>

              <label>Enter Amount</label>
              <input
                className="modal-input"
                type="number"
                onChange={(e) =>
                  setPaymentData({ ...paymentData, amount: e.target.value })
                }
              />

              <label>Payment Date</label>
              <input
                className="modal-input"
                type="date"
                value={paymentData.date}
                onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
              />
            </div>

            <div className="flex gap-3 justify-end mt-5">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setOpenPayModal(false)}
              >
                Close
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------
         DELIVERY CHALLAN MODAL
      ------------------------------------------------------ */}
   {openDCModal && selectedQuotation && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-[750px] max-h-[85vh] overflow-y-auto p-6 rounded-2xl shadow-xl">

      <h2 className="text-xl font-bold mb-4">🚚 Delivery Challan</h2>

      <p>Client: <b>{selectedQuotation.clientName}</b></p>

      {/* DELIVERY INFO */}
      <div className="grid grid-cols-3 gap-4 mb-4 mt-4">

        <div>
          <label>Delivery Boy Name</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={dcHeader.deliveryBoy}
            onChange={(e) =>
              setDcHeader({ ...dcHeader, deliveryBoy: e.target.value })
            }
          />
        </div>

        <div>
          <label>Contact Number</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={dcHeader.contact}
            onChange={(e) =>
              setDcHeader({ ...dcHeader, contact: e.target.value })
            }
          />
        </div>

        <div>
          <label>Tempo Number</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={dcHeader.tempo}
            onChange={(e) =>
              setDcHeader({ ...dcHeader, tempo: e.target.value })
            }
          />
        </div>

      </div>

      {/* PRODUCT WISE DISPATCH */}
      {dcItems.map((p, index) => {

        const totalDispatchQty = p.dispatchBox * p.qtyPerBox;
        const remaining = p.currentStock - totalDispatchQty;

        return (
          <div key={index} className="border p-4 rounded mt-4 bg-gray-50">

            <h3 className="font-semibold text-lg">{p.productName}</h3>

            <p>Total Remaining Boxes: <b>{p.totalBox}</b></p>
            <p>Total Stock (Batches): <b>{p.currentStock}</b></p>

            {/* Dispatch Boxes */}
           {/* Dispatch Boxes */}
<label className="text-sm mt-3 block">Dispatch Boxes</label>
<input
  type="number"
  min={0}
  max={p.totalBox}  // UI max
  value={p.dispatchBox}
  className="border p-1 w-24 rounded"
  onChange={(e) => {
    let val = Number(e.target.value);

    if (val < 1) val = 1;

    if (val > p.totalBox) {
      alert(`You cannot dispatch more than ${p.totalBox} boxes.`);
      val = p.totalBox;
    }

    const updated = [...dcItems];
    updated[index].dispatchBox = val;
    setDcItems(updated);
  }}
/>


            {/* Qty Per Box */}
            <label className="text-sm mt-3 block">Qty Per Box (pcs)</label>
            <input
              type="number"
              min={0}
              value={p.qtyPerBox}
              className="border p-1 w-32 rounded"
              onChange={(e) => {
                const updated = [...dcItems];
                updated[index].qtyPerBox = Number(e.target.value);
                setDcItems(updated);
              }}
            />

            <p className="font-semibold mt-3">
              Total Dispatch Qty: <b>{totalDispatchQty}</b> pcs
            </p>

            <p className="font-semibold text-blue-700">
              Remaining Stock After Dispatch: <b>{remaining}</b>
            </p>

          </div>
        );
      })}

      <div className="flex justify-end gap-3 mt-4">
        <button
          className="px-4 py-2 bg-gray-400 text-white rounded"
          onClick={() => setOpenDCModal(false)}
        >
          Close
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={generateDC}
        >
          Generate DC
        </button>
      </div>

    </div>
  </div>
)}



      {/* Styles */}
      <style>{`
        .blue-btn {
          background: #0ea5e9;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
        }

        .modal-input {
          width: 100%;
          border: 1px solid #ccc;
          padding: 6px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
