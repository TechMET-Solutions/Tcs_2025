// import axios from "axios";
// import { Camera, History, Loader2, Send } from "lucide-react";
// import { useEffect, useState } from "react";
// import { BASEURL } from "../Component/API/Url";
// import { useAuth } from "../utils/AuthContext";

// const CreditLedger = () => {
//   // 1. By default Employee ID 1 set kar di gayi hai
//   // const [currentUser] = useState({ id: 1, name: 'Sumit Pathak', role: 'employee' });
//   const { permissions, user, role } = useAuth();
//   const [billFile, setBillFile] = useState(null);
//   const [inputAmount, setInputAmount] = useState("");
//   const [spendReason, setSpendReason] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [myData, setMyData] = useState({ balance: 0, logs: [] });

//   // 2. Particular Employee (ID: 1) ka data fetch karna
//   const fetchData = async () => {
//     try {
//       // Aapke backend GET route ko hit kar rahe hain: /api/wallet/stock/:employeeId
//       const res = await axios.get(`${BASEURL}/api/wallet/stock/${user?.id}`);

//       if (res.data.success) {
//         setMyData({
//           balance: res.data.current_balance,
//           logs: res.data.transactions,
//         });
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [user?.id]);

//   // 3. Expense Submit karne ka logic
//   const handleSpendCredit = async () => {
//     const formData = new FormData();
//     formData.append("employeeId", user.id);
//     formData.append("amount", inputAmount);
//     formData.append("note", spendReason);

//     // Bill image optional
//     if (billFile) {
//       formData.append("bill_image", billFile);
//     } else {
//       formData.append("bill_image", "");
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(`${BASEURL}/api/wallet/spend`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         alert("Expense Recorded Successfully!");
//         setInputAmount("");
//         setSpendReason("");
//         setBillFile("");
//         fetchData();
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Transaction Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && myData.logs.length === 0)
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-50">
//         <Loader2 className="animate-spin text-indigo-600" size={40} />
//       </div>
//     );

//   return (
//     <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 font-sans">
//       {/* Employee Welcome Header */}
//       <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
//         <div>
//           <h1 className="text-xl font-black text-slate-800 tracking-tight">
//             Welcome, {user.name}
//           </h1>
//           <p className="text-[10px] text-indigo-500 font-bold uppercase">
//             Staff ID: #00{user.id}
//           </p>
//         </div>
//         <div className="bg-slate-100 p-2 rounded-xl text-slate-400">
//           <History size={20} />
//         </div>
//       </div>

//       {/* Real-time Balance Card */}
//       <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
//         <div className="relative z-10">
//           <p className="opacity-70 uppercase text-[10px] font-black tracking-[0.2em]">
//             Available Stock Balance
//           </p>
//           <h2 className="text-6xl font-black mt-2 flex items-center gap-1">
//             <span className="text-3xl opacity-50">₹</span>
//             {parseFloat(myData.balance).toLocaleString("en-IN")}
//           </h2>
//         </div>
//         <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Expense Submission Form */}
//         <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
//           <h3 className="font-black uppercase text-xs mb-6 text-slate-400 flex items-center gap-2">
//             <Send size={14} className="text-indigo-600" /> Record New Expense
//           </h3>
//           <div className="space-y-4">
//             <div>
//               <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
//                 Amount
//               </label>
//               <input
//                 type="number"
//                 placeholder="0.00"
//                 className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 font-mono font-bold"
//                 value={inputAmount}
//                 onChange={(e) => setInputAmount(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
//                 Spent For
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Travel to Site"
//                 className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200"
//                 value={spendReason}
//                 onChange={(e) => setSpendReason(e.target.value)}
//               />
//             </div>
//             <div>
//               <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
//                 Bill/Receipt
//               </label>
//               <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
//                 <Camera className="text-slate-300 mb-2" size={24} />
//                 <span className="text-[11px] text-slate-500 font-bold">
//                   {billFile ? billFile.name : "Tap to Upload Photo"}
//                 </span>
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={(e) => setBillFile(e.target.files[0])}
//                 />
//               </label>
//             </div>
//             <button
//               onClick={handleSpendCredit}
//               className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl active:scale-95 transition-transform"
//             >
//               SUBMIT RECORD
//             </button>
//           </div>
//         </div>

