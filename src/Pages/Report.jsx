import React, { useState } from 'react';
import { 
  Download, Users, FileSpreadsheet, Wallet, 
  Truck, ShoppingBag, UserCheck, CalendarDays 
} from 'lucide-react';

const Report = () => {
  // Common Styles
  const cardStyle = "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between";
  const selectStyle = "bg-gray-50 border border-gray-200 text-gray-700 text-[12px] rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-1.5 outline-none";
  const iconBox = "p-2 bg-orange-50 rounded-lg text-orange-600";

  // Reusable Filter Component for each section
  const SectionFilters = ({ showDate = false }) => (
    <div className="flex flex-wrap gap-2 mb-4">
      {showDate && (
        <input type="date" className={selectStyle} />
      )}
      <select className={selectStyle}>
        <option>Month</option>
        <option value="1">Jan</option>
        <option value="2">Feb</option>
      </select>
      <select className={selectStyle}>
        <option>Year</option>
        <option>2026</option>
        <option>2025</option>
      </select>
      <button className="ml-auto p-2 text-orange-600 hover:bg-orange-50 rounded-full transition-colors" title="Export Section">
        <Download size={18} />
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-[#f4f7fe] min-h-screen font-sans">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Advanced Analytics</h1>
        <p className="text-gray-500 text-sm">Detailed reports for The Ceramic Studio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Monthly Customer Register */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className={iconBox}><Users size={20} /></div>
            <h3 className="font-bold text-slate-700">Customer Register</h3>
          </div>
          <SectionFilters />
          <div className="mt-2">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold text-slate-800">124</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">New Signups</p>
              </div>
              <span className="text-green-500 text-xs font-bold">+12% ↑</span>
            </div>
          </div>
        </div>

        {/* 2. Quotation Data */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className={iconBox}><FileSpreadsheet size={20} /></div>
            <h3 className="font-bold text-slate-700">Quotation Data</h3>
          </div>
          <SectionFilters />
          <div className="space-y-2 mt-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Total Generated:</span><span className="font-semibold">45</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Est. Value:</span><span className="font-semibold text-orange-600">₹8.4L</span></div>
          </div>
        </div>

        {/* 3. Employee Attendance */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className={iconBox}><UserCheck size={20} /></div>
            <h3 className="font-bold text-slate-700">Employee Attendance</h3>
          </div>
          <div className="mb-3">
             <select className="w-full p-1.5 bg-slate-800 text-white rounded-lg text-xs outline-none mb-3">
                <option>Pritesh Pawar</option>
                <option>Nilesh Pathak</option>
             </select>
             <SectionFilters showDate={true} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
             <div className="bg-green-50 p-2 rounded-lg text-green-700 font-bold text-sm">Present: 22</div>
             <div className="bg-red-50 p-2 rounded-lg text-red-700 font-bold text-sm">Absent: 01</div>
          </div>
        </div>

        {/* 4. Purchase Records */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className={iconBox}><ShoppingBag size={20} /></div>
            <h3 className="font-bold text-slate-700">Purchase Records</h3>
          </div>
          <SectionFilters />
          <div className="mt-2 p-3 bg-gray-50 rounded-xl border-l-4 border-orange-500">
            <p className="text-xs text-gray-500">Total Procurement</p>
            <p className="text-xl font-bold text-slate-800">₹3,45,000</p>
          </div>
        </div>

        {/* 5. Delivery Challan */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className={iconBox}><Truck size={20} /></div>
            <h3 className="font-bold text-slate-700">Delivery Challan</h3>
          </div>
          <SectionFilters showDate={true} />
          <div className="flex gap-4 mt-2">
            <div className="flex-1 text-center border-r">
                <p className="text-lg font-bold text-blue-600">12</p>
                <p className="text-[10px] text-gray-400 uppercase">Shipped</p>
            </div>
            <div className="flex-1 text-center">
                <p className="text-lg font-bold text-green-600">38</p>
                <p className="text-[10px] text-gray-400 uppercase">Delivered</p>
            </div>
          </div>
        </div>

        {/* 6. Payment Report */}
        <div className={cardStyle}>
          <div className="flex items-center gap-3 mb-4">
            <div className={iconBox}><Wallet size={20} /></div>
            <h3 className="font-bold text-slate-700">Payment Report</h3>
          </div>
          <SectionFilters />
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white shadow-md">
             <div className="flex justify-between items-center opacity-70 text-[10px] uppercase tracking-widest mb-1">
                <span>Monthly Collection</span>
                <CalendarDays size={14} />
             </div>
             <p className="text-2xl font-bold text-orange-400">₹18,50,000</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Report;