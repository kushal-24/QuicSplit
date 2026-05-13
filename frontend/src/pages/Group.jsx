import React, { useState } from 'react';
import { ArrowLeft, Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Context/Theme.Context';
import GroupSettingsModal from '../components/group/GroupSettingsModal';
import StatCards from '../components/group/StatCards';
import ExpenseList from '../components/group/ExpenseList';
import SettlementList from '../components/group/SettlementList';
import AiChat from '../components/group/AiChat';
import { useAuth } from '../Context/Auth.Context';
import { createSettlement } from '../Api/group.api';

export default function Group({groupId,expenses,transactions,balances,loading, onFetchGroupData, groupData, totalSpent}) {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('expenses');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { user }= useAuth();
  
  const myBalance = balances[user._id.toString()] || 0;

  const markSettledHandler= async(settlement)=>{
    //if user is neither from nor to, then skip
    if(settlement.from._id !== user._id && settlement.to._id !== user._id){
      return;
    }
    const newSettlement={
      group: groupId,
      from: settlement.from._id,
      to: settlement.to._id,
      amount: settlement.amount,
    }
    const res = await createSettlement(groupId, newSettlement);
    await onFetchGroupData();
    console.log("RES", res);
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0A0D14]' : 'bg-[#F8FAFC]'} font-sans text-slate-700 dark:text-slate-200 relative transition-colors duration-300`}>
      
      {/* Background Aesthetic */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'} bg-[size:40px_40px]`}></div>
        <div className={`absolute top-0 left-0 right-0 h-[800px] ${isDarkMode ? 'bg-linear-to-br from-[#6B5AED]/20 via-[#6B5AED]/5 to-transparent' : 'bg-linear-to-br from-[#6B5AED]/10 via-[#6B5AED]/5 to-transparent'} blur-[130px]`}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 relative z-10 w-full animate-page-enter">
        {/* Core Container */}
        <div className="bg-white/90 dark:bg-[#12141a]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/80 rounded-4xl p-5 shadow-2xl transition-colors">
          
          {/* Header Section */}
          <div className="flex flex-col gap-6 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800/80">
            {/* Top Row: Navigation and Members */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#6B5AED] dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft size={18} />
                <span className="text-base font-medium">Groups</span>
              </button>
              
              <div className="flex -space-x-2">
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

            {/* Middle Row: Group Title */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
                {groupData.grpName}
              </h1>
            </div>
          </div>

          <StatCards 
            expenses={expenses} 
            transactions={transactions} 
            balances={balances} 
            totalSpent={totalSpent} 
            myBalance={myBalance} 
          />

          {/* Navigation Tabs */}
          <div className="flex items-center gap-3 mb-8 border-b border-slate-200 dark:border-slate-800/80 pb-6 overflow-x-auto transition-colors">
            {['expenses', 'settlements', 'ai chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab 
                    ? 'border-2 border-[#6B5AED] text-[#6B5AED] bg-[#6B5AED]/5 dark:bg-[#6B5AED]/10' 
                    : 'border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-[#6B5AED] dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Rendering */}
          <div className="min-h-[400px]">
             {activeTab === 'expenses' && <ExpenseList expenses={expenses} groupData={groupData} />}
              {activeTab === 'settlements' && <SettlementList transactions={transactions} onSettle={markSettledHandler} />}
             {activeTab === 'ai chat' && <AiChat 
             groupId={groupId}
             onFetchGroupData={onFetchGroupData} />}
          </div>

        </div>
      </div>
      
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
