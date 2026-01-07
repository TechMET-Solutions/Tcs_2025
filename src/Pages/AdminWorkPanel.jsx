import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Clock, CheckCircle2, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export const AdminWorkPanel = () => {
  // Form State
  const [task, setTask] = useState({ employeeId: '', title: '', description: '' });
  
  // API Data States
  const [employees, setEmployees] = useState([]);
  const [allTasks, setAllTasks] = useState([]); // Now storing real data
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);

  // 1. Fetch Employees for the Dropdown
  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/employees/list?page=${page}&limit=10`);
      if (response.data.success) {
        setEmployees(response.data.employees);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch All Assigned Tasks for the Table
  const fetchAllTasks = async () => {
    setTaskLoading(true);
    try {
      // Endpoint created in previous step
      const response = await axios.get(`http://localhost:5000/api/tasks/all`);
      if (response.data.success) {
        setAllTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setTaskLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(pagination.currentPage);
    fetchAllTasks();
  }, [pagination.currentPage]);

  // 3. Handle Assign Task (POST API)
  const handleAssignTask = async () => {
    if (!task.employeeId || !task.title) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/tasks/assign`, {
        employeeId: task.employeeId,
        title: task.title,
        description: task.description
      });

      if (response.data.success) {
        alert("Task assigned successfully!");
        // Add new task to the top of the list locally so we don't have to refresh
        setAllTasks([response.data.task, ...allTasks]);
        // Reset form
        setTask({ employeeId: '', title: '', description: '' });
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Failed to assign task");
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. ASSIGNMENT FORM */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Send size={20} /></div>
            <h3 className="text-xl font-black text-slate-800">Assign New Task</h3>
          </div>
          {loading && <Loader2 size={20} className="animate-spin text-slate-400" />}
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Employee</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
              value={task.employeeId}
              onChange={(e) => setTask({...task, employeeId: e.target.value})}
            >
              <option value="">Choose Employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Headline</label>
            <input 
              type="text" 
              value={task.title}
              placeholder="e.g. Follow up with Dubai Client"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setTask({...task, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Specific Instructions</label>
            <textarea 
              rows="3"
              value={task.description}
              placeholder="Provide detailed instructions here..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setTask({...task, description: e.target.value})}
            />
          </div>
          
          <div className="md:col-span-2 flex justify-end">
            <button 
              onClick={handleAssignTask}
              disabled={!task.employeeId || !task.title}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-600 disabled:bg-slate-300 transition-all shadow-lg flex items-center gap-2 uppercase text-xs tracking-widest"
            >
              Assign Task <Send size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. TASK MONITORING LIST */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <h3 className="text-xl font-black text-slate-800">Assigned Tasks Overview</h3>
             {taskLoading && <Loader2 size={16} className="animate-spin text-blue-500" />}
          </div>
          <button onClick={fetchAllTasks} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Refresh List</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Task Title</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Employee Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allTasks.length > 0 ? allTasks.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                        {item.empName ? item.empName.split(' ').map(n => n[0]).join('') : '?'}
                      </div>
                      <span className="font-bold text-slate-700">{item.empName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-600 font-medium text-sm">{item.title}</td>
                  <td className="px-8 py-5">
                    <div className={`flex items-center gap-1.5 font-black text-[10px] uppercase ${
                      item.status === 'done' ? 'text-green-500' : 'text-amber-500'
                    }`}>
                      {item.status === 'done' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-start gap-2 max-w-xs">
                      <MessageSquare size={14} className="text-slate-300 mt-1 flex-shrink-0" />
                      <p className="text-xs text-slate-500 italic truncate" title={item.remark}>
                        {item.remark || "No remark yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                   <td colSpan="4" className="text-center py-10 text-slate-400 font-bold">No tasks assigned yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};