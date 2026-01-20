import axios from "axios";
import JoditEditor from "jodit-react";
import { ArrowLeft, Calculator, FileText, Info, Percent, Save, Trash2, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASEURL } from "../Component/API/Url";

export default function AddQuotation() {
  const navigate = useNavigate();
  const location = useLocation();
  const editor = useRef(null);

  // 1. Extract the data safely from navigation state
  const editData = location.state?.editData;
  const isEditMode = !!editData;

  // ---------------- STATES ----------------
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [clientContactAlt, setClientContactAlt] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientGst, setClientGst] = useState("");
  const [attendedBy, setAttendedBy] = useState("");
  console.log(attendedBy, "attendedBy")
  const [architects, setArchitects] = useState([]); // List from API
  const [selectedArchitect, setSelectedArchitect] = useState(""); // The ID of selected architect
  const [selectedAttended, setSelectedAttended] = useState("");
  const [Attended, setAttended] = useState([]); // List from API

  // Search Custermer
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    const fetchCustermer = async () => {
      if (searchTerm.length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`${BASEURL}/api/users/list`);
        const data = await response.json();

        if (data.success) {
          const filtered = data.customers.filter((c) =>
            `${c.name || ""} ${c.Last_Name || ""} ${c.phone || ""}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );

          setSuggestions(filtered);
        }
      } catch (error) {
        console.error("Error fetching Customer:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCustermer();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);


  console.log(Attended, "Attended")
  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        const response = await axios.get(`${BASEURL}/api/architects/list`);

        if (response.data.success) {
          setArchitects(response.data.architects);
        }
      } catch (error) {
        console.error("Error fetching architects:", error);
      }
    };

    fetchArchitects();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`${BASEURL}/api/employees/list`);

        if (response.data.success) {
          setAttended(response.data.employees);
        }
      } catch (error) {
        console.error("Error fetching architects:", error);
      }
    };

    fetchEmployee();
  }, []);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  console.log(additionalDiscount, "additionalDiscount")
  const [products, setProducts] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ rating: "", comments: "", satisfied: "" });

  const [headerSection, setHeaderSection] = useState("This is with reference to our discussion with you regarding your requirement; here we quote our best price for your prestigious project as below:");
  const [bottomSection, setBottomSection] = useState(` <p>Above rates are including GST @ 18%, Excluding unloading charge and this are Nashik warehouse rates.</p><table width="100%" style="box-sizing: border-box; caption-side: bottom; border-collapse: collapse; width: 1387.46px; font-size: 18px;"><tbody style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px;"><tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px;"><td width="20%" style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">Payment Term</strong></td><td width="5%" style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">:</strong></td><td width="70%" style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><em style="box-sizing: border-box;">100% Advance.</em></td></tr><tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px;"><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">Delivery Period</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">:</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;">7 TO 8 Days from the date of order / dispatch schedule.</td></tr><tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px;"><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">Billing</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">:</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;">GST Billing @ 18%</td></tr><tr style="box-sizing: border-box; border-color: inherit; border-style: solid; border-width: 0px;"><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">Validity of price</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;"><strong style="box-sizing: border-box; font-weight: bolder;">:</strong></td><td style="box-sizing: border-box; border: 1px solid rgb(236, 236, 236); padding: 5px 3px;">30 Days from Date of Quotation</td></tr></tbody></table><p><strong style="box-sizing: border-box; font-weight: bolder;">BANK DETAILS :</strong><strong style="box-sizing: border-box; font-weight: bolder;">Yes Bank :<span>&nbsp;</span></strong>THE CERAMIC STUDIO</p><p><strong style="box-sizing: border-box; font-weight: bolder;">A/c no. :<span>&nbsp;</span></strong>002163700002424</p><p><strong style="box-sizing: border-box; font-weight: bolder;">Branch :</strong><span>&nbsp;</span>Canada Corner</p><p><strong style="box-sizing: border-box; font-weight: bolder;">IFSC :<span>&nbsp;</span></strong>YESB0000021</p><p>We again express our gratitude for your esteemed organization and looking forward for a long and healthy business relationship. Assuring you of our best service all the times.Thanking You .</p><p><br></p><p><strong style="box-sizing: border-box; font-weight: bolder;">THE CERAMIC STUDIO-NASHIK.</strong></p><p><strong style="box-sizing: border-box; font-weight: bolder;">SALES (8847784888)</strong></p><p><strong style="box-sizing: border-box; font-weight: bolder;">ACCOUNT (8847785888)</strong></p>

`); // Your default HTML string here

  const emptyRow = {
    productId: "",
    productName: "",
    size: "",
    quality: "",
    rate: 0,
    box: 0,      // Main Input
    cov: 1,      // Editable Coverage per Box (Default 1)
    Weight: 0,
    discount: 0,
    Coverage: 0, // Calculated Result (Total Area)
    TWgt: 0,     // Calculated Result (Total Weight)
    total: 0,    // Final Amount
    area: ""
  };
  const [rows, setRows] = useState([emptyRow]);
  console.log(rows, "rows")
  // ---------------- JODIT CONFIG ----------------
  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Start typing official terms...',
    buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'font', 'fontsize', 'brush', '|', 'table', 'align', 'undo', 'redo'],
    height: 250,
  }), []);


  // useEffect(() => {
  //   if (editData) {
  //     debugger
  //     // Mapping based on your provided JSON structure
  //     setClientName(editData.clientName || "");
  //     setClientContact(editData.contactNo || "");
  //     setClientEmail(editData.email || "");
  //     setClientAddress(editData.address || "");
  //     setClientGst(editData.gstNo || ""); 
  //     setAttendedBy(editData.attendedBy || "");
  //    setSelectedArchitect(editData.architect || "");

  //     setHeaderSection(editData.headerSection || "");
  //     setBottomSection(editData.bottomSection || "");

  //     // Map "items" from JSON to "rows" in state
  //     if (editData.items && editData.items.length > 0) {
  //       setRows(editData.items.map(item => ({
  //         productId: item.productId,
  //         productName: item.productName,
  //         size: item.size,
  //         quality: item.quality,
  //         rate: item.rate,
  //         cov: item.Cov,
  //         box: item.box,
  //         discount: item.discount,
  //         total: item.total
  //       })));
  //     }

  //     // Calculate additional discount if grandTotal differs from row sums
  //     const rowsSum = editData.items?.reduce((sum, i) => sum + Number(i.total), 0) || 0;
  //     setAdditionalDiscount(rowsSum - Number(editData.grandTotal) || 0);
  //   }
  // }, [editData]);
  useEffect(() => {
    debugger
    if (editData) {

      setClientName(editData.clientName || "");
      setClientContact(editData.contactNo || "");
      setClientContactAlt(editData.altContactNo || "");
      setClientEmail(editData.email || "");
      setClientAddress(editData.address || "");
      setClientGst(editData.gstNo || "");
      const attendedId = editData.attendedBy?._id || editData.attendedBy || "";
      setAttendedBy(String(attendedId));
      setSelectedArchitect(editData.architect || "");
      setHeaderSection(editData.headerSection || "");
      setBottomSection(editData.bottomSection || "");
      const discountVal = Number(editData.additionalDiscount) || 0;
      setAdditionalDiscount(discountVal);
      // Map Items with Live Calculations
      if (editData.items && editData.items.length > 0) {
        const mappedRows = editData.items.map(item => {
          const box = Number(item.box) || 0;
          const cov = Number(item.cov) || 0;
          const weight = Number(item.weight) || 0;
          const rate = Number(item.rate) || 0;
          const discount = Number(item.discount) || 0;
          const Area = item.area;
          // Perfect Logic Calculations
          const calculatedCoverage = box * cov;
          const totalWeight = box * weight;
          const totalAmount = (calculatedCoverage * rate) - discount;

          return {
            productId: item.productId,
            productName: item.productName || item.name,
            size: item.size,
            quality: item.quality,
            rate: rate,
            box: box,
            cov: cov,
            Weight: weight,
            discount: discount,
            Coverage: calculatedCoverage, // Total Area
            TWgt: totalWeight,            // Total Weight
            total: totalAmount,
            area: Area   // Final Row Price
          };
        });

        setRows(mappedRows);

        // Handle Grand Total & Additional Discount
        const rowsSum = mappedRows.reduce((sum, row) => sum + row.total, 0);
        const grandTotal = Number(editData.grandTotal) || 0;
        // setAdditionalDiscount(rowsSum - grandTotal);
      }
    }
  }, [editData]);
  // ---------------- API FETCH (Products) ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASEURL}/api/product/list`);
        setProducts(res.data.products || []);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  // ---------------- CALCULATIONS ----------------
  const recalcRow = (row) => {
    debugger
    const boxes = parseFloat(row.box) || 0;
    const covPerBox = parseFloat(row.cov) || 0; // Editable coverage per box
    const rate = parseFloat(row.rate) || 0;
    const weightPerBox = parseFloat(row.Weight) || 0;
    const discountPercent = parseFloat(row.discount) || 0;

    // 1. Total Coverage (Area) = Boxes * Coverage per individual box
    const totalCoverage = covPerBox;

    // 2. Total Weight = Boxes * Weight per individual box
    const totalWeight = boxes * weightPerBox;

    // 3. Amount = Total Area * Rate per unit
    const amount = boxes * totalCoverage * rate;

    // 4. Final Total
    const discountAmount = (amount * discountPercent) / 100;
    const finalTotal = amount - discountAmount;

    return {
      ...row,
      box: boxes,
      cov: covPerBox, // Keep this editable
      Coverage: totalCoverage.toFixed(2),
      TWgt: totalWeight.toFixed(2),
      total: finalTotal.toFixed(2),
      // Area: totalCoverage.toFixed(2)
    };
  };

  const updateRowField = (i, key, value) => {
    const updated = [...rows];
    updated[i][key] = value;
    updated[i] = recalcRow(updated[i]);
    setRows(updated);
  };

  const selectProduct = (i, productId) => {
    debugger
    const p = products.find(x => x.id == productId);
    if (!p) return;
    const updated = [...rows];
    updated[i] = recalcRow({
      ...updated[i], productId: p.id, productName: p.name, size: p.size, quality: p.quality,
      cov: p.Cov, rate: Number(p.rate)
    });
    setRows(updated);
  };

  const itemTotal = rows.reduce((sum, r) => sum + Number(r.total), 0);
  const discountAmount = (Number(itemTotal) * (Number(additionalDiscount) || 0)) / 100;
  const grandTotal = (Number(itemTotal) - discountAmount).toFixed(2);

  // ---------------- SAVE / UPDATE LOGIC ----------------

  const saveQuotation = async () => {

    if (!rows || rows.length === 0) {
      alert("Please add at least one item to the quotation.");
      return; // Stop execution
    }

    // 2. Check if grandTotal is valid and greater than 0
    if (Number(grandTotal) <= 0) {
      alert("Grand Total must be greater than 0 to save the quotation.");
      return; // Stop execution
    }

    // 3. Optional: Check if client name is entered
    if (!clientName.trim()) {
      alert("Please enter the Client Name.");
      return;
    }
    try {
      const payload = {
        quotationId: isEditMode ? editData.id : undefined,
        additionalDiscount: additionalDiscount,
        clientDetails: {
          name: clientName,
          contactNo: clientContact,
          altContactNo: clientContactAlt,
          email: clientEmail,
          address: clientAddress,
          gstNo: clientGst,
          attendedBy,
          architect: selectedArchitect,
          Attended: selectedAttended
        },
        headerSection,
        bottomSection,
        rows,
        grandTotal: Number(grandTotal)
      };

      if (isEditMode) {
        await axios.put(
          `${BASEURL}/api/Quotation/updateQuotation/${editData.id}`,
          payload
        );
        alert("Quotation Updated Successfully!");
      } else {
        await axios.post(
          `${BASEURL}/api/Quotation/saveQuotation`,
          payload
        );
        alert("Quotation Saved Successfully!");
      }

      navigate("/quotation/manage");

    } catch (err) {
      console.error(err);
      alert("Error processing quotation");
    }
  };


  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-10 font-['Lexend'] text-slate-700">
      <div className=" mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[35px] shadow-sm border border-orange-50">
          <div className="flex items-center gap-4">
            {isEditMode && (
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft size={24} className="text-slate-400" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {isEditMode ? "Edit Quotation" : "Create Quotation"}
              </h1>
              <div className="flex items-center gap-2 text-orange-500 font-bold text-sm mt-1 uppercase tracking-widest">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                {isEditMode ? `ID: ${editData.id}` : "New Entry"}
              </div>
            </div>
          </div>
          <button onClick={() => setShowFeedback(true)} className="bg-[#FF7A00] hover:bg-[#E66E00] text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-orange-100 transition-all flex items-center gap-3 active:scale-95">
            <Save size={20} /> {isEditMode ? "UPDATE CHANGES" : "SAVE QUOTATION"}
          </button>
        </div>

        <div className=" gap-10">
          <div className=" space-y-10">

            {/* CLIENT INFO */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-50 rounded-2xl text-[#FF7A00]"><User size={24} /></div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Client Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Client Full Name */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Full Name</label>
                  <input
                    className="lux-input"
                    placeholder="Type here..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                  />

                  {/* Dropdown Menu */}
                  {isOpen && suggestions.length > 0 && (
                    <div className="absolute z-10 max-w-full bg-white border border-slate-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                      {suggestions.map((customer) => (
                        <div
                          key={customer.id}
                          className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                          onClick={() => {
                            // Auto-fill all fields
                            setClientName(`${customer.name || ""} ${customer.Last_Name || ""}`.trim());
                            setClientContact(customer.phone || "");
                            setClientContactAlt(customer.altphone || "");
                            setClientEmail(customer.email || "");
                            setClientAddress(customer.siteName || "");
                            setSelectedArchitect(String(customer.assignedArchitectId || ""));
                            setAttendedBy(String(customer.assignedEmployeeId || ""));
                            setSearchTerm(`${customer.name || ""} ${customer.Last_Name || ""}`.trim());
                            setIsOpen(false);
                          }}
                        >
                          <div className="font-medium">{customer.name} {customer.Last_Name}</div>
                          <div className="text-xs text-slate-500">{customer.phone}</div>
                        </div>
                      ))}

                    </div>
                  )}

                </div>
                {/* Architect Dropdown - Dynamic */}


                {/* Client GST Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest ml-1">Client GST Number</label>
                  <input className="lux-input border-orange-100" placeholder="27XXXXX..." value={clientGst} onChange={(e) => setClientGst(e.target.value)} />
                </div>

                {/* Contact Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                  <input className="lux-input" placeholder="+91" value={clientContact} onChange={(e) => setClientContact(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alt Number</label>
                  <input className="lux-input" placeholder="+91" value={clientContactAlt} onChange={(e) => setClientContactAlt(e.target.value)} />
                </div>

                {/* Site Address */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Site Address</label>
                  <input className="lux-input" placeholder="Full location..." value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1 mt-2 flex gap-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Architect</label>
                  <select
                    className="lux-input bg-white"
                    value={selectedArchitect}
                    onChange={(e) => setSelectedArchitect(e.target.value)}
                  >
                    <option value="">Choose Architect...</option>
                    {architects.map((arch) => (
                      <option key={arch.id} value={arch.id}>
                        {arch.firstname} {arch.lastname}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Attended By
                  </label>
                  <select
                    className="lux-input bg-white w-full"
                    value={attendedBy} // The ID stored in state
                    onChange={(e) => setAttendedBy(e.target.value)}
                  >
                    <option value="">Choose Person...</option>
                    {Attended.map((person) => {
                      // Determine the correct ID field (handling both MongoDB _id and standard id)
                      const personId = String(person._id || person.id);

                      return (
                        <option key={personId} value={personId}>
                          {person.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

              </div>
            </div>

            {/* INTRO NOTE */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText size={16} className="text-orange-500" /> Introduction Note
              </h3>
              <JoditEditor value={headerSection} config={config} onBlur={c => setHeaderSection(c)} />
            </div>

            {/* PRODUCT TABLE */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Itemized Quotation</h3>
                <button onClick={() => setRows([...rows, emptyRow])} className="bg-white text-orange-600 border border-orange-100 px-6 py-2 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                  + Add New Row
                </button>
              </div>
              <div className="overflow-x-auto rounded-[24px] border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left border-collapse table-fixed"> {/* table-fixed helps maintain column sizes */}
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      {/* Manually defining widths for critical sections */}
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[280px]">Product Search</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[120px]">Details</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[100px] text-center">Rate</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[100px] text-center">Quality</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[140px] text-center">Box</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[80px] text-center">Weight</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[80px] text-center">TWgt</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[90px] text-center">Coverage</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[80px] text-center">Dis%</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[120px] text-right">Total</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[80px] text-center">Area</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[60px] text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors h-[70px]"> {/* Fixed row height for stability */}
                        <td className="p-3">
                          <select className="lux-input w-full text-xs h-13 px-2 rounded-xl border-slate-200 bg-slate-50" value={r.productId} onChange={(e) => selectProduct(i, e.target.value)}>
                            <option value="">Select a Product</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </td>
                        <td className="p-3">
                          <p className="text-xs font-bold text-slate-700">{r.size || '---'}</p>
                          <p className="text-[9px] font-black text-orange-400 uppercase">{r.quality}</p>
                        </td>
                        <td className="p-3 text-center">
                          <input className="table-input w-20 h-10 text-center" value={r.rate} onChange={(e) => updateRowField(i, "rate", e.target.value)} />
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-md uppercase">
                            {r.quality}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            {/* <input className="table-input w-12 h-10 text-center" value={r.cov} onChange={(e) => updateRowField(i, "cov", e.target.value)} /> */}
                            {/* <span className="text-slate-300">x</span> */}
                            <input className="table-input w-12 h-10 text-center" value={r.box} onChange={(e) => updateRowField(i, "box", e.target.value)} />
                          </div>
                        </td>
                        <td className="p-3 text-center"><input className="table-input w-16 h-10 text-center text-orange-600" value={r.Weight} onChange={(e) => updateRowField(i, "Weight", e.target.value)} /></td>
                        <td className="p-3 text-center"><input className="table-input w-16 h-10 text-center text-orange-600 bg-slate-50" value={r.TWgt} readOnly /></td>
                        <td className="p-3 text-center w-[100px]">
                          <div className="flex flex-col items-center">
                            <input
                              className="table-input w-16 h-10 text-center border-blue-100 bg-blue-50/20 font-bold text-blue-600"
                              value={r.cov} // This is the individual box coverage
                              onChange={(e) => updateRowField(i, "cov", e.target.value)}
                            />
                            {/* <span className="text-[8px] font-bold text-blue-400 uppercase mt-1">Cov / Box</span> */}
                          </div>
                        </td>
                        <td className="p-3 text-center"><input className="table-input w-14 h-10 text-center text-orange-600" value={r.discount} onChange={(e) => updateRowField(i, "discount", e.target.value)} /></td>
                        <td className="p-3 text-right font-black text-slate-800 text-sm">₹{Number(r.total).toLocaleString()}</td>
                        <td className="p-3 text-center"><input className="table-input w-16 h-10 text-center text-orange-600" value={r.area} onChange={(e) => updateRowField(i, "area", e.target.value)} /></td>
                        <td className="p-3 text-center">
                          <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))} className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BANK DETAILS */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={16} className="text-orange-500" /> Bank Details & Terms
              </h3>
              <JoditEditor value={bottomSection} config={config} onBlur={c => setBottomSection(c)} />
            </div>
            <div className="lg:col-span-4">
              <div className="sticky top-10 space-y-8">
                <div className="bg-gradient-to-br from-[#FFF7F0] to-[#FFFFFF] p-10 rounded-[50px] border border-orange-100 shadow-xl shadow-orange-50/50">
                  <div className="flex items-center gap-2 mb-8 text-orange-600">
                    <Calculator size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Summary</span>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-400">Items Total</span>
                      <span className="text-lg font-black text-slate-800">₹{itemTotal.toLocaleString()}</span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-orange-50">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                          <Percent size={14} /> Addl. Discount
                        </span>
                        <input
                          type="number"
                          className="w-32 p-3 rounded-xl border-orange-100 border bg-white text-right font-black text-orange-600 focus:outline-none"
                          value={additionalDiscount}
                          onChange={(e) => setAdditionalDiscount(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-8 mt-4 border-t-2 border-dashed border-orange-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2">Final Quotation Value</span>
                      <div className="text-5xl font-black text-slate-900 tracking-tighter italic">
                        ₹{Number(grandTotal).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 p-5 bg-orange-600 rounded-[25px] text-white text-center font-black text-sm cursor-pointer hover:bg-orange-700 transition-all shadow-lg shadow-orange-200" onClick={() => setShowFeedback(true)}>
                    PROCEED TO {isEditMode ? "UPDATE" : "SAVE"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SUMMARY SIDEBAR */}

        </div>

        {/* FEEDBACK MODAL */}
        {showFeedback && (
          <div className="fixed inset-0 bg-slate-200/50 backdrop-blur-xl z-[999] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-2xl rounded-[60px] shadow-2xl p-12 border border-orange-50 relative">
              <button onClick={() => setShowFeedback(false)} className="absolute top-10 right-10 p-3 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-all"><X size={24} /></button>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{isEditMode ? "Updating Quotation" : "Finalizing Quotation"}</h2>
                <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">Review your details before saving</p>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-orange-50/50 rounded-[30px] border border-orange-50">
                    <p className="text-[10px] font-black text-orange-400 uppercase mb-1">Total Items Value</p>
                    <p className="text-xl font-black text-orange-600">₹{itemTotal.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-[30px] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Grand Total</p>
                    <p className="text-xl font-black text-slate-800">₹{Number(grandTotal).toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={saveQuotation} className="w-full bg-orange-600 text-white py-5 rounded-[25px] font-black shadow-xl shadow-orange-100 transition-all uppercase text-[10px] tracking-[0.2em]">
                  {isEditMode ? "Confirm & Update Now" : "Save & Close Quote"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .lux-input { width: 100%; padding: 16px 20px; border-radius: 20px; border: 1px solid #F1F1F1; background: #FAFAFA; font-weight: 700; color: #334155; transition: all 0.3s; outline: none; font-size: 14px; }
        .lux-input:focus { border-color: #FF7A00; background: white; box-shadow: 0 10px 25px -5px rgba(255, 122, 0, 0.1); }
        .table-input { padding: 10px 14px; border-radius: 12px; border: 1px solid #F1F1F1; background: #FAFAFA; font-weight: 800; color: #334155; outline: none; font-size: 13px; text-align: center; }
        .jodit-container { border-radius: 25px !important; border: 1px solid #F1F1F1 !important; overflow: hidden; }
      `}</style>
    </div>
  );
}