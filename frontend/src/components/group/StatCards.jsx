import React from 'react';

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-[#1A1F2E]/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 lg:p-5 shadow-lg">
        <p className="text-slate-400 text-sm font-medium mb-1.5">total spent</p>
        <p className="text-2xl lg:text-3xl font-bold text-white tracking-tight">₹4,200</p>
      </div>
      <div className="bg-[#1A1F2E]/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 lg:p-5 shadow-lg">
        <p className="text-slate-400 text-sm font-medium mb-1.5">you owe</p>
        <p className="text-2xl lg:text-3xl font-bold text-red-400 tracking-tight">₹50</p>
      </div>
      <div className="bg-[#1A1F2E]/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 lg:p-5 shadow-lg">
        <p className="text-slate-400 text-sm font-medium mb-1.5">settlements left</p>
        <p className="text-2xl lg:text-3xl font-bold text-white tracking-tight">2</p>
      </div>
      <div className="bg-[#1A1F2E]/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-4 lg:p-5 shadow-lg">
        <p className="text-slate-400 text-sm font-medium mb-1.5">members</p>
        <p className="text-2xl lg:text-3xl font-bold text-white tracking-tight">4</p>
      </div>
    </div>
  );
}
