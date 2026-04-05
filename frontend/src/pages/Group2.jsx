import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MessageSquare, X } from 'lucide-react';
import ExpenseCard from '../components/group/ExpenseCard';
import AiChat from '../components/group/AiChat';

const MOCK_EXPENSES = [
  { id: 1, title: 'Hotel booking', paidBy: 'Raj', date: '12 Jan', subtitle: '', amount: '2,000', myShare: '500', type: 'owe' },
  { id: 2, title: 'Dinner at Thalassa', paidBy: 'Harsh', date: '13 Jan', subtitle: '', amount: '1,200', myShare: '300', type: 'owe' },
  { id: 3, title: 'Scooter rentals', paidBy: 'You', date: '14 Jan', subtitle: '', amount: '1,000', myShare: '750', type: 'get' },
];

const MOCK_SETTLEMENTS = [
  { id: 1, from: 'You', to: 'Raj', amount: '50' },
  { id: 2, from: 'Priya', to: 'Harsh', amount: '300' },
];

export default function Group2() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0D14] font-sans text-slate-200 relative flex flex-col p-4 md:p-6 h-screen overflow-hidden">
      
      {/* Background Aesthetic */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[800px] bg-linear-to-br from-[#6B5AED]/20 via-[#6B5AED]/5 to-transparent blur-[130px]"></div>
      </div>

      {/* Main OS-style App Window */}
      <div className="bg-[#12141a]/95 backdrop-blur-2xl border border-slate-800/80 rounded-4xl flex flex-col flex-1 relative z-10 shadow-2xl overflow-hidden w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-[#12141a]">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors">
              <ArrowLeft size={18} />
              <span className="text-base font-medium">groups</span>
            </button>
            <div className="w-px h-6 bg-slate-700/60 hidden sm:block"></div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Goa Trip</h1>
            <div className="flex -space-x-2 ml-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 border-[1.5px] border-[#12141a] flex items-center justify-center text-xs font-semibold z-40">RK</div>
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 border-[1.5px] border-[#12141a] flex items-center justify-center text-xs font-semibold z-30">HS</div>
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-300 border-[1.5px] border-[#12141a] flex items-center justify-center text-xs font-semibold z-20">PR</div>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 border-[1.5px] border-[#12141a] flex items-center justify-center text-xs font-semibold z-10">KM</div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-slate-400 font-medium text-sm">total spent</span>
              <span className="text-white font-bold text-lg">₹4,200</span>
            </div>
            <button className="px-5 py-2 border border-slate-700/80 rounded-full hover:bg-white/10 text-slate-200 text-sm font-medium transition-colors">
              + invite
            </button>
          </div>
        </div>

        {/* Dynamic Split Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Column (Expenses & Settlements) */}
          <div className="w-full lg:w-1/2 xl:w-[55%] flex flex-col border-r border-slate-800/80">
            
            {/* Expenses Section (Individually Scrollable) */}
            <div className="h-1/2 min-h-0 flex flex-col border-b border-slate-800/80">
              <div className="flex items-center justify-between p-6 pb-4">
                <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Expenses</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-transparent hover:bg-white/5 border border-slate-700 rounded-full text-xs font-medium text-slate-300 transition-colors">
                    + add
                  </button>
                  <button className="px-3 py-1 bg-transparent hover:bg-white/5 border border-slate-700 rounded-full text-xs font-medium text-slate-300 transition-colors">
                    upload bill
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                {MOCK_EXPENSES.map(exp => (
                  <ExpenseCard key={exp.id} {...exp} />
                ))}
                
                {/* Net Balance Highlight */}
                <div className="mt-6 p-5 bg-[#1A1F2E]/40 border border-slate-800/80 rounded-2xl">
                  <p className="text-sm text-slate-400 font-medium mb-1">your net balance</p>
                  <p className="text-3xl font-bold text-red-400 tracking-tight">- ₹50 owed</p>
                </div>
              </div>
            </div>

            {/* Settlements Section (Individually Scrollable) */}
            <div className="h-1/2 min-h-0 flex flex-col">
              <div className="p-6 pb-4">
                <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Settlements Needed</h2>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                <div className="space-y-3">
                  {MOCK_SETTLEMENTS.map(settlement => (
                    <div key={settlement.id} className="flex items-center justify-between p-4 bg-[#1A1F2E]/30 border border-slate-800/80 rounded-xl hover:bg-[#1A1F2E]/60 transition-colors">
                      <p className="text-white font-medium text-sm sm:text-base flex items-center">
                        {settlement.from} 
                        <ArrowRight className="mx-2 text-slate-500" size={14}/> 
                        {settlement.to} 
                        <span className="ml-2 font-bold">₹{settlement.amount}</span>
                      </p>
                      <button className="px-3 py-1.5 border border-[#304B3B] text-[#4ADE80] bg-[#4ADE80]/10 rounded-full text-xs font-semibold hover:bg-[#4ADE80]/20 transition-colors">
                        mark settled
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (AI Chat) - Desktop Only */}
          <div className="hidden lg:flex flex-col lg:w-1/2 xl:w-[45%] bg-[#0f1117]">
            <div className="p-6 pb-4">
              <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">AI Assistant</h2>
            </div>
            <div className="flex-1 p-6 pt-0 overflow-hidden">
               <AiChat />
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button for AI Chat on Mobile */}
      <button 
        onClick={() => setIsAiModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-linear-to-r from-[#6B5AED] to-[#8879FF] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(107,90,237,0.5)] text-white z-50 hover:scale-105 active:scale-95 transition-all"
      >
        <MessageSquare size={24} />
      </button>

      {/* AI Chat Modal for Mobile */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#12141a] border border-slate-800 rounded-4xl overflow-hidden flex flex-col h-[85vh] sm:h-[600px] shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
             <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-[#12141a]">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-[#6B5AED]/20 flex items-center justify-center">
                   <MessageSquare size={16} className="text-[#8879FF]"/>
                 </div>
                 <h3 className="font-bold text-slate-200">AI Assistant</h3>
               </div>
               <button 
                 onClick={() => setIsAiModalOpen(false)} 
                 className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
               >
                 <X size={18}/>
               </button>
             </div>
             <div className="flex-1 overflow-hidden p-4 bg-[#0A0D14]/50">
               <AiChat />
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
