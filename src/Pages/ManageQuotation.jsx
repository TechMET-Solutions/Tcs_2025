import { CheckCircle, ChevronRight, CreditCard, FileText, Trash2, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPaymentRequest } from "../Component/API/paymentApi";
import { getAllQuotations } from "../Component/API/quotationApi";
import QuotationHeader from "./QuotationHeader";
import { BASEURL } from "../Component/API/Url";

export default function ManageQuotation() {
  const [quotationList, setQuotationList] = useState([]);
  const [search, setSearch] = useState("");

  // Modals Toggle
  const [openDCModal, setOpenDCModal] = useState(false);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
const navigate = useNavigate();
  // States
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [dcHeader, setDcHeader] = useState({ deliveryBoy: "", contact: "", tempo: "" });
  const [dcItems, setDcItems] = useState([]);
  const [editData, setEditData] = useState({ id: null, clientName: "", contactNo: "", items: [] });
  const [paymentData, setPaymentData] = useState({
    amount: "", paymentType: "", remark: "",
    date: new Date().toISOString().slice(0, 10),
    grandTotal: 0, paid: 0, due: 0,
  });
// 1. Driver Details State
const [driverDetails, setDriverDetails] = useState({
    deliveryBoy: '',
    contact: '',
    tempo: ''
});

// 2. Handle Box Update for the specific product
const handleBoxUpdate = (productId, value) => {
    setDcItems(prev => prev.map(item => 
        item.productId === productId 
        ? { ...item, dispatchBoxes: value } 
        : item
    ));
};
  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const res = await getAllQuotations();
      if (res.data.success) setQuotationList(res.data.quotations);
    } catch (error) { console.log(error); }
  };

  const filteredData = quotationList.filter((q) =>
    q.clientName?.toLowerCase().includes(search.toLowerCase())
  );
