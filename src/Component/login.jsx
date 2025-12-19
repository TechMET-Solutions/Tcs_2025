import { useState } from "react";

import { saveAuth } from "../utils/auth";
import { loginAPI } from "./API/authApi";

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

                // 🔀 REDIRECT BASED ON ROLE
                if (res.role === "admin") {
                    window.location.href = "/";
                } else {
                    window.location.href = "/employee/dashboard";
                }
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F6F3EE]">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Employee Login
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@gmail.com"
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-6">
                    Admin: admin@gmail.com / 123
                </p>
            </div>
        </div>
    );
}
