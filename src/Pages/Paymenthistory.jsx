import axios from 'axios';
import { FileText, History, Landmark, LayoutGrid, Receipt, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BASEURL } from '../Component/API/Url';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('billing'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASEURL}/api/payment/history`);
        setPayments(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Updated Dynamic Filtering
  const currentTabData = payments.filter(p => {
    if (activeTab === 'billing') return p.billingType === 'Billing';
    if (activeTab === 'non-billing') return p.billingType === 'Non-Billing';
    return p.billingType === '' || !p.billingType; // Handles the 3rd option
  });

  const cashPayments = currentTabData.filter(p => p.payment_type === 'Cash');
  const digitalPayments = currentTabData.filter(p => p.payment_type !== 'Cash');

  const TableSection = ({ title, icon, data, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className={`p-4 flex items-center gap-3 ${color} border-b`}>
        {icon}
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="ml-auto bg-white/40 px-3 py-1 rounded-full text-xs font-black">
          {data.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Quotation ID</th>
              <th className="px-6 py-4">Party Name</th>
                <th className="px-6 py-4">Party Number</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Remark</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-xs font-bold text-gray-400">#{item.id}</td>
                <td className="px-6 py-4 text-xs font-bold text-gray-400">#{item.quotation_id}</td>
                <td className="px-6 py-4 text-xs font-bold text-gray-400">#{item.clientName}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-400">#{item.contactNo}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.remark || '---'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-black text-gray-900">
                  ₹{Number(item.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Financial Ledger</h1>
            <p className="text-slate-500 font-medium">Categorized transaction history</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Records</p>
            <p className="text-2xl font-black text-indigo-600">{payments.length}</p>
          </div>
        </div>

        {/* 3-TAB SWITCHER */}
        <div className="flex p-1 bg-slate-200 rounded-2xl w-fit mb-8 shadow-inner">
          {[
            { id: 'billing', label: 'Billing', icon: <Receipt size={16}/> },
            { id: 'non-billing', label: 'Non-Billing', icon: <FileText size={16}/> },
            { id: 'other', label: 'Other/None', icon: <LayoutGrid size={16}/> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-md scale-105' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Display */}
        {loading ? (
          <div className="flex justify-center py-20"><History className="animate-spin text-slate-300" size={48}/></div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TableSection 
              title="Cash Payments" 
              icon={<Wallet size={20}/>} 
              data={cashPayments}
              color="bg-emerald-50 text-emerald-700 border-emerald-100"
            />

            <TableSection 
              title="Digital Payments (UPI/Bank)" 
              icon={<Landmark size={20}/>} 
              data={digitalPayments}
              color="bg-blue-50 text-blue-700 border-blue-100"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;