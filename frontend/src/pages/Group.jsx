import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import StatCards from '../components/group/StatCards';
import ExpenseList from '../components/group/ExpenseList';
import SettlementList from '../components/group/SettlementList';
import AiChat from '../components/group/AiChat';

export default function Group({expenses,transactions,balances,loading}) {
  const [activeTab, setActiveTab] = useState('expenses');

  return (
    <div className="min-h-screen bg-[#0A0D14] font-sans text-slate-200 relative">
      
      {/* Using the consistent aesthetic background established previously */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[800px] bg-linear-to-br from-[#6B5AED]/20 via-[#6B5AED]/5 to-transparent blur-[130px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-10 relative z-10 w-full">
        {/* Core Container matching the screenshot */}
        <div className="bg-[#12141a]/95 backdrop-blur-2xl border border-slate-800/80 rounded-4xl p-4 sm:p-8 md:p-10 shadow-2xl">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors">
                <ArrowLeft size={18} />
                <span className="text-base font-medium">groups</span>
              </button>
              
              <div className="w-px h-6 bg-slate-700/60 hidden sm:block"></div>
              
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight break-all">Goa Trip</h1>
              
              <div className="flex -space-x-2 ml-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 border-[1.5px] border-[#12141a] flex items-center justify-center text-xs font-semibold z-40">RK</div>
                <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 border-[1.5px] border-[#12141a] flex items-center justify-center text-xs font-semibold z-30">HS</div>
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-300 border-[1.5px] border-[#12141a] flex items-center justify-center text-xs font-semibold z-20">PR</div>
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 border-[1.5px] border-[#12141a] flex items-center justify-center text-xs font-semibold z-10">KM</div>
              </div>
            </div>

            <button className="w-full sm:w-auto px-5 py-2.5 border border-slate-700/80 rounded-full hover:bg-white/10 text-slate-200 text-sm font-medium transition-colors">
              + invite
            </button>
          </div>

          <StatCards expenses={expenses} transactions={transactions} balances={balances} />

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 mb-8 border-b border-slate-800/80 pb-6 overflow-x-auto">
            {['expenses', 'settlements', 'ai chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-6 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border border-slate-500 text-white bg-white/5' 
                    : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Rendering */}
          <div className="min-h-[400px]">
             {activeTab === 'expenses' && <ExpenseList />}
             {activeTab === 'settlements' && <SettlementList transactions={transactions} />}
             {activeTab === 'ai chat' && <AiChat />}
          </div>

        </div>
      </div>
    </div>
  );
}