const handleSubmitDC = async () => {
    // 1. Filter items where dispatchBoxes > 0
    const itemsToDispatch = dcItems
        .filter(item => item.dispatchBoxes > 0)
        .map(item => ({
            productId: item.productId,
            productName: item.productName,
            dispatchBoxes: parseInt(item.dispatchBoxes),
            // remainingStock sent to backend is: currentStock - what we are sending now
            remainingStock: item.currentStock - parseInt(item.dispatchBoxes) 
        }));

    if (itemsToDispatch.length === 0) {
        alert("Please enter boxes for at least one item.");
        return;
    }

    // 2. Construct the exact JSON structure your backend expects
    const payload = {
        quotationId: selectedQuotation.id, // Ensure this is available
        client: selectedQuotation.clientName,
        contact: selectedQuotation.contactNo,
        address: selectedQuotation.address,
        driverDetails: {
            deliveryBoy: driverDetails.deliveryBoy,
            contact: driverDetails.contact,
            tempo: driverDetails.tempo
        },
        items: itemsToDispatch
    };

    try {
        const response = await fetch(`${BASEURL}/api/Quotation/generate-dc`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.success) {
            alert("DC Created Successfully!");
            setOpenDCModal(false);
            // Refresh quotations to update the numbers on the main screen
            fetchQuotations(); 
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Submission error:", error);
    }
};
  // --- EDIT LOGIC ---
  const handleEditClick = (q) => {
    setEditData({
      id: q.id,
      clientName: q.clientName,
      contactNo: q.contactNo,
      items: q.items.map(item => ({ ...item })) // Deep copy
    });
    setOpenEditModal(true);
  };

  const updateEditItem = (index, field, value) => {
    const updated = [...editData.items];
    updated[index][field] = value;
    setEditData({ ...editData, items: updated });
  };

  const removeItemFromEdit = (index) => {
    const updated = editData.items.filter((_, i) => i !== index);
    setEditData({ ...editData, items: updated });
  };

  const saveUpdatedQuotation = async () => {
    const total = editData.items.reduce((sum, i) => sum + (i.qty * i.price), 0);
    const payload = { ...editData, grandTotal: total };
    
    try {
      // API CALL HERE: await updateQuotationApi(editData.id, payload);
      alert("Quotation Updated Successfully!");
      setOpenEditModal(false);
      fetchQuotations();
    } catch (err) { alert("Failed to update"); }
  };

  // --- DC & PAYMENT LOGIC (Existing) ---
  const openPaymentModal = (q) => {
    setSelectedQuotation(q);
    setPaymentData({
      amount: "", paymentType: "", remark: "",
      date: new Date().toISOString().slice(0, 10),
      grandTotal: q.grandTotal,
      paid: q.paid_amount || 0,
      due: q.due_amount,
    });
    setOpenPayModal(true);
  };

  const openDeliveryChallan = (q) => {
    setSelectedQuotation(q);
    setDcItems(q.items.map(i => ({
      productId: i.productId,
      productName: i.productName,
      totalBox: i.remainingBoxes || 0,
      currentStock: i.currentStock || 0,
      dispatchBox: 0,
      qtyPerBox: 0,
    })));
    setOpenDCModal(true);
  };

  const openQuotationPDF = (id, mode) => window.open(`${BASEURL}/api/Quotation/print/${id}?mode=${mode}`, "_blank");
const handleSavePaymentRequest = async () => {
    try {
        const payload = {
            quotation_id: selectedQuotation.id,
            amount: paymentData.amount,
            paymentType: paymentData.paymentType,
            remark: paymentData.remark,
            
        };
        await sendPaymentRequest(payload);
        alert("Request sent to Admin for approval");
        setOpenPayModal(false);
    } catch (err) {
        alert("Error sending request");
    }
};
  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-10 font-['Lexend'] text-slate-700">
      
      {/* HEADER */}
      {/* <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-50 rounded-2xl text-orange-500"><FileText size={28} /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight underline decoration-orange-200 underline-offset-4">Quotations</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Inventory & Sales Control</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-96 px-5 py-3 rounded-2xl border bg-slate-50 border-slate-100 focus-within:border-orange-300 focus-within:bg-white transition-all">
          <Search size={20} className="text-slate-400" />
          <input className="outline-none w-full bg-transparent font-medium text-sm" placeholder="Search client..." onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div> */}
      <QuotationHeader fetchQuotations={fetchQuotations} />

      {/* TABLE */}
      <div className="bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              {["ID", "Client Details", "Date", "Status", "Grand Total", "Paid Amount","Due Amount", "Actions"].map((h) => (
                <th key={h} className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="p-6 text-sm font-black text-slate-300">#{q.id}</td>
                <td className="p-6">
                  <p className="font-bold text-slate-800">{q.clientName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{q.items.length} Products</p>
                </td>
                <td className="p-6 text-sm font-medium text-slate-500">{new Date(q.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="p-6"><span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</span></td>
                <td className="p-6 text-base font-black text-slate-800">₹{q.grandTotal.toLocaleString()}</td>
                 <td className="p-6 text-base font-black text-slate-800">₹{q.paid_amount.toLocaleString()}</td>
                  <td className="p-6 text-base font-black text-slate-800">₹{q.due_amount.toLocaleString()}</td>
                <td className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <button 
  onClick={() => navigate("/quotation/add", { state: { editData: q } })} 
  className="action-btn text-purple-600 border-purple-100 hover:bg-purple-600"
>
  <FileText size={14} /> Edit
</button>
                    <button onClick={() => openPaymentModal(q)} className="action-btn text-blue-600 border-blue-100 hover:bg-blue-600"><CreditCard size={14} /> Pay</button>
                    <button onClick={() => openDeliveryChallan(q)} className="action-btn text-orange-600 border-orange-100 hover:bg-orange-600"><Truck size={14} /> DC</button>
                    <div className="w-[1px] bg-slate-100 mx-1"></div>
                    <button onClick={() => openQuotationPDF(q.id, "qcode")} className="print-btn">Code</button>
                    <button onClick={() => openQuotationPDF(q.id, "qname")} className="print-btn">Name</button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- EDIT MODAL --- */}
      {openEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col animate-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-purple-50/30">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-xl text-purple-600 shadow-sm"><FileText size={24}/></div>
                <h2 className="text-xl font-black text-slate-800 uppercase italic">Edit Quotation #{editData.id}</h2>
              </div>
              <button onClick={() => setOpenEditModal(false)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"><X size={24}/></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="modal-label">Client Name</label>
                  <input type="text" className="lux-modal-input" value={editData.clientName} onChange={(e) => setEditData({...editData, clientName: e.target.value})} />
                </div>
                <div><label className="modal-label">Contact</label>
                  <input type="text" className="lux-modal-input" value={editData.contactNo} onChange={(e) => setEditData({...editData, contactNo: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b">Manage Items</h4>
                <div className="grid grid-cols-1 gap-3">
                  {editData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                      <div className="flex-1 font-bold text-slate-700">{item.productName}</div>
                      <div className="w-24">
                        <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Qty</label>
                        <input type="number" className="w-full p-2 rounded-xl border border-slate-200 font-bold" value={item.qty} onChange={(e) => updateEditItem(idx, 'qty', Number(e.target.value))} />
                      </div>
                      <div className="w-32">
                        <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Price</label>
                        <input type="number" className="w-full p-2 rounded-xl border border-slate-200 font-bold" value={item.price} onChange={(e) => updateEditItem(idx, 'price', Number(e.target.value))} />
                      </div>
                      <div className="w-28 text-right pt-4 font-black text-slate-800 italic">₹{(item.qty * item.price).toLocaleString()}</div>
                      <button onClick={() => removeItemFromEdit(idx)} className="p-2 mt-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t bg-slate-50/50 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">New Grand Total</p>
                <p className="text-3xl font-black text-purple-600 italic">₹{editData.items.reduce((s, i) => s + (i.qty * i.price), 0).toLocaleString()}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setOpenEditModal(false)} className="px-8 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Discard</button>
                <button onClick={saveUpdatedQuotation} className="px-10 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-purple-100 flex items-center gap-2 hover:bg-purple-700 transition-all">
                  <CheckCircle size={18}/> Update Quotation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL (Simplified UI) --- */}
     {openPayModal && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
    <div className="bg-white p-8 w-full max-w-md rounded-[40px] shadow-2xl animate-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 italic">
          <CreditCard className="text-blue-500" /> Settlement
        </h3>
        <button onClick={() => setOpenPayModal(false)} className="p-2 text-slate-300 hover:text-red-500">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[9px] font-black text-slate-400 uppercase">Paid Amount</p>
          <p className="text-lg font-black text-slate-800">₹{paymentData.paid}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
          <p className="text-[9px] font-black text-orange-400 uppercase">Due Amount</p>
          <p className="text-lg font-black text-orange-600">₹{paymentData.due}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Payment Method Select */}
        <div>
          <label className="modal-label">Payment Method</label>
          <select 
            className="lux-modal-input"
            value={paymentData.paymentType}
            onChange={(e) => setPaymentData({ ...paymentData, paymentType: e.target.value })}
          >
            <option value="">Select Method</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="modal-label">Amount</label>
            {Number(paymentData.amount) > Number(paymentData.due) && (
              <span className="text-[10px] font-bold text-red-500 animate-pulse">
                CANNOT EXCEED DUE!
              </span>
            )}
          </div>
          <input 
            className={`lux-modal-input transition-colors ${
              Number(paymentData.amount) > Number(paymentData.due) 
              ? 'border-red-500 bg-red-50 text-red-600 focus:ring-red-200' 
              : ''
            }`} 
            type="number" 
            placeholder="Enter amount" 
            value={paymentData.amount}
            onChange={(e) => {
              const val = e.target.value;
              // Update state normally, validation is handled by the button and styling
              setPaymentData({ ...paymentData, amount: val });
            }}
          />
        </div>

        {/* Remark Input (Optional but recommended) */}
        <div>
          <label className="modal-label">Remark</label>
          <input 
            className="lux-modal-input" 
            type="text" 
            placeholder="e.g. Received by hand" 
            value={paymentData.remark}
            onChange={(e) => setPaymentData({ ...paymentData, remark: e.target.value })}
          />
        </div>
      </div>

      <button 
        className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 disabled:bg-slate-300" 
        onClick={handleSavePaymentRequest}
        disabled={!paymentData.amount || !paymentData.paymentType}
      >
        Save Payment
      </button>
    </div>
  </div>
)}

      {/* --- DC MODAL (Simplified UI) --- */}
      {openDCModal && (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col">
      
      {/* Header */}
      <div className="p-8 border-b flex justify-between items-center bg-orange-50/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl text-orange-500 shadow-sm"><Truck size={24}/></div>
          <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Dispatch Challan</h2>
        </div>
        <button onClick={() => setOpenDCModal(false)} className="p-2 text-slate-300 hover:text-red-500"><X size={24}/></button>
      </div>

      <div className="p-8 overflow-y-auto space-y-6">
        {/* Driver/Delivery Details */}
        <div className="grid grid-cols-3 gap-4">
           <div>
              <label className="modal-label">Delivery Boy</label>
              <input className="lux-modal-input" placeholder="Name" onChange={(e) => setDriverDetails({...driverDetails, deliveryBoy: e.target.value})} />
           </div>
           <div>
              <label className="modal-label">Contact</label>
              <input className="lux-modal-input" placeholder="Phone" onChange={(e) => setDriverDetails({...driverDetails, contact: e.target.value})} />
           </div>
           <div>
              <label className="modal-label">Vehicle No (Tempo)</label>
              <input className="lux-modal-input" placeholder="MH-15..." onChange={(e) => setDriverDetails({...driverDetails, tempo: e.target.value})} />
           </div>
        </div>

        {/* Item Selection - BOX ONLY */}
       <div className="space-y-3">
  <h3 className="text-[10px] font-black uppercase text-slate-400">Items for Dispatch</h3>
  {dcItems.map((p, i) => (
    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all">
      <div className="flex flex-col gap-1">
        {/* Physical Stock in Warehouse */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${p.currentStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            In Warehouse: <span className="text-slate-900">{p.currentStock} Boxes</span>
          </span>
        </div>

        <span className="font-bold text-slate-700 text-lg leading-tight">{p.productName}</span>
        
        {/* Quote Progress */}
        <div className="flex gap-2">
          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
            Pending in Quote: {p.remainingBoxes} Boxes
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <label className="text-[10px] font-black text-slate-400 uppercase mb-1">Dispatch Now</label>
        <div className="flex items-center bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
          <input 
            type="number" 
            className="w-20 text-center font-black text-slate-800 outline-none" 
            placeholder="0"
            // Ensure they don't dispatch more than what they physically have
            max={p.currentStock} 
            onChange={(e) => handleBoxUpdate(p.productId, e.target.value)}
          />
          <span className="text-[10px] ml-2 font-bold text-slate-300">BOX</span>
        </div>
      </div>
    </div>
  ))}
</div>
      </div>

      <div className="p-8 border-t flex justify-end gap-4 bg-slate-50/50">
          <button onClick={() => setOpenDCModal(false)} className="px-8 font-black text-slate-400 text-[10px] uppercase">Cancel</button>
          <button 
            onClick={handleSubmitDC}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2"
          >
            Generate Challan <ChevronRight size={14}/>
          </button>
      </div>
    </div>
  </div>
)}

      {/* STYLES */}
      <style>{`
        .action-btn { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 12px; border: 1.5px solid; font-weight: 800; font-size: 11px; text-transform: uppercase; transition: all 0.2s; }
        .action-btn:hover { color: white; transform: translateY(-2px); }
        .print-btn { padding: 6px 12px; border-radius: 10px; border: 1.5px solid #E2E8F0; color: #64748B; font-weight: 800; font-size: 10px; text-transform: uppercase; }
        .print-btn:hover { border-color: #FA9C42; color: #FA9C42; }
        .modal-label { display: block; font-size: 9px; font-weight: 900; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; margin-left: 4px; }
        .lux-modal-input { width: 100%; padding: 10px 14px; border-radius: 12px; border: 1.5px solid #F1F5F9; background: #F8FAFC; font-weight: 700; color: #334155; outline: none; }
        .lux-modal-input:focus { border-color: #9333ea; background: white; }
      `}</style>
    </div>
  );
}