//         {/* Audit Logs (Last Transactions) */}
//         <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
//           <div className="p-6 border-b font-black text-xs uppercase tracking-widest text-slate-400 flex justify-between">
//             <span>Recent Activity</span>
//             <span>{myData.logs.length} Total</span>
//           </div>
//           <div className="divide-y overflow-y-auto max-h-[480px]">
//             {myData.logs.map((log) => (
//               <div
//                 key={log.id}
//                 className="p-5 flex justify-between items-center hover:bg-slate-50"
//               >
//                 <div className="flex gap-4 items-center">
//                   <div
//                     className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${log.type === "CREDIT" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
//                   >
//                     {log.type === "CREDIT" ? "+" : "-"}
//                   </div>
//                   <div>
//                     <p className="font-bold text-slate-800 text-sm">
//                       {log.note || "No Description"}
//                     </p>
//                     <p className="text-[10px] text-slate-400 font-bold uppercase">
//                       {new Date(log.created_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right flex flex-col items-end gap-2">
//                   <span
//                     className={`font-mono font-black text-sm ${log.type === "CREDIT" ? "text-emerald-500" : "text-rose-600"}`}
//                   >
//                     ₹{log.amount}
//                   </span>
//                   {log.bill_attachment && (
//                     <a
//                       href={`YOUR_SERVER_URL/uploads/bills/${log.bill_attachment}`}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-black hover:bg-indigo-100"
//                     >
//                       VIEW BILL
//                     </a>
//                   )}
//                 </div>
//               </div>
//             ))}
//             {myData.logs.length === 0 && (
//               <div className="p-20 text-center text-slate-300 font-bold italic text-xs uppercase tracking-widest">
//                 No transactions found
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreditLedger;
import axios from "axios";
import { Camera, History, Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { BASEURL } from "../Component/API/Url";
import { useAuth } from "../utils/AuthContext";

const CreditLedger = () => {
  const { user } = useAuth();
  const [billFile, setBillFile] = useState(null);
  const [inputAmount, setInputAmount] = useState("");
  const [spendReason, setSpendReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [myData, setMyData] = useState({ balance: 0, advance: 0, logs: [] });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${BASEURL}/api/wallet/stock/${user?.id}`);
      if (res.data.success) {
        setMyData({
          balance: res.data.current_balance, // Spendable money
          advance: res.data.advance_balance, // Advance salary
          logs: res.data.transactions,
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.id) fetchData();
  }, [user?.id]);

  // --- LOGIC TO SEPARATE ADVANCE SALARY ---
  // We filter logs where the note/category mentions "salary" or "advance"
  const advanceSalaryLogs = myData.logs.filter(
    (log) =>
      log.note?.toLowerCase().includes("salary") ||
      log.note?.toLowerCase().includes("advance"),
  );

  const regularLogs = myData.logs.filter(
    (log) =>
      !log.note?.toLowerCase().includes("salary") &&
      !log.note?.toLowerCase().includes("advance"),
  );

  const totalAdvanceTaken = advanceSalaryLogs.reduce(
    (acc, log) => acc + parseFloat(log.amount),
    0,
  );

  // const handleSpendCredit = async () => {
  //   if (!inputAmount || !spendReason) return alert("Please fill all fields");

  //   const formData = new FormData();
  //   formData.append("employeeId", user.id);
  //   formData.append("amount", inputAmount);
  //   formData.append("note", spendReason);
  //   if (billFile) formData.append("bill_image", billFile);

  //   try {
  //     setLoading(true);
  //     const res = await axios.post(`${BASEURL}/api/wallet/spend`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (res.data.success) {
  //       alert("Record Updated Successfully!");
  //       setInputAmount("");
  //       setSpendReason("");
  //       setBillFile(null);
  //       fetchData();
  //     }
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Transaction Failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSpendCredit = async () => {
    // 1. Basic field validation
    if (!inputAmount || !spendReason) {
      return alert("Please fill all fields");
    }

    // 2. Numeric validation
    const amountToSpend = parseFloat(inputAmount);
    const availableBalance = parseFloat(myData.balance);

    if (isNaN(amountToSpend) || amountToSpend <= 0) {
      return alert("Please enter a valid amount greater than 0");
    }

    // 3. Balance validation: Check if expense is under or equal to spendable balance
    if (amountToSpend > availableBalance) {
      return alert(
        `Insufficient Balance! \nYour spendable stock is ₹${availableBalance}, but you are trying to record an expense of ₹${amountToSpend}.`,
      );
    }

    const formData = new FormData();
    formData.append("employeeId", user.id);
    formData.append("amount", inputAmount);
    formData.append("note", spendReason);
    if (billFile) formData.append("bill_image", billFile);

    try {
      setLoading(true);
      const res = await axios.post(`${BASEURL}/api/wallet/spend`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Record Updated Successfully!");
        setInputAmount("");
        setSpendReason("");
        setBillFile(null);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Transaction Failed");
    } finally {
      setLoading(false);
    }
  };
  if (loading && myData.logs.length === 0)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-[10px] text-indigo-500 font-bold uppercase">
            Staff ID: #00{user?.id}
          </p>
        </div>
        <History size={20} className="text-slate-400" />
      </div>

      {/* Top Cards: Balance & Advance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Card 1: Spendable Expense Balance */}
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
            Available Stock for Expenses
          </p>
          <h2 className="text-4xl font-black mt-1">₹{myData.balance}</h2>
        </div>

        {/* Card 2: Advance Salary Taken */}
        <div className="bg-amber-500 p-6 rounded-3xl text-white shadow-lg">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
            Total Advance Salary
          </p>
          <h2 className="text-4xl font-black mt-1">₹{myData.advance}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 h-fit">
          <h3 className="font-black uppercase text-xs mb-6 text-slate-400 flex items-center gap-2">
            <Send size={14} className="text-indigo-600" /> New Entry
          </h3>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Amount (₹)"
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200 font-bold"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
            />
            <input
              type="text"
              placeholder="Reason (e.g. Advance Salary)"
              className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-indigo-200"
              value={spendReason}
              onChange={(e) => setSpendReason(e.target.value)}
            />
            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50">
              <Camera className="text-slate-300 mb-1" size={20} />
              <span className="text-[10px] text-slate-500 font-bold">
                {billFile ? billFile.name : "Upload Receipt"}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setBillFile(e.target.files[0])}
              />
            </label>
            <button
              onClick={handleSpendCredit}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg"
            >
              SUBMIT
            </button>
          </div>
        </div>

        {/* Advance Salary Section */}
        <div className="lg:col-span-1 bg-white rounded-[2rem] shadow-sm border-t-4 border-t-emerald-500 border border-slate-100 flex flex-col">
          <div className="p-6 border-b font-black text-xs uppercase text-slate-500 bg-emerald-50/30">
            Advance Salary History
          </div>
          <div className="divide-y overflow-y-auto max-h-[400px]">
            {advanceSalaryLogs.map((log) => (
              <TransactionItem key={log.id} log={log} color="emerald" />
            ))}
            {advanceSalaryLogs.length === 0 && <EmptyState />}
          </div>
        </div>

        {/* Regular Expenses Section */}
        <div className="lg:col-span-1 bg-white rounded-[2rem] shadow-sm border-t-4 border-t-indigo-500 border border-slate-100 flex flex-col">
          <div className="p-6 border-b font-black text-xs uppercase text-slate-500 bg-indigo-50/30">
            Stock / General Expenses
          </div>
          <div className="divide-y overflow-y-auto max-h-[400px]">
            {regularLogs.map((log) => (
              <TransactionItem key={log.id} log={log} color="indigo" />
            ))}
            {regularLogs.length === 0 && <EmptyState />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner code
const TransactionItem = ({ log, color }) => (
  <div className="p-4 flex justify-between items-center">
    <div>
      <p className="font-bold text-slate-800 text-sm">{log.note}</p>
      <p className="text-[9px] text-slate-400 font-bold uppercase">
        {new Date(log.created_at).toLocaleDateString()}
      </p>
    </div>
    <div className="text-right">
      <span className={`font-mono font-black text-sm text-${color}-600`}>
        ₹{log.amount}
      </span>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="p-10 text-center text-slate-300 font-bold text-[10px] uppercase">
    No Records
  </div>
);

export default CreditLedger;
