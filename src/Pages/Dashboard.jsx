import {
  BarChart3,
  ShoppingCart,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  IndianRupee,
} from "lucide-react";

import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  // SAMPLE DATA (Replace Later with API)
  const salesData = [
    { month: "Jan", sales: 52000, purchase: 31000 },
    { month: "Feb", sales: 68000, purchase: 42000 },
    { month: "Mar", sales: 74000, purchase: 39000 },
    { month: "Apr", sales: 81000, purchase: 52000 },
  ];

  const dailyReport = [
    { day: "Mon", in: 5000, out: 3000 },
    { day: "Tue", in: 6000, out: 2000 },
    { day: "Wed", in: 4500, out: 2500 },
    { day: "Thu", in: 7000, out: 4000 },
    { day: "Fri", in: 8000, out: 3000 },
  ];

  const [cards] = useState([
    {
      title: "Monthly Sales",
      value: "₹1,50,000",
      icon: <ShoppingCart size={28} className="text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Monthly Purchase",
      value: "₹82,000",
      icon: <CreditCard size={28} className="text-purple-600" />,
      color: "bg-purple-100",
    },
    {
      title: "Profit / Loss",
      value: "+ ₹68,000",
      icon: <TrendingUp size={28} className="text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Daily Expenses",
      value: "₹4,200",
      icon: <Receipt size={28} className="text-red-600" />,
      color: "bg-red-100",
    },
    {
      title: "Cash In / Out Today",
      value: "₹12,500 / ₹6,000",
      icon: <ArrowUpCircle size={28} className="text-green-500" />,
      color: "bg-green-50",
    },
    {
      title: "Cash Balance",
      value: "₹3,85,000",
      icon: <Wallet size={28} className="text-orange-600" />,
      color: "bg-orange-100",
    },
  ]);

  return (
    <div className="p-6">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>

      {/* TOP STAT CARDS */}
      <div className="grid grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} p-5 rounded-xl shadow-md hover:shadow-xl transition-all`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">{card.title}</p>
                <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
              </div>
              <div>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* GRAPH SECTION */}
      <div className="grid grid-cols-2 gap-6 mt-10">

        {/* SALES VS PURCHASE GRAPH */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 /> Monthly Sales & Purchase Report
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="sales" fill="#2563EB" radius={5} />
              <Bar dataKey="purchase" fill="#9333EA" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DAILY CASH FLOW GRAPH */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <IndianRupee /> Daily Cash In / Out
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyReport}>
              <XAxis dataKey="day" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line type="monotone" dataKey="in" stroke="#16A34A" strokeWidth={3} />
              <Line type="monotone" dataKey="out" stroke="#DC2626" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PROFIT CARD */}
      <div className="mt-10 bg-gradient-to-r from-green-500 to-green-700 p-7 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp size={28} /> Profit Summary
        </h2>
        <p className="mt-2 text-lg opacity-90">Current Month Profit: <span className="font-bold">₹68,000</span></p>
      </div>

    </div>
  );
}
