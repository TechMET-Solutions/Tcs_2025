import { History, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const ExpensePanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ name: '', amount: '', remark: '', type: 'debit' });

  const API_URL = 'http://localhost:5000/api/transactions';

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/GetAllTransaction`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // --- Dynamic Calculations ---
  const totalAdded = transactions
    .filter(t => t.type === 'credit')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const currentBalance = totalAdded - totalExpenses;

  // --- Handle Form Submission with Negative Balance Guard ---
  const handleAddEntry = async (e) => {
    e.preventDefault();
    
    const entryAmount = Number(formData.amount);

    // 1. Check if user is spending more than available balance
    if (formData.type === 'debit' && entryAmount > currentBalance) {
      alert(`Transaction Rejected! \n\nYou are trying to spend ₹${entryAmount.toLocaleString()}, but your current balance is only ₹${currentBalance.toLocaleString()}.`);
      return; // Stop the function here
    }

    try {
      const response = await fetch(`${API_URL}/createTransaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchTransactions();
        setFormData({ name: '', amount: '', remark: '', type: 'debit' });
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to save transaction");
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Server connection error.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1F3A93] mb-6">Expense & Stock Management</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${currentBalance < 500 ? 'border-orange-500' : 'border-blue-600'}`}>
            <p className="text-sm text-gray-500 uppercase font-bold">Current Stock Balance</p>
            <p className="text-3xl font-black text-blue-900">₹{currentBalance.toLocaleString()}</p>
            {currentBalance < 500 && <p className="text-xs text-orange-600 mt-1 font-bold">⚠️ Low Balance</p>}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500 uppercase font-bold">Total Added</p>
            <p className="text-2xl font-bold text-green-600">+₹{totalAdded.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
            <p className="text-sm text-gray-500 uppercase font-bold">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">-₹{totalExpenses.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PlusCircle size={20} className="text-blue-600" /> New Entry
            </h2>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Transaction Type</label>
                <select 
                  className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="debit">Give Money (Expense)</option>
                  <option value="credit">Add to Stock (Deposit)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Employee Name / Source</label>
                <input 
                  type="text" required className="w-full p-2 border rounded-md" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Amount (₹)</label>
                <input 
                  type="number" required min="1" className="w-full p-2 border rounded-md" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Remark</label>
                <textarea 
                  className="w-full p-2 border rounded-md" rows="3"
                  value={formData.remark}
                  onChange={(e) => setFormData({...formData, remark: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-[#1F3A93] text-white py-2 rounded-md font-semibold hover:bg-blue-800 transition disabled:bg-gray-400"
              >
                Save Transaction
              </button>
            </form>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
             {/* ... Table UI remains the same ... */}
             <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History size={20} className="text-gray-600" /> Recent Transactions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Remark</th>
                    <th className="px-6 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{t.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 italic">{t.remark}</td>
                      <td className={`px-6 py-4 font-bold ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'credit' ? '+' : '-'}₹{Number(t.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePanel;