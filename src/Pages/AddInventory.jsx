import { Calendar, CheckCircle2, Info, Phone, Plus, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addPurchaseAPI } from "../Component/API/inventoryApi";
import { getProductAPI } from "../Component/API/productApi";

export default function AddInventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
const [suggestions, setSuggestions] = useState([]);
const [isOpen, setIsOpen] = useState(false);
  // 1. Extract the passed data
  const editData = location.state?.data; 
  const isEditMode = !!editData;

  console.log(editData,isEditMode,"data")
  // Brand Colors from your screenshots
  const BRAND_ORANGE = "#FF7A00";
  const SIDEBAR_DARK = "#1E1E1E";

  const [purchaseMeta, setPurchaseMeta] = useState({
    purchaseDate: new Date().toISOString().slice(0, 10),
    clientName: "",
    clientContact: "",
    billNo: "",
  });

  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    rowIndex: null,
    type: null, // "product" or "batch"
  });

  const emptyRow = {
    productId: "", productName: "", size: "", quality: "", rate: "",
    cov: 1, batches: [], batchNo: "", availQty: 0, qty: "", total: 0,
    godown: "KKW", filteredProducts: [],
  };
  useEffect(() => {
  if (isEditMode && editData && products.length > 0) {
    // 1. Populate Metadata (Matching your JSON keys)
    setPurchaseMeta({
      purchaseDate: editData.purchase_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      clientName: editData.client_name || "",
      clientContact: editData.client_contact || "",
      billNo: editData.bill_no || "",
    });

    // 2. Populate Rows
    if (editData.items && editData.items.length > 0) {
      const mappedRows = editData.items.map(item => {
        // Find the product details from the 'products' state using the product_id
        const productInfo = products.find(p => p.id === item.product_id) || {};

        return {
          productId: item.product_id, // Match JSON key: product_id
          productName: productInfo.name || "Unknown Product",
          size: productInfo.size || "",
          quality: productInfo.quality || "",
          rate: item.rate,
          cov: item.cov || 1,
          batchNo: item.batch_no || "", // Match JSON key: batch_no
          availQty: 0, // Will be updated if user selects batch
          qty: item.qty,
          total: Number(item.total),
          godown: item.godown || "KKW",
          batches: productInfo.batches || [], // Fill batches from master product list
          filteredProducts: []
        };
      });
      setRows(mappedRows);
    }
  }
}, [isEditMode, editData, products]); // Added products to dependency to ensure info is available
  useEffect(() => {
    getProductAPI().then((res) => {
      setProducts(res.data.products || []);
      setRows([{ ...emptyRow }]);
    });
  }, []);
