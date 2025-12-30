import { CheckCircle, CreditCard, FileText, Search, Trash2, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllQuotations } from "../Component/API/quotationApi";

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
      paid: q.paid || 0,
      due: q.grandTotal - (q.paid || 0),
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

  const openQuotationPDF = (id, mode) => window.open(`http://localhost:5000/api/Quotation/print/${id}?mode=${mode}`, "_blank");

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-10 font-['Lexend'] text-slate-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 gap-4">
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
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              {["ID", "Client Details", "Date", "Status", "Amount", "Actions"].map((h) => (
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
               <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 italic"><CreditCard className="text-blue-500"/> Settlement</h3>
               <button onClick={() => setOpenPayModal(false)} className="p-2 text-slate-300 hover:text-red-500"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Grand Total</p>
                  <p className="text-lg font-black text-slate-800">₹{paymentData.grandTotal}</p>
               </div>
               <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <p className="text-[9px] font-black text-orange-400 uppercase">Due</p>
                  <p className="text-lg font-black text-orange-600">₹{paymentData.due}</p>
               </div>
            </div>
            <div className="space-y-4">
              <div><label className="modal-label">Payment Method</label>
                <select className="lux-modal-input"><option>Cash</option><option>UPI</option></select>
              </div>
              <div><label className="modal-label">Amount</label>
                <input className="lux-modal-input" type="number" placeholder="Enter amount" />
              </div>
            </div>
            <button className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100">Save Payment</button>
          </div>
        </div>
      )}

      {/* --- DC MODAL (Simplified UI) --- */}
      {openDCModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col">
            <div className="p-8 border-b flex justify-between items-center bg-orange-50/30">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-xl text-orange-500 shadow-sm"><Truck size={24}/></div>
                <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Dispatch Challan</h2>
              </div>
              <button onClick={() => setOpenDCModal(false)} className="p-2 text-slate-300 hover:text-red-500"><X size={24}/></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {["Delivery Boy", "Contact", "Vehicle No"].map(l => (
                  <div key={l}><label className="modal-label">{l}</label><input className="lux-modal-input" /></div>
                ))}
              </div>
              <div className="space-y-2">
                {dcItems.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700 w-1/3">{p.productName}</span>
                    <div className="flex gap-4">
                      <div className="text-center"><label className="text-[8px] block font-black text-slate-400">Dispatch</label><input type="number" className="w-16 p-1 rounded-lg border" /></div>
                      <div className="text-center"><label className="text-[8px] block font-black text-slate-400">Qty/Box</label><input type="number" className="w-16 p-1 rounded-lg border" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 border-t flex justify-end gap-4">
               <button onClick={() => setOpenDCModal(false)} className="px-8 font-black text-slate-400 text-[10px]">Cancel</button>
               <button className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-orange-100">Create DC</button>
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