import axios from "axios";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  History,
  MoreVertical,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPaymentRequest } from "../Component/API/paymentApi";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";
import QuotationHeader from "./QuotationHeader";

export default function ManageQuotation() {
  const [quotationList, setQuotationList] = useState([]);
  const [quoteType, setQuoteType] = useState("overall");
  console.log(quoteType, "quoteType");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const { permissions, user, loading, role } = useAuth();
  // Modals Toggle
  const [openDCModal, setOpenDCModal] = useState(false);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const navigate = useNavigate();
  // States
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [dcHeader, setDcHeader] = useState({
    deliveryBoy: "",
    contact: "",
    tempo: "",
  });
  const [remarks, setRemarks] = useState("");

  const [dcItems, setDcItems] = useState([]);
  console.log(dcItems, "dcItems");
  const [editData, setEditData] = useState({
    id: null,
    clientName: "",
    contactNo: "",
    items: [],
  });
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentType: "",
    remark: "",
    date: new Date().toISOString().slice(0, 10),
    grandTotal: 0,
    paid: 0,
    due: 0,
    billingType: "",
  });
  // 1. Driver Details State
  const [driverDetails, setDriverDetails] = useState({
    deliveryBoy: "",
    contact: "",
    tempo: "",
  });
  const [openMenuId, setOpenMenuId] = useState(null);

  // Function to toggle the menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // const [selectedQuotation, setSelectedQuotation] = useState(null);

  const [historyData, setHistoryData] = useState([]);

  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const openFollowUpModal = (q) => {
    setSelectedQuotation(q);
    setIsFollowUpOpen(true);
  };

  const openFollowUpHistory = async (quotation) => {
    try {
      setSelectedQuotation(quotation);
      setIsHistoryOpen(true);

      const res = await fetch(
        `${BASEURL}/api/Quotation/followup/${quotation.id}`,
      );
      const result = await res.json();

      if (result.success) {
        setHistoryData(result.data);
      } else {
        setHistoryData([]);
      }
    } catch (err) {
      console.error("Failed to fetch follow-up history", err);
      setHistoryData([]);
    }
  };

  // 2. Handle Box Update for the specific product
  const handleBoxUpdate = (productId, value) => {
    // 1. Allow empty string for backspace, otherwise parse number
    const val = value === "" ? "" : parseInt(value);

    setDcItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          // 2. Validation: Stock peksha jasta nako
          if (val !== "" && val > item.currentStock) {
            alert("insufficient Boxes!");
            return item;
          }
          // FIX: Naming match kara -> dispatchBox
          return { ...item, dispatchBox: val };
        }
        return item;
      }),
    );
  };
  const handleSaveFollowUp = async () => {
    if (!selectedQuotation || !remarks.trim()) return;

    const followUpData = {
      quotation_id: selectedQuotation.id,
      remarks: remarks,
      date: today,
    };

    try {
      const response = await fetch(`${BASEURL}/api/Quotation/followup/store`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(followUpData),
      });

      const result = await response.json();

      // Close modal only on successful creation
      if (response.status === 201 && result.success) {
        setIsFollowUpOpen(false);
        setRemarks("");
      } else {
        console.error("Failed to save follow-up:", result.message);
      }
    } catch (error) {
      console.error("Error saving follow up:", error);
    }
  };

  // 1. For Admin/SuperAdmin (Full List)
  // 1. For Admin/SuperAdmin
  // const fetchQuotations = async (page = 1, search = "") => {
  //   try {
  //     const res = await axios.get(
  //       `${BASEURL}/api/Quotation/list?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
  //     );

  //     if (res.data.success) {
  //       setQuotationList(res.data.quotations);
  //       setTotalPages(res.data.pagination.totalPages);
  //     }
  //   } catch (error) {
  //     console.log("Admin Fetch Error:", error);
  //   }
  // };
  const fetchQuotations = async (page = 1, search = "", priority = "") => {
    try {
      const res = await axios.get(
        `${BASEURL}/api/Quotation/list?page=${page}&limit=10&search=${encodeURIComponent(
          search,
        )}&priority=${priority}`,
      );

      if (res.data.success) {
        setQuotationList(res.data.quotations);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (error) {
      console.log("Admin Fetch Error:", error);
    }
  };

  // const fetchQuotationsParticularEmployee = async (page = 1) => {
  //   try {
  //     // 1. Target the 'Particular' route (note your spelling: Quatation)
  //     let url = `${BASEURL}/api/Quotation/Quatation?page=${page}&limit=10`;

  //     // 2. Append the employeeId if the filter is set to 'self'
  //     if (quoteType === "self" && user?.id) {
  //       url += `&employeeId=${user.id}`;
  //     }

  //     const res = await axios.get(url);

  //     if (res.data.success) {
  //       setQuotationList(res.data.quotations);
  //       setTotalPages(res.data.pagination.totalPages);
  //       // We don't set current page here to avoid the "cascading render" error
  //     }
  //   } catch (error) {
  //     console.log("Employee Fetch Error:", error);
  //   }
  // };
  // 2. For Employee or "Self" view
  //   const fetchQuotationsParticularEmployee = async (page = 1) => {
  //   debugger
  //   try {
  //     let url = `${BASEURL}api/Quotation/Quatation?page=${page}&limit=10`;

  //     // Ensure user.id exists before appending
  //     if (quoteType === "self" && user?.id) {
  //       url += `&employeeId=${user.id}`;
  //     }

  //     const res = await axios.get(url);
  //     if (res.data.success) {
  //       setQuotationList(res.data.quotations);
  //       setTotalPages(res.data.pagination.totalPages);
  //     }
  //   } catch (error) {
  //     console.log("Employee Fetch Error:", error);
  //   }
  // };
  // 3. The Logic Controller

  const fetchQuotationsParticularEmployee = async (
    page = 1,
    search = "",
    priority = "",
  ) => {
    try {
      let url = `${BASEURL}/api/Quotation/Quatation?page=${page}&limit=10`;

      if (quoteType === "self" && user?.id) {
        url += `&employeeId=${user.id}`;
      }

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      if (priority) {
        url += `&priority=${priority}`;
      }

      const res = await axios.get(url);

      if (res.data.success) {
        setQuotationList(res.data.quotations);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (error) {
      console.log("Employee Fetch Error:", error);
    }
  };

  useEffect(() => {
    debugger;
    if (quoteType === "self") {
      fetchQuotationsParticularEmployee(currentPage);
    } else {
      fetchQuotations(currentPage);
    }
    // Dependency array is correct: it runs when page or filter changes
  }, [currentPage, quoteType]);

  const filteredData = quotationList.filter((q) =>
    q.clientName?.toLowerCase().includes(search.toLowerCase()),
  );
  //   const handleSubmitDC = async () => {
  //   debugger
  //     // 1. Filter items where dispatchBoxes > 0
  //     const itemsToDispatch = dcItems
  //         .filter(item => item.dispatchBox
  //  > 0)
  //       .map(item => ({

  //             productId: item.productId,
  //             productName: item.productName,
  //             dispatchBoxes: parseInt(item.dispatchBoxes),
  //             // remainingStock sent to backend is: currentStock - what we are sending now
  //             remainingStock: item.currentStock - parseInt(item.dispatchBoxes)
  //         }));

  //     if (itemsToDispatch.length === 0) {
  //         alert("Please enter boxes for at least one item.");
  //         return;
  //     }

  //     // 2. Construct the exact JSON structure your backend expects
  //     const payload = {
  //         quotationId: selectedQuotation.id, // Ensure this is available
  //         client: selectedQuotation.clientName,
  //         contact: selectedQuotation.contactNo,
  //         address: selectedQuotation.address,
  //         driverDetails: {
  //             deliveryBoy: driverDetails.deliveryBoy,
  //             contact: driverDetails.contact,
  //             tempo: driverDetails.tempo
  //         },
  //         items: itemsToDispatch
  //     };

  //     try {
  //         const response = await fetch(`${BASEURL}/api/Quotation/generate-dc`, {
  //             method: 'POST',
  //             headers: { 'Content-Type': 'application/json' },
  //             body: JSON.stringify(payload)
  //         });

  //         const data = await response.json();
  //         if (data.success) {
  //             alert("DC Created Successfully!");
  //             setOpenDCModal(false);
  //             // Refresh quotations to update the numbers on the main screen
  //             fetchQuotations();
  //         } else {
  //             alert("Error: " + data.error);
  //         }
  //     } catch (error) {
  //         console.error("Submission error:", error);
  //     }
  // };
  // --- EDIT LOGIC ---

  const handleSubmitDC = async () => {
    const itemsToDispatch = dcItems
      .filter((item) => parseInt(item.dispatchBox) > 0)
      .map((item) => {
        const boxesToShip = parseInt(item.dispatchBox) || 0;
        const currentWhStock = parseInt(item.currentStock) || 0;

        return {
          productId: item.productId,
          productName: item.productName,
          rate: item.rate,
          // Backend expects "dispatchBoxes" (plural) as per your JSON requirement
          dispatchBoxes: boxesToShip,
          // Warehouse stock minus what we send now
          // remainingStock: currentWhStock - boxesToShip
        };
      });

    if (itemsToDispatch.length === 0) {
      alert("Please enter boxes for at least one item.");
      return;
    }

    const payload = {
      quotationId: selectedQuotation.quotationId || selectedQuotation.id,
      client: selectedQuotation.clientName,
      contact: selectedQuotation.contactNo,
      address: selectedQuotation.address,
      driverDetails: {
        deliveryBoy: driverDetails.deliveryBoy || "",
        contact: driverDetails.contact || "",
        tempo: driverDetails.tempo || "",
      },
      items: itemsToDispatch,
    };

    console.log("Sending Payload:", payload); // Debugging sathi check kara

    try {
      const response = await fetch(`${BASEURL}/api/Quotation/generate-dc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success || response.ok) {
        alert("Challan Generated Successfully!");
        setOpenDCModal(false);
        if (typeof fetchQuotations === "function") fetchQuotations();
      } else {
        alert("Error: " + (data.message || "Failed to create DC"));
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Server error, please try again.");
    }
  };

  const handleEditClick = (q) => {
    setEditData({
      id: q.id,
      clientName: q.clientName,
      contactNo: q.contactNo,
      items: q.items.map((item) => ({ ...item })), // Deep copy
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
    const total = editData.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const payload = { ...editData, grandTotal: total };

    try {
      // API CALL HERE: await updateQuotationApi(editData.id, payload);
      alert("Quotation Updated Successfully!");
      setOpenEditModal(false);
      fetchQuotations();
    } catch (err) {
      alert("Failed to update");
    }
  };
  // --- DC & PAYMENT LOGIC (Existing) ---
  const openPaymentModal = (q) => {
    setSelectedQuotation(q);
    setPaymentData({
      amount: "",
      paymentType: "",
      remark: "",
      date: new Date().toISOString().slice(0, 10),
      grandTotal: q.grandTotal,
      paid: q.paid_amount || 0,
      due: q.due_amount,
    });
    setOpenPayModal(true);
  };

  const openDeliveryChallan = (q) => {
    debugger;

    setSelectedQuotation(q);

    const formattedItems = q?.items?.map((i) => {
      debugger;
      // Calculation: Jar adhi 0 pathvle astil tar purn quantity dya, nahi tar vaza kara
      const pendingToDispatch =
        i.dispatchedBoxes === 0 || i.dispatchedBoxes === "0"
          ? i.remainingBoxes
          : i.remainingBoxes;

      return {
        productId: i.productId,
        productName: i.productName,
        rate: i.rate,
        totalBox: i.totalBox, // Original order quantity
        remainingInQuote: pendingToDispatch, // Kiti baki ahet (Label sathi)
        currentStock: i.currentStock || 0, // Warehouse madhe kiti ahet
        dispatchBox: pendingToDispatch, // ATA KITI PATHVAYCHE (Input value - Editable)
        qtyPerBox: i.qtyPerBox || 0,
      };
    });

    setDcItems(formattedItems);
    setOpenDCModal(true);
  };

  const openQuotationPDF = (id, mode) =>
    window.open(`${BASEURL}/api/Quotation/print/${id}?mode=${mode}`, "_blank");

  const handleSavePaymentRequest = async () => {
    try {
      const payload = {
        quotation_id: selectedQuotation.id,
        amount: paymentData.amount,
        paymentType: paymentData.paymentType,
        remark: paymentData.remark,
        billingType: paymentData.billingType,
      };
      await sendPaymentRequest(payload);
      alert("Request sent to Admin for approval");
      setOpenPayModal(false);
    } catch (err) {
      alert("Error sending request");
    }
  };

  const handlePriorityChange = async (quotationId, priority) => {
    debugger;
    try {
      const res = await axios.put(
        `${BASEURL}api/Quotation/priority/${quotationId}`,
        { priority: Number(priority) },
      );

      if (res.data && res.data.success === true) {
        setQuotationList((prev) =>
          prev.map((q) =>
            q.id === quotationId ? { ...q, priority: Number(priority) } : q,
          ),
        );

        fetchQuotations(currentPage);
      }
    } catch (err) {
      console.error("Failed to update priority", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-10 font-['Lexend'] text-slate-700">
      <QuotationHeader fetchQuotations={fetchQuotations} fetchQuotationsParticularEmployee={fetchQuotationsParticularEmployee} quoteType={quoteType} />
      {role === "employee" && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setQuoteType("overall")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${
              quoteType === "overall"
                ? "bg-orange-500 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Overall
          </button>
          <button
            onClick={() => setQuoteType("self")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${
              quoteType === "self"
                ? "bg-orange-500 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            My Quotations
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              {[
                "ID",
                "Client Details",
                "Date",
                "Status",
                "Grand Total",
                "Paid Amount",
                "Due Amount",
                "Priority",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="p-6 text-[11px] font-black text-slate-400 uppercase tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((q) => (
              <tr
                key={q.id}
                className="hover:bg-slate-50/50 transition-all group"
              >
                <td className="p-6 text-sm font-black text-slate-300">
                  #{q.id}
                </td>
                <td className="p-6">
                  <p className="font-bold text-slate-800">{q.clientName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {q?.items?.length} Products
                  </p>
                </td>
                <td className="p-6 text-sm font-medium text-slate-500">
                  {new Date(q.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="p-6">
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    Active
                  </span>
                </td>
                <td className="p-6 text-base font-black text-slate-800">
                  ₹{q.grandTotal.toLocaleString()}
                </td>
                <td className="p-6 text-base font-black text-slate-800">
                  ₹{q.paid_amount.toLocaleString()}
                </td>
                <td className="p-6 text-base font-black text-slate-800">
                  ₹{q.due_amount.toLocaleString()}
                </td>
                <td className="p-6">
                  <select
                    value={q.priority}
                    onChange={(e) => handlePriorityChange(q.id, e.target.value)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border outline-none
      ${
        Number(q.priority) === 1
          ? "bg-slate-50 text-slate-600 border-slate-200"
          : Number(q.priority) === 2
            ? "bg-yellow-50 text-yellow-600 border-yellow-200"
            : "bg-red-50 text-red-600 border-red-200"
      }
    `}
                  >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Urgent</option>
                  </select>
                </td>

                <td className="p-6">
                  <div className="relative inline-block text-left">
                    {/* 3-Dot Trigger Button - Now with onClick */}
                    <button
                      onClick={() => toggleMenu(q.id)}
                      className={`p-2 rounded-full transition-colors ${openMenuId === q.id ? "bg-slate-200" : "hover:bg-slate-100"}`}
                    >
                      <MoreVertical size={20} className="text-slate-600" />
                    </button>

                    {/* Dropdown Menu - Shown only if openMenuId matches this row's ID */}
                    {openMenuId === q.id && (
                      <>
                        {/* Transparent overlay to close menu when clicking outside */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenMenuId(null)}
                        ></div>

                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 flex flex-col p-2 gap-1 animate-in fade-in zoom-in-95 duration-100">
                          {(role === "admin" ||
                            role === "superadmin" ||
                            permissions?.["Quotation Management_Edit"]) && (
                            <button
                              onClick={() => {
                                navigate("/quotation/add", {
                                  state: { editData: q },
                                });
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md text-left"
                            >
                              <FileText size={14} /> Edit
                            </button>
                          )}

                          {(role === "admin" ||
                            role === "superadmin" ||
                            permissions?.["Quotation Management_Pay"]) && (
                            <button
                              onClick={() => {
                                openPaymentModal(q);
                                setOpenMenuId(null);
                              }}
                              disabled={Number(q.due_amount) <= 0}
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md text-left ${
                                Number(q.due_amount) <= 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : "text-blue-600 hover:bg-blue-50"
                              }`}
                            >
                              <CreditCard size={14} /> Pay
                            </button>
                          )}

                          {(role === "admin" ||
                            role === "superadmin" ||
                            permissions?.["Quotation Management_DC"]) && (
                            <button
                              onClick={() => {
                                openDeliveryChallan(q);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-md text-left"
                            >
                              <Truck size={14} /> DC
                            </button>
                          )}

                          {(role === "admin" ||
                            role === "superadmin" ||
                            permissions?.["Quotation Management_FollowUp"]) && (
                            <button
                              onClick={() => {
                                openFollowUpModal(q);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-md text-left"
                            >
                              <Clock size={14} /> Follow Up
                            </button>
                          )}

                          <button
                            onClick={() => {
                              openFollowUpHistory(q);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md text-left"
                          >
                            <History size={14} /> History
                          </button>

                          <div className="h-[1px] bg-slate-100 my-1"></div>

                          <div className="flex gap-1 p-1">
                            <button
                              onClick={() => {
                                openQuotationPDF(q.id, "qcode");
                                setOpenMenuId(null);
                              }}
                              className="flex-1 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 rounded uppercase"
                            >
                              Code
                            </button>
                            <button
                              onClick={() => {
                                openQuotationPDF(q.id, "qname");
                                setOpenMenuId(null);
                              }}
                              className="flex-1 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 rounded uppercase"
                            >
                              Name
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm font-['Lexend']">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                    currentPage === i + 1
                      ? "bg-[#FA9C42] text-white shadow-lg shadow-orange-100"
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
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {openEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[40px] shadow-2xl flex flex-col animate-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-purple-50/30">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-xl text-purple-600 shadow-sm">
                  <FileText size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase italic">
                  Edit Quotation #{editData.id}
                </h2>
              </div>
              <button
                onClick={() => setOpenEditModal(false)}
                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="modal-label">Client Name</label>
                  <input
                    type="text"
                    className="lux-modal-input"
                    value={editData.clientName}
                    onChange={(e) =>
                      setEditData({ ...editData, clientName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="modal-label">Contact</label>
                  <input
                    type="text"
                    className="lux-modal-input"
                    value={editData.contactNo}
                    onChange={(e) =>
                      setEditData({ ...editData, contactNo: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2 border-b">
                  Manage Items
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {editData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group"
                    >
                      <div className="flex-1 font-bold text-slate-700">
                        {item.productName}
                      </div>
                      <div className="w-24">
                        <label className="text-[8px] font-black uppercase text-slate-400 ml-1">
                          Qty
                        </label>
                        <input
                          type="number"
                          className="w-full p-2 rounded-xl border border-slate-200 font-bold"
                          value={item.qty}
                          onChange={(e) =>
                            updateEditItem(idx, "qty", Number(e.target.value))
                          }
                        />
                      </div>
                      <div className="w-32">
                        <label className="text-[8px] font-black uppercase text-slate-400 ml-1">
                          Price
                        </label>
                        <input
                          type="number"
                          className="w-full p-2 rounded-xl border border-slate-200 font-bold"
                          value={item.price}
                          onChange={(e) =>
                            updateEditItem(idx, "price", Number(e.target.value))
                          }
                        />
                      </div>
                      <div className="w-28 text-right pt-4 font-black text-slate-800 italic">
                        ₹{(item.qty * item.price).toLocaleString()}
                      </div>
                      <button
                        onClick={() => removeItemFromEdit(idx)}
                        className="p-2 mt-4 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t bg-slate-50/50 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">
                  New Grand Total
                </p>
                <p className="text-3xl font-black text-purple-600 italic">
                  ₹
                  {editData.items
                    .reduce((s, i) => s + i.qty * i.price, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setOpenEditModal(false)}
                  className="px-8 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest"
                >
                  Discard
                </button>
                <button
                  onClick={saveUpdatedQuotation}
                  className="px-10 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-purple-100 flex items-center gap-2 hover:bg-purple-700 transition-all"
                >
                  <CheckCircle size={18} /> Update Quotation
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
              <button
                onClick={() => setOpenPayModal(false)}
                className="p-2 text-slate-300 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase">
                  Paid Amount
                </p>
                <p className="text-lg font-black text-slate-800">
                  ₹{paymentData.paid}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="text-[9px] font-black text-orange-400 uppercase">
                  Due Amount
                </p>
                <p className="text-lg font-black text-orange-600">
                  ₹{paymentData.due}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Payment Method Select */}
              <div>
                <label className="modal-label">Payment Method</label>
                <select
                  className="lux-modal-input"
                  value={paymentData.paymentType}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      paymentType: e.target.value,
                    })
                  }
                >
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Amount Input */}
              <div>
                <label className="modal-label">Amount</label>
                <input
                  className="lux-modal-input" // Removed conditional red styling
                  type="number"
                  placeholder="Enter amount"
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, amount: e.target.value })
                  }
                />
              </div>

              {/* Remark Input */}
              <div>
                <label className="modal-label">Remark</label>
                <input
                  className="lux-modal-input"
                  type="text"
                  placeholder="e.g. Received by hand"
                  value={paymentData.remark}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, remark: e.target.value })
                  }
                />
              </div>
            </div>
            {/* Billing Type Radio Group */}
            {/* Transaction Type Selection */}
            <div className="mb-6 mt-5">
              <label className="modal-label">Transaction Type</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {/* Option 1: Billing */}
                <label
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border-2 cursor-pointer transition-all duration-200 
        ${
          paymentData.billingType === "Billing"
            ? "border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm"
            : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
        }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    name="billingType"
                    value="Billing"
                    checked={paymentData.billingType === "Billing"}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        billingType: e.target.value,
                      })
                    }
                  />
                  <span className="text-[10px] uppercase tracking-tight">
                    Billing
                  </span>
                </label>

                {/* Option 2: Non-Billing */}
                <label
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border-2 cursor-pointer transition-all duration-200 
        ${
          paymentData.billingType === "Non-Billing"
            ? "border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm"
            : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
        }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    name="billingType"
                    value="Non-Billing"
                    checked={paymentData.billingType === "Non-Billing"}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        billingType: e.target.value,
                      })
                    }
                  />
                  <span className="text-[10px] uppercase tracking-tight">
                    Non-Bill
                  </span>
                </label>

                {/* Option 3: None (Empty String) */}
                <label
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border-2 cursor-pointer transition-all duration-200 
        ${
          paymentData.billingType === ""
            ? "border-slate-400 bg-slate-200 text-slate-700 font-bold"
            : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
        }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    name="billingType"
                    value=""
                    checked={paymentData.billingType === ""}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        billingType: e.target.value,
                      })
                    }
                  />
                  <span className="text-[10px] uppercase tracking-tight">
                    None
                  </span>
                </label>
              </div>
            </div>
            <button
              className="w-full mt-8 py-4 rounded-2xl font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700 active:transform active:scale-[0.98] transition-all duration-200"
              onClick={handleSavePaymentRequest}
              disabled={false} // Always clickable
            >
              Save Payment
            </button>
          </div>
        </div>
      )}
      {isFollowUpOpen && (
        /* Overlay: fixed, centered, with a dark backdrop */
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* Modal Content */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">
                Add Follow Up
              </h3>
              <button
                onClick={() => setIsFollowUpOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Date Field (Locked) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Follow Up Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={today}
                    disabled
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>
                <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                  Note: Tracking date is automatically set to today.
                </p>
              </div>

              {/* Notes Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Details / Remarks
                </label>
                <textarea
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  rows="4"
                  placeholder="What was discussed with the client?"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsFollowUpOpen(false)}
                className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md shadow-emerald-200 transition-all active:scale-95"
                onClick={handleSaveFollowUp}
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsHistoryOpen(false)}
          ></div>

          <div className="relative w-80 bg-white h-full shadow-2xl p-6 transition-transform">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="font-bold text-lg">Follow-up Tracking</h3>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {historyData.length === 0 && (
                <p className="text-sm text-slate-400">No follow-ups found.</p>
              )}

              {historyData.map((item) => (
                <div
                  key={item.id}
                  className="relative pl-6 border-l-2 border-emerald-500"
                >
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500"></div>
                  <p className="text-xs text-gray-400 font-mono">
                    {new Date(item.follow_up_date).toLocaleDateString("en-GB")}
                  </p>
                  <p className="text-sm font-medium">{item.remarks}</p>
                </div>
              ))}
            </div>
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
                <div className="p-3 bg-white rounded-xl text-orange-500 shadow-sm">
                  <Truck size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">
                  Dispatch Challan
                </h2>
              </div>
              <button
                onClick={() => setOpenDCModal(false)}
                className="p-2 text-slate-300 hover:text-red-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6">
              {/* Driver/Delivery Details */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="modal-label">Delivery Boy</label>
                  <input
                    className="lux-modal-input"
                    placeholder="Name"
                    onChange={(e) =>
                      setDriverDetails({
                        ...driverDetails,
                        deliveryBoy: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="modal-label">Contact</label>
                  <input
                    className="lux-modal-input"
                    placeholder="Phone"
                    onChange={(e) =>
                      setDriverDetails({
                        ...driverDetails,
                        contact: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="modal-label">Vehicle No (Tempo)</label>
                  <input
                    className="lux-modal-input"
                    placeholder="MH-15..."
                    onChange={(e) =>
                      setDriverDetails({
                        ...driverDetails,
                        tempo: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Item Selection - BOX ONLY */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase text-slate-400">
                  Items for Dispatch
                </h3>
                {dcItems.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all"
                  >
                    <div className="flex flex-col gap-1">
                      {/* Physical Stock in Warehouse */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${p.currentStock > 0 ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          In Warehouse:{" "}
                          <span className="text-slate-900">
                            {p.currentStock} Boxes
                          </span>
                        </span>
                      </div>

                      <span className="font-bold text-slate-700 text-lg leading-tight">
                        {p.productName}
                      </span>

                      {/* Quote Progress */}
                      <div className="flex gap-2">
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                          Pending in Quote: {p.remainingBoxes} Boxes
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1">
                        Dispatch Now
                      </label>
                      <div className="flex items-center bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
                        <input
                          type="number"
                          className="w-20 text-center font-black text-slate-800 outline-none"
                          placeholder="0"
                          value={p.dispatchBox} // Match with state key
                          onChange={(e) =>
                            handleBoxUpdate(p.productId, e.target.value)
                          }
                        />
                        <span className="text-[10px] ml-2 font-bold text-slate-300">
                          BOX
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 border-t flex justify-end gap-4 bg-slate-50/50">
              <button
                onClick={() => setOpenDCModal(false)}
                className="px-8 font-black text-slate-400 text-[10px] uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDC}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2"
              >
                Generate Challan <ChevronRight size={14} />
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