useEffect(() => {
  const fetchSuppliers = async () => {
    if (searchTerm.length < 2) { // Only search after 2 characters
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/suppliers/list?search=${searchTerm}`);
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suppliers);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const delayDebounceFn = setTimeout(() => {
    fetchSuppliers();
  }, 300); // Debounce to prevent too many API calls

  return () => clearTimeout(delayDebounceFn);
}, [searchTerm]);
  // Global click listener to close dropdowns
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!e.target.closest(".tableInput") && !e.target.closest(".dropdown-panel")) {
        setDropdownPos({ top: 0, left: 0, width: 0, rowIndex: null, type: null });
      }
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  useEffect(() => {
    setSubTotal(rows.reduce((sum, r) => sum + Number(r.total || 0), 0));
  }, [rows]);

  const handleMetaChange = (e) => setPurchaseMeta({ ...purchaseMeta, [e.target.name]: e.target.value });

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
      productId: product.id, productName: product.name, size: product.size,
      quality: product.quality, rate: Number(product.rate), 
      batches: product.batches || [],
      availQty: 0, qty: "", total: 0, batchNo: ""
    };
    setRows(updated);
    setDropdownPos({ top: 0, left: 0, width: 0, rowIndex: null, type: null });
  };

  // --- BATCH LOGIC ---
  const handleBatchInput = (i, value) => {
    const updated = [...rows];
    updated[i].batchNo = value;
    const existing = updated[i].batches.find(b => b.batch_no.toLowerCase() === value.toLowerCase());
    updated[i].availQty = existing ? existing.qty : 0;
    setRows(updated);
  };

  const selectBatch = (i, batchObj) => {
    const updated = [...rows];
    updated[i].batchNo = batchObj.batch_no;
    updated[i].availQty = batchObj.qty;
    setRows(updated);
    setDropdownPos({ top: 0, left: 0, width: 0, rowIndex: null, type: null });
  };

  const updateRowField = (i, field, value) => {
    const updated = [...rows];
    updated[i][field] = value;
    updated[i].total = Number(updated[i].qty || 0) * Number(updated[i].rate || 0) * Number(updated[i].cov || 1);
    setRows(updated);
  };

  const addRow = () => setRows([...rows, { ...emptyRow }]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const savePurchase = async (e) => {
    e.preventDefault();
    if(!purchaseMeta.clientName || !purchaseMeta.billNo) return alert("Fill Bill No and Supplier Name");
    try {
        await addPurchaseAPI({ ...purchaseMeta, items: rows, subTotal });
        alert("Saved Successfully");
        navigate("/inventory/manage");
    } catch (err) { alert("Error saving purchase"); }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8 font-['Lexend'] text-slate-800">
      <form onSubmit={savePurchase} className="max-w-[1600px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: SIDEBAR_DARK }}>Stock Inward</h1>
            <p className="text-slate-500 font-medium mt-1">Record new arrivals into the inventory ledger</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white px-8 py-3 rounded-[20px] shadow-sm border border-slate-100 text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</p>
              <p className="text-2xl font-black" style={{ color: BRAND_ORANGE }}>₹ {subTotal.toLocaleString()}</p>
            </div>
            <button type="submit" className="text-white px-10 py-4 rounded-[20px] font-black transition-all shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95" style={{ backgroundColor: BRAND_ORANGE }}>
              <CheckCircle2 size={22}/> SAVE INVOICE
            </button>
          </div>
        </div>

        {/* METADATA SECTION */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 mb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Calendar size={14} style={{ color: BRAND_ORANGE }}/> Date
            </label>
            <input name="purchaseDate" type="date" value={purchaseMeta.purchaseDate} onChange={handleMetaChange} className="metaInput"/>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Info size={14} style={{ color: BRAND_ORANGE }}/> Bill Number
            </label>
            <input name="billNo" placeholder="Ex: BILL-101" value={purchaseMeta.billNo} onChange={handleMetaChange} className="metaInput"/>
          </div>
          <div className="space-y-2 relative"> {/* Added relative for dropdown positioning */}
  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
    <User size={14} style={{ color: BRAND_ORANGE }}/> Supplier
  </label>
  
  <input 
    name="clientName" 
    placeholder="Enter Supplier" 
    value={searchTerm} // Controlled by searchTerm state
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setIsOpen(true);
    }}
    onFocus={() => setIsOpen(true)}
    className="metaInput w-full"
    autoComplete="off"
  />

  {/* Dropdown Menu */}
  {isOpen && suggestions.length > 0 && (
    <div className="absolute z-10 w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
      {suggestions.map((supplier) => (
        <div
          key={supplier.id}
          className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm"
         onClick={() => {
  // 1. Update the parent state with both Name and Contact
  setPurchaseMeta(prev => ({
    ...prev,
    clientName: supplier.name,
    clientContact: supplier.mobile // Storing the mobile number here
  }));

  // 2. Update the local input field display
  setSearchTerm(supplier.name);

  // 3. Close the dropdown
  setIsOpen(false);
}}
        >
          <div className="font-medium">{supplier.name}</div>
          <div className="text-xs text-slate-500">{supplier.mobile}</div>
        </div>
      ))}
    </div>
  )}
</div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Phone size={14} style={{ color: BRAND_ORANGE }}/> Contact
            </label>
            <input name="clientContact" placeholder="Mobile / Ref" value={purchaseMeta.clientContact} onChange={handleMetaChange} className="metaInput"/>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {["Product Description", "Size", "Quality", "Rate", "Cov", "Batch Selection", "Stock", "Qty", "Amount", "Godown", ""].map((h) => (
                    <th key={h} className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((r, i) => (
                  <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="p-3 w-72">
                      <input value={r.productName} placeholder="Search Product..." 
                        onChange={(e) => handleProductSearch(i, e.target.value)}
                        onFocus={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setDropdownPos({ top: rect.bottom, left: rect.left, width: rect.width, rowIndex: i, type: "product" });
                        }}
                        className="tableInput font-bold text-[#1E1E1E]"/>
                    </td>

                    <td className="p-3"><input value={r.size} onChange={(e) => updateRowField(i, "size", e.target.value)} className="tableInput w-20" /></td>
                    <td className="p-3"><input value={r.quality} onChange={(e) => updateRowField(i, "quality", e.target.value)} className="tableInput w-24" /></td>
                    <td className="p-3"><input value={r.rate} onChange={(e) => updateRowField(i, "rate", e.target.value)} className="tableInput w-24 font-black text-orange-600" /></td>
                    <td className="p-3"><input value={r.cov} onChange={(e) => updateRowField(i, "cov", e.target.value)} className="tableInput w-16" /></td>
                    
                    <td className="p-3 w-48">
                        <input value={r.batchNo} placeholder="Select or New..."
                          onChange={(e) => handleBatchInput(i, e.target.value)}
                          onFocus={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setDropdownPos({ top: rect.bottom, left: rect.left, width: rect.width, rowIndex: i, type: "batch" });
                          }}
                          className="tableInput font-bold bg-blue-50/30 border-blue-100" />
                    </td>

                    <td className="p-3"><input readOnly value={r.availQty} className="tableInput w-20 bg-slate-50 text-slate-400 cursor-not-allowed font-bold" /></td>
                    <td className="p-3"><input value={r.qty} onChange={(e) => updateRowField(i, "qty", e.target.value)} className="tableInput w-24 font-black bg-yellow-50 border-yellow-200 focus:border-yellow-500" /></td>
                    <td className="p-3 font-black text-slate-800 text-sm whitespace-nowrap">₹{r.total.toLocaleString()}</td>
                    
                    <td className="p-3">
                      <select value={r.godown} onChange={(e) => updateRowField(i, "godown", e.target.value)} className="tableInput w-24 appearance-none font-bold bg-white">
                        <option>KKW</option><option>MN</option><option>TCS</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button type="button" onClick={() => removeRow(i)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <button type="button" onClick={addRow} className="flex items-center gap-2 text-[#FF7A00] font-black text-xs uppercase tracking-widest bg-white px-6 py-3 rounded-2xl border border-slate-200 hover:border-orange-200 transition-all shadow-sm">
              <Plus size={18} /> Add Product Row
            </button>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <Info size={14} style={{ color: BRAND_ORANGE }}/> Calculations update automatically
            </div>
          </div>
        </div>

        {/* ✅ FIXED POSITION DROPDOWN (Solves clipping issue) */}
        {dropdownPos.rowIndex !== null && (
          <div 
            className="fixed z-[9999] bg-white border border-slate-200 rounded-xl shadow-2xl mt-1 overflow-auto dropdown-panel animate-in fade-in slide-in-from-top-1 duration-150"
            style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, maxHeight: '250px' }}
          >
            {/* Product List */}
            {dropdownPos.type === "product" && (
                rows[dropdownPos.rowIndex].filteredProducts.length > 0 ? (
                    rows[dropdownPos.rowIndex].filteredProducts.map(p => (
                        <div key={p.id} onClick={() => selectProductFromSearch(dropdownPos.rowIndex, p)} className="p-3 hover:bg-orange-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                            <p className="text-sm font-bold text-slate-700">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Size: {p.size} | Quality: {p.quality}</p>
                        </div>
                    ))
                ) : <div className="p-4 text-center text-xs text-slate-400 italic">No matches found</div>
            )}

            {/* Batch List */}
            {dropdownPos.type === "batch" && (
                <>
                  <div className="p-2 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">Select Existing Batch</div>
                  {rows[dropdownPos.rowIndex].batches
                    .filter(b => b.batch_no.toLowerCase().includes(rows[dropdownPos.rowIndex].batchNo.toLowerCase()))
                    .map((b, idx) => (
                      <div key={idx} onClick={() => selectBatch(dropdownPos.rowIndex, b)} className="p-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center border-b border-slate-50 transition-colors">
                        <span className="text-sm font-bold text-slate-700">{b.batch_no}</span>
                        <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded">Stock: {b.qty}</span>
                      </div>
                  ))}
                  {rows[dropdownPos.rowIndex].batchNo && (
                    <div onClick={() => setDropdownPos({ top: 0, left: 0, width: 0, rowIndex: null, type: null })}
                      className="p-3 hover:bg-green-50 cursor-pointer text-green-600 font-bold text-xs flex items-center gap-2 border-t border-slate-100">
                      <Plus size={14}/> Create New Batch: "{rows[dropdownPos.rowIndex].batchNo}"
                    </div>
                  )}
                </>
            )}
          </div>
        )}
      </form>

      <style>{`
        .metaInput {
          width: 100%; padding: 14px; background: #F8FAFC; border: 1px solid #E2E8F0;
          border-radius: 16px; outline: none; transition: all 0.2s; font-weight: 600; color: #1E1E1E;
        }
        .metaInput:focus { border-color: #FF7A00; box-shadow: 0 0 0 4px rgba(255, 122, 0, 0.1); background: white; }
        
        .tableInput {
          padding: 10px 14px; font-size: 13px; border: 1px solid #E2E8F0;
          border-radius: 12px; outline: none; transition: all 0.2s;
        }
        .tableInput:focus { border-color: #FF7A00; box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.05); }
      `}</style>
    </div>
  );
}