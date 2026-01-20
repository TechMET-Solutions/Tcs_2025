import { ChevronLeft, ChevronRight, Eye, History, ImageIcon, Loader2, PlusCircle, Search, User, Wallet, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BASEURL } from '../Component/API/Url';

const ExpensePanel = () => {
  // Existing States
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ total_added: 0, total_expenses: 0, current_balance: 0 });
  const [formData, setFormData] = useState({ 
    name: '', 
    amount: '', 
    remark: '', 
    type: 'debit', 
    employee_id: null 
  });
  
  const [employees, setEmployees] = useState([]);
  const [isEmpLoading, setIsEmpLoading] = useState(false);
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- NEW STATES FOR SPECIFIC EMPLOYEE SEARCH ---
  const [historySearch, setHistorySearch] = useState('');
  const [historyEmployees, setHistoryEmployees] = useState([]);
  const [selectedEmpForHistory, setSelectedEmpForHistory] = useState(null);
  const [empTransactions, setEmpTransactions] = useState([]);
  const [empBalance, setEmpBalance] = useState(0);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const API_URL = `${BASEURL}/api/transactions`;
  const EMP_API = `${BASEURL}/api/employees/list`;
  const WALLET_API = `${BASEURL}/api/Wallet/employee-history`;
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, search]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/GetAllTransaction?page=${currentPage}&limit=10&search=${search}`);
      const result = await response.json();
      if (result.success) {
        setTransactions(result.data);
        setSummary(result.summary);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) { console.error("Error fetching transactions:", error); }
  };

  // Generic employee search function used for both Form and History sections
  const fetchEmployees = async (val, setter) => {
    if (!val) { setter([]); return; }
    setIsEmpLoading(true);
    try {
      const response = await fetch(`${EMP_API}?page=1&limit=5&search=${val}`);
      const result = await response.json();
      if (result.success) {
        setter(result.employees);
      }
    } catch (error) { console.error(error); }
    finally { setIsEmpLoading(false); }
  };

  // --- NEW: FETCH EMPLOYEE SPECIFIC HISTORY ---
  const fetchEmployeeHistory = async (empId) => {
    setIsHistoryLoading(true);
    try {
      const response = await fetch(`${WALLET_API}/${empId}`);
      const result = await response.json();
      if (result.success) {
        setEmpTransactions(result.data);
        setEmpBalance(result.current_balance);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const selectEmployeeForHistory = (emp) => {
    setSelectedEmpForHistory(emp);
    setHistorySearch(emp.name);
    setHistoryEmployees([]);
    fetchEmployeeHistory(emp.id);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, name: val, employee_id: null });
    fetchEmployees(val, setEmployees);
    setShowEmpDropdown(true);
  };

  const selectEmployee = (emp) => {
    setFormData({ ...formData, name: emp.name, employee_id: emp.id });
    setShowEmpDropdown(false);
  };

  const validateForm = () => {
    const enteredAmount = Number(formData.amount);
    const currentStockBalance = Number(summary.current_balance);
    if (!formData.name.trim()) { alert("Please enter a name."); return false; }
    if (enteredAmount <= 0) { alert("Amount must be > 0."); return false; }
    if (formData.type === 'debit' && enteredAmount > currentStockBalance) {
        alert(`Insufficient Balance! Stock is ₹${currentStockBalance.toLocaleString()}`);
        return false;
    }
    return true;
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await fetch(`${API_URL}/createTransaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setCurrentPage(1);
        fetchTransactions();
        setFormData({ name: '', amount: '', remark: '', type: 'debit', employee_id: null });
        setShowEmpDropdown(false);
      }
    } catch (error) { console.error("Error saving:", error); }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1F3A93] mb-6">Expense & Stock Management</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                <p className="text-sm text-gray-500 uppercase font-bold text-[10px]">Main Balance</p>
                <p className="text-3xl font-black text-blue-900">₹{Number(summary.current_balance).toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <p className="text-sm text-gray-500 uppercase font-bold text-[10px]">Total Added</p>
                <p className="text-2xl font-bold text-green-600">₹{Number(summary.total_added).toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                <p className="text-sm text-gray-500 uppercase font-bold text-[10px]">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">₹{Number(summary.total_expenses).toLocaleString()}</p>
            </div>
        </div>

        {/* --- NEW SECTION: INDIVIDUAL EMPLOYEE SPEND LIST --- */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
                <Wallet size={20}/> Check Individual Employee Spend List
            </h2>
            <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search employee to see their history..."
                        className="pl-10 pr-4 py-2.5 border rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500"
                        value={historySearch}
                        onChange={(e) => {
                            setHistorySearch(e.target.value);
                            fetchEmployees(e.target.value, setHistoryEmployees);
                        }}
                    />
                    {historyEmployees.length > 0 && (
                        <div className="absolute z-50 w-full bg-white border rounded-md shadow-2xl mt-1 overflow-hidden">
                            {historyEmployees.map(emp => (
                                <div key={emp.id} onClick={() => selectEmployeeForHistory(emp)} className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <User size={16}/>
                                    </div>
                                    <span className="text-sm font-medium">{emp.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {selectedEmpForHistory && (
                    <div className="flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-blue-500">Current Wallet Balance</p>
                            <p className="text-lg font-black text-blue-900">₹{Number(empBalance).toLocaleString()}</p>
                        </div>
                        <button onClick={() => {setSelectedEmpForHistory(null); setHistorySearch(''); setEmpTransactions([]);}} className="text-red-500 hover:bg-red-50 p-1 rounded-full">
                            <X size={20}/>
                        </button>
                    </div>
                )}
            </div>

            {selectedEmpForHistory && (
                <div className="mt-6 border rounded-xl overflow-hidden animate-in fade-in duration-500">
                    <table className="w-full text-left">
                        <thead className="bg-blue-900 text-white text-[10px] uppercase font-bold">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Remark/Note</th>
                      <th className="px-6 py-3">Payment Images</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                       <tbody className="divide-y divide-gray-100">
    {isHistoryLoading ? (
        <tr><td colSpan="4" className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-500"/></td></tr>
    ) : empTransactions.length > 0 ? (
        empTransactions.map((et) => (
            <tr key={et.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(et.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {et.note}
                </td>
                <td className="px-6 py-4 text-center">
                    {et.bill_url ? (
                        <button 
                            onClick={() => setPreviewImage(et.bill_url)}
                            className="text-[10px] bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full text-blue-700 font-bold flex items-center gap-1 transition"
                        >
                            <Eye size={12}/> VIEW BILL
                        </button>
                    ) : (
                        <span className="text-gray-300 text-[10px]">NO ATTACHMENT</span>
                    )}
                </td>
                <td className={`px-6 py-4 text-right font-bold ${et.type === 'DEBIT' ? 'text-red-600' : 'text-green-600'}`}>
                    {et.type === 'DEBIT' ? '-' : '+'}₹{Number(et.amount).toLocaleString()}
                </td>
            </tr>
        ))
    ) : (
        <tr><td colSpan="4" className="text-center py-10 text-gray-400">No transactions found.</td></tr>
    )}
</tbody>
                    </table>
                </div>
            )}
        </div>
{/* --- IMAGE MODAL OVERLAY --- */}
{previewImage && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <span className="font-bold text-gray-700 flex items-center gap-2">
                    <ImageIcon size={18} className="text-blue-600"/> Payment Bill Preview
                </span>
                <button 
                    onClick={() => setPreviewImage(null)}
                    className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
                >
                    <X size={24}/>
                </button>
            </div>
            
            {/* Image Container */}
            <div className="p-2 bg-gray-200 flex justify-center overflow-auto max-h-[80vh]">
                <img 
                    src={previewImage} 
                    alt="Transaction Bill" 
                    className="max-w-full h-auto rounded-lg shadow-lg border-2 border-white" 
                />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white flex justify-center">
                <a 
                    href={previewImage} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-600 font-bold text-sm hover:underline"
                >
                    Open Original in New Tab
                </a>
            </div>
        </div>
    </div>
)}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Entry Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit relative">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><PlusCircle size={20}/> New Entry</h2>
            <form onSubmit={handleAddEntry} className="space-y-4">
                <select className="w-full p-2 border rounded-md" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="debit">Expense (Debit)</option>
                    <option value="credit">Stock/Add (Credit)</option>
                </select>

                <div className="relative">
                    <label className="text-xs font-bold text-gray-400">Recipient / Name</label>
                    <input 
                        type="text" 
                        placeholder="Search employee or type name..." 
                        required 
                        className={`w-full p-2 border rounded-md outline-none focus:ring-2 ${formData.employee_id ? 'border-green-500 ring-green-200' : 'focus:ring-blue-500'}`}
                        value={formData.name} 
                        onChange={handleNameChange}
                        onBlur={() => setTimeout(() => setShowEmpDropdown(false), 200)}
                    />
                    
                    {showEmpDropdown && employees.length > 0 && (
                        <div className="absolute z-50 w-full bg-white border rounded-md shadow-2xl mt-1 max-h-48 overflow-y-auto">
                            {employees.map((emp) => (
                                <div key={emp.id} onClick={() => selectEmployee(emp)} className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b">
                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden text-gray-500">
                                        <User size={14}/>
                                    </div>
                                    <span className="text-sm font-medium">{emp.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <input type="number" placeholder="Amount (₹)" required className="w-full p-2 border rounded-md" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                <textarea placeholder="Remark" className="w-full p-2 border rounded-md text-sm" rows="2" value={formData.remark} onChange={(e) => setFormData({...formData, remark: e.target.value})} />
                
                <button type="submit" className="w-full bg-[#1F3A93] text-white py-2.5 rounded-md font-semibold hover:bg-blue-800 transition">
                    Save Transaction
                </button>
            </form>
          </div>

          {/* Main Admin History Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2"><History size={20}/> Admin Ledger</h2>
              <div className="relative w-48 md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  type="text" placeholder="Search ledger..." 
                  className="pl-9 pr-4 py-2 border rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                            {t.employee_id && <div className="w-2 h-2 rounded-full bg-green-500" title="Employee Linked"></div>}
                            {t.name}
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'credit' ? '+' : '-'}₹{Number(t.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t flex items-center justify-between bg-gray-50">
                <span className="text-xs text-gray-500">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="p-1 border rounded hover:bg-white disabled:opacity-30"><ChevronLeft size={18}/></button>
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="p-1 border rounded hover:bg-white disabled:opacity-30"><ChevronRight size={18}/></button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePanel;