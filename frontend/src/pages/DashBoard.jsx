import { useState, useEffect } from 'react';
import { Combine, Settings, LogOut, Plus, TrendingUp, Receipt, ChevronDown,Users} from 'lucide-react';
import { getDashboardData } from '../Api/auth.api'; 
import { useNavigate } from 'react-router-dom';



export default function DashBoard() {
  const navigate= useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [groups, setGroups] = useState([]); 
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await getDashboardData();        
        setGroups(response.data.data);
        console.log(response.data.data)
        
        
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchAllData();
  }, []); 

  return (
    <div className="min-h-screen bg-[#0A0D14] font-sans text-slate-200 relative">
      
      {/* Background Gradients & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[800px] bg-linear-to-br from-[#6B5AED]/30 via-[#6B5AED]/5 to-transparent blur-[130px]"></div>
        <div className="absolute bottom-[-200px] right-[-100px] w-[800px] h-[800px] bg-[#6B5AED]/20 rounded-full blur-[150px]"></div>
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-[#6B5AED]/10 rounded-full blur-[120px]"></div>
      </div>
      
      {/* Navbar */}
      <nav className="w-full h-20 border-b border-slate-800/60 bg-[#0A0D14]/50 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transform group-hover:-rotate-12 transition-transform duration-300 shadow-[0_0_15px_rgba(107,90,237,0.2)]">
               <Combine className="text-[#0A0D14]" size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tighter hidden sm:block">QUICSPLIT</span>
          </div>

          {/* Right: Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 hover:bg-[#1A1F2E] p-1.5 pr-4 rounded-full border border-slate-800 transition-all active:scale-95 bg-[#121620]"
            >
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover border-[1.5px] border-[#6B5AED]"
              />
              <span className="text-sm font-medium text-slate-200 hidden sm:block">Sarah Connor</span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-[#1A1F2E] border border-slate-700/50 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-slate-800 sm:hidden">
                   <p className="text-sm font-medium text-white">Sarah Connor</p>
                   <p className="text-xs text-slate-500">sarah@example.com</p>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[#252b40] transition-colors mt-1">
                  <Settings size={18} />
                  Settings
                </button>
                <div className="h-px bg-slate-700/50 my-1 mx-4"></div>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors mb-1">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Your Groups</h1>
            <p className="text-slate-400 mt-1 text-sm">Manage expenses and track shared balances.</p>
          </div>
          
          <button className="bg-[#6B5AED] hover:bg-[#5a4add] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all shadow-[0_4px_12px_rgba(107,90,237,0.3)] hover:shadow-[0_6px_16px_rgba(107,90,237,0.4)] active:scale-95">
            <Plus size={20} />
            Create Group
          </button>
        </div>

        {/* Groups Grid */}
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups?.map((group) => (
              <div 
                key={group._id} 
                onClick={()=>navigate(`/groups/${group._id}`)}
                className="bg-[#1A1F2E]/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 hover:border-[#6B5AED]/50 hover:bg-[#1A1F2E]/90 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(107,90,237,0.15)]">
                {/* Card Top */}

                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center text-3xl group-hover:bg-[#6B5AED]/20 group-hover:scale-105 transition-all">
                      {group.grpName} {/* TENTATIVE HAI */}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-[#8879FF] transition-colors">{group.grpName}</h3>
                      <p className="text-sm text-slate-400 mt-0.5">Updated recently</p>
                    </div>
                  </div>
                </div>

                {/* Card Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#0A0D14]/50 rounded-xl p-4 border border-slate-800/50">
                    <p className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                      <Receipt size={14} className="text-slate-500"/> Total Expenses
                    </p>
                    <p className="text-[#8879FF] font-semibold text-lg">{group.totalSpent}</p>
                  </div>
                  <div className="bg-[#0A0D14]/50 rounded-xl p-4 border border-slate-800/50">
                    <p className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-slate-500"/> My Balance
                    </p>
                    <p className={`font-semibold text-lg ${
                      group.myBalance < 0 ? 'text-red-400' : 
                      group.myBalance > 0 ? 'text-green-400' : 
                      'text-slate-300'
                    }`}>
                      {group.myBalance < 0 ? `You owe ₹${Math.abs(group.myBalance)}` : 
                       group.myBalance > 0 ? `Owed ₹${group.myBalance}` : 
                       'Settled up'}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Avatars */}
                <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-800/50">
                  <div className="flex -space-x-3 hover:space-x-0 transition-all duration-300">
                    {/* {group.members.slice(0, 3).map((member, idx) => (
                      <img 
                        key={idx} 
                        src={member} 
                        className="w-9 h-9 rounded-full border-2 border-[#1A1F2E] object-cover hover:z-10 hover:scale-110 transition-transform" 
                        alt="Member avatar"
                      />
                    ))} */}
                    {group.memberCount > 3 && (
                      <div className="w-9 h-9 rounded-full border-2 border-[#1A1F2E] bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-300 z-10">
                        +{group.memberCount - 3}
                      </div>
                    )}
                  </div>
                  <button className="text-sm font-medium text-[#6B5AED] group-hover:text-[#8879FF] transition-colors flex items-center gap-1">
                    Details <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : 
        
        (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-[#1A1F2E]/30 backdrop-blur-sm border border-slate-800/50 rounded-3xl border-dashed">
            <div className="w-24 h-24 bg-[#6B5AED]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(107,90,237,0.15)] relative">
              <Users size={40} className="text-[#6B5AED]" />
              <div className="absolute top-0 right-0 w-6 h-6 bg-[#0A0D14] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-[#6B5AED] rounded-full animate-ping"></div>
                <div className="w-4 h-4 bg-[#6B5AED] rounded-full absolute"></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">No groups yet</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
              Create a group to start splitting bills securely, or ask a friend to add you to their existing group.
            </p>
             
              <button //////////////////////////////////////NEW GROUP MODAL, TO BE MADE///////////////////////////////////////////////////////////////////////
              onClick={() => {}} 
              className="bg-[#6B5AED] hover:bg-[#5a4add] text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-[0_4px_12px_rgba(107,90,237,0.3)] hover:shadow-[0_6px_16px_rgba(107,90,237,0.4)] active:scale-95">
              <Plus size={22} />
              Create your first group
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
