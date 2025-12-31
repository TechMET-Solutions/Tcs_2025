import { useState } from "react";
import { saveAuth } from "../utils/auth";
import { loginAPI } from "./API/authApi";
// Optional: Install lucide-react for better icons: npm install lucide-react
import { Loader2, Lock, LogIn, Mail } from "lucide-react";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await loginAPI(form);
            if (res.success) {
                saveAuth(res);
                if (res.role === "admin") {
                    window.location.href = "/";
                } else {
                    window.location.href = "/employee/dashboard";
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl"></div>
            </div>

            <div className="w-full max-w-md z-10">
                {/* Logo or Brand Placeholder */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg mb-4 text-white">
                        <LogIn size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Please enter your details to sign in</p>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                            <p className="font-semibold text-red-800">Login Failed</p>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="admin@gmail.com"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Styled Credentials Box */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Quick Access (Demo)</p>
                            <div className="flex justify-between items-center text-xs text-slate-600">
                                <span><span className="font-medium">User:</span> admin@gmail.com</span>
                                <span><span className="font-medium">Pass:</span> 123</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p className="text-center text-slate-500 text-sm mt-8">
                    Don't have an account? <a href="#" className="text-indigo-600 font-semibold hover:underline">Contact HR</a>
                </p>
            </div>
        </div>
    );
}