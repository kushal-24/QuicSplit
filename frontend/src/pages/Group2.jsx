import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MessageSquare, X } from 'lucide-react';
import ExpenseCard from '../components/group/ExpenseCard';
import AiChat from '../components/group/AiChat';
import { useAuth } from '../Context/Auth.Context';
import { createSettlement } from '../Api/group.api';
import GroupSettingsModal from '../components/group/GroupSettingsModal';
import { Settings as SettingsIcon } from 'lucide-react';
import { PremiumLoader } from '../components/common/LoadingStates';
import { useTheme } from '../Context/Theme.Context';
import { useNavigate } from 'react-router-dom';

export default function Group2({ groupId, expenses, totalSpent, transactions, balances, loading, onFetchGroupData, groupData }) {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { user } = useAuth();

  const myBalance = balances[user._id.toString()] || 0;

  const markSettledHandler = async (settlement) => {
    //if user is neither from nor to, then skip
    if (settlement.from._id !== user._id && settlement.to._id !== user._id) {
      return;
    }
    const newSettlement = {
      group: groupId,
      from: settlement.from._id,
      to: settlement.to._id,
      amount: settlement.amount,
    }
    const res = await createSettlement(groupId, newSettlement);
    await onFetchGroupData();
    devLog("RES", res);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
        <PremiumLoader />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#05050A]' : 'bg-[#F8FAFC]'} font-sans text-slate-700 dark:text-slate-200 relative flex flex-col p-4 md:p-6 h-screen overflow-hidden animate-page-enter transition-colors duration-300`}>

      {/* Background Aesthetic */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'} bg-size-[40px_40px]`}></div>
        <div className={`absolute top-0 left-0 right-0 h-[800px] ${isDarkMode ? 'bg-linear-to-br from-[#6B5AED]/20 via-[#6B5AED]/5 to-transparent' : 'bg-linear-to-br from-[#6B5AED]/10 via-[#6B5AED]/5 to-transparent'} blur-[130px]`}></div>
      </div>

      {/* Main OS-style App Window */}
      <div className="bg-white/90 dark:bg-[#12141a]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 rounded-4xl flex flex-col flex-1 relative z-10 shadow-2xl overflow-hidden w-full max-w-7xl mx-auto transition-colors">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#12141a] transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#6B5AED] dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span className="text-base font-medium">Groups</span>
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700/60 hidden sm:block"></div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{groupData.grpName}</h1>
            <div className="flex -space-x-2 ml-2">
              {groupData.members?.map((member, idx) => {
                const colors = [
                  { bg: 'bg-indigo-500/20', text: 'text-indigo-300' },
                  { bg: 'bg-teal-500/20', text: 'text-teal-300' },
                  { bg: 'bg-orange-500/20', text: 'text-orange-300' },
                  { bg: 'bg-blue-500/20', text: 'text-blue-300' },
                  { bg: 'bg-purple-500/20', text: 'text-purple-300' },
                ];
                const color = colors[idx % colors.length];
                const initials = member.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
                return (
                  <div
                    key={member._id}
                    className={`w-8 h-8 rounded-full ${color.bg} ${color.text} border-[1.5px] border-[#12141a] flex items-center justify-center text-xs font-semibold z-[${50 - idx}]`}
                    title={member.fullName}
                  >
                    {initials}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
              <span className="text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">Total spent</span>
              <span className="text-slate-900 dark:text-white font-bold text-base">₹{Math.round(totalSpent || 0)}</span>
            </div>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2.5 bg-slate-100 dark:bg-[#1A1F2E] border border-slate-200 dark:border-slate-700/80 rounded-full hover:text-[#6B5AED] transition-all cursor-pointer"
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>

        {/* Dynamic Split Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left Column (Expenses & Settlements) */}
          <div className="w-full lg:w-1/2 xl:w-[55%] flex flex-col border-r border-slate-200 dark:border-slate-800/80 transition-colors">

            {/* Expenses Section (Individually Scrollable) */}
            <div className="h-1/2 min-h-0 flex flex-col border-b border-slate-200 dark:border-slate-800/80 transition-colors">
              <div className="flex items-center justify-between p-6 pb-4">
                <h2 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Expenses</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-slate-50 dark:bg-transparent hover:bg-[#6B5AED] hover:text-white border border-slate-200 dark:border-slate-700 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all cursor-pointer">
                    + add expense
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                {expenses ? expenses.map((exp, index) => (
                  <ExpenseCard key={exp.id || index} {...exp} groupData={groupData} index={index} />
                )) : <p>No expenses found</p>}

                {/* Net Balance Highlight */}
                <div className="mt-6 p-5 bg-slate-50 dark:bg-[#1A1F2E]/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl transition-colors">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">your net balance</p>
                  <p className={`text-3xl font-bold tracking-tight ${myBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {myBalance >= 0 ? `+ ₹${Math.round(myBalance)}` : `- ₹${Math.round(Math.abs(myBalance))} owed`}
                  </p>
                </div>
              </div>
            </div>

            {/* Settlements Section (Individually Scrollable) */}
            <div className="h-1/2 min-h-0 flex flex-col">
              <div className="p-6 pb-4">
                <h2 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Settlements Needed</h2>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                <div className="space-y-3">
                  {transactions?.map((settlement, index) => (
                    <div
                      key={index}
                      style={{ animationDelay: `${index * 80}ms` }}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1A1F2E]/30 border border-slate-200 dark:border-slate-800/80 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1A1F2E]/60 transition-colors animate-slide-up opacity-0"
                    >
                      <p className="text-slate-900 dark:text-white font-medium text-sm sm:text-base flex items-center">
                        {settlement.from?.name}
                        <ArrowRight className="mx-2 text-slate-500" size={14} />
                        {settlement.to?.name}
                        <span className="ml-2 font-bold">₹{Math.round(settlement.amount)}</span>
                      </p>
                      <button
                        onClick={() => markSettledHandler(settlement)}
                        className="px-3 py-1.5 border border-emerald-200 dark:border-[#304B3B] text-emerald-600 dark:text-[#4ADE80] bg-emerald-50 dark:bg-[#4ADE80]/10 rounded-full text-xs font-bold hover:bg-emerald-100 dark:hover:bg-[#4ADE80]/20 transition-all cursor-pointer">
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
              <AiChat
                onFetchGroupData={onFetchGroupData}
                groupId={groupId} />
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button for AI Chat on Mobile */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-linear-to-r from-[#6B5AED] to-[#8879FF] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(107,90,237,0.5)] text-white z-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
                  <MessageSquare size={16} className="text-[#8879FF]" />
                </div>
                <h3 className="font-bold text-slate-200">AI Assistant</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4 bg-[#05050A]/50">
              <AiChat groupId={groupId} />
            </div>
          </div>
        </div>
      )}

      {/* Group Settings Modal */}
      <GroupSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        groupData={groupData}
        onUpdate={onFetchGroupData}
      />
    </div>
  );
}
