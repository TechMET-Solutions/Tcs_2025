import axios from 'axios';
import { CheckCircle2, Circle, ClipboardList, Loader2, Plus, Tag, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BASEURL } from '../Component/API/Url';
import { useAuth } from '../utils/AuthContext';

const API_URL_Post = `${BASEURL}/api/todo/CreateTodo`;
const API_URL_GET = `${BASEURL}/api/todo/getTodo`;
const API_URL_DeleteT = `${BASEURL}/api/todo/Delete`;
const API_URL_UpdateStatus = `${BASEURL}/api/todo/status`;


const TodoComponent = ({ section = "General", employeeId = 1 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { permissions, user, role } = useAuth();
  
  const fetchTodos = async () => {
    // debugger
    setLoading(true);
    try {
      const res = await axios.get(API_URL_GET, { params: { role: role, section } });
      setTodos(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { if (isOpen) fetchTodos(); }, [isOpen, section]);

  const handleAddTodo = async (e) => {
    
    e.preventDefault();
    if (!newTask.trim()) return;
    setIsSubmitting(true);
    try {
      const payload = { title: newTask, section, userId: user.id, role: role };
      const res = await axios.post(API_URL_Post, payload);
      setTodos([res.data, ...todos]);
      setNewTask('');
      fetchTodos()
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL_DeleteT}/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) { console.error(err); }
  };

  const toggleStatus = async (todo) => {
    const newStatus = todo.status === "done" ? "pending" : "done";

    try {
      await axios.put(`${API_URL_UpdateStatus}/${todo.id}`, {
        status: newStatus,
      });

      setTodos(
        todos.map(t =>
          t.id === todo.id ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center gap-2">
        <ClipboardList size={16} /> To-Do: {section}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden border border-slate-100">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase"><Tag size={12} /> {section}</div>
                <h2 className="text-2xl font-black uppercase">Todo List</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="bg-white/10 p-3 rounded-2xl"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddTodo} className="p-6 border-b bg-slate-50 flex gap-3">
              <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New task..." className="flex-1 px-5 py-4 rounded-2xl border outline-none focus:border-indigo-500" />
              <button disabled={isSubmitting} className="bg-slate-900 text-white px-6 rounded-2xl">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={24} />}
              </button>
            </form>

            <div className="max-h-[400px] overflow-y-auto p-6 space-y-4">
              {loading ? <Loader2 className="animate-spin mx-auto" /> :
                todos.map((todo) => (
                  <div key={todo.id} className="flex items-center justify-between p-5 rounded-[24px] border border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleStatus(todo)}>
                      {todo.status === 'done'
                        ? <CheckCircle2 className="text-emerald-500" />
                        : <Circle className="text-slate-300" />
                      }
                      <span className={`font-bold ${todo.status === "done" ? "line-through text-slate-400" : "text-slate-700"}`}>
                        {todo.title}
                      </span>
                    </div>

                    <button onClick={() => handleDelete(todo.id)} className="text-rose-500"><Trash2 size={18} /></button>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoComponent;