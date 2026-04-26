import { useState, useEffect } from 'react';
import { Combine, Settings, LogOut, Plus, TrendingUp, Receipt, ChevronDown, Users, X, Search, Camera, Loader2, Check } from 'lucide-react';
import { getDashboardData, getAllUsers } from '../Api/auth.api'; 
import { createGroupApi } from '../Api/group.api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/Auth.Context';
import pfp from "../assets/pfp.jpg"

export default function DashBoard() {
  const navigate= useNavigate();
  const {login, logout, user}= useAuth()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groups, setGroups] = useState([]); 
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await getDashboardData();     
        console.log("RESPONSE", response.data.data);
        setGroups(response.data.data);

      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchAllData();
  }, []); 

  const logoutHandler=async()=>{
    await logout();
    navigate("/login", { replace: true });
  }

  const colors = ["#534AB7", "#0F6E56", "#993C1D", "#185FA5"]

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
              className="flex cursor-pointer items-center gap-3 hover:bg-[#1A1F2E] p-1.5 pr-4 rounded-full border border-slate-800 transition-all active:scale-95 bg-[#121620]"
            >
              <img 
                src={user?.avatar || pfp} 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover border-[1.5px] border-[#6B5AED]"
              />
              <span className="text-sm font-medium text-slate-200 hidden sm:block">{user?.fullName || "Sarah Connor"}</span>
              <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-[#1A1F2E] border border-slate-700/50 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-slate-800 sm:hidden">
                   <p className="text-sm font-medium text-white">{user?.fullName || "Sarah Connor"}</p>
                   <p className="text-xs text-slate-500">{user?.email || "sarah@example.com"}</p>
                </div>
                <button 
                  onClick={() => navigate("/settings")}
                  className="w-full flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[#252b40] transition-colors mt-1"
                >
                  <Settings size={18} />
                  Settings
                </button>
                <div className="h-px bg-slate-700/50 my-1 mx-4"></div>
                <button 
                onClick={logoutHandler}
                className="w-full flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors mb-1">
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
          
          <button 
            onClick={() => setIsGroupModalOpen(true)}
            className="bg-[#6B5AED] cursor-pointer hover:bg-[#5a4add] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all shadow-[0_4px_12px_rgba(107,90,237,0.3)] hover:shadow-[0_6px_16px_rgba(107,90,237,0.4)] active:scale-95"
          >
            <Plus size={20} />
            Create Group
          </button>
        </div>

        {/* Groups Grid */}
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups?.map((group) => {
              const color = colors[group.name.charCodeAt(0) % colors.length]
              const balanceRounded= group.myBalance.toFixed(2)
              return(
              <div 
                key={group._id} 
                onClick={()=>navigate(`/groups/${group._id}`)}
                className="bg-[#1A1F2E]/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 hover:border-[#6B5AED]/50 hover:bg-[#1A1F2E]/90 hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(107,90,237,0.15)]">
                {/* Card Top */}

                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center text-3xl group-hover:bg-[#6B5AED]/20 group-hover:scale-105 transition-all">
                      <div style={{ background: color, borderRadius: 8, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 500, color: '#fff' }}>
                        {group.name[0].toUpperCase()}
                      </div>  
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-[#8879FF] transition-colors">{group.name}</h3>
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
                      balanceRounded > 0 ? 'text-green-400' : 
                      'text-slate-300'
                    }`}>
                      {balanceRounded < 0 ? `You owe ₹${Math.abs(balanceRounded)}` : 
                       balanceRounded > 0 ? `Owed ₹${balanceRounded}` : 
                       'Settled up'}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Avatars */}
                <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-800/50">
                  <div className="flex -space-x-3 hover:space-x-0 transition-all duration-300">
                    {group.members?.slice(0, 3).map((member, idx) => (
                      <img 
                        key={idx} 
                        src={member?.avatar || pfp} 
                        className="w-9 h-9 rounded-full border-2 border-[#1A1F2E] object-cover hover:z-10 hover:scale-110 transition-transform" 
                        alt="Member avatar"
                      />
                    ))}
                    {group.memberCount > 3 && (
                      <div className="w-9 h-9 rounded-full border-2 border-[#1A1F2E] bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-300 z-10">
                        +{group.memberCount - 3}
                      </div>
                    )}
                  </div>
                  <button className="text-sm cursor-pointer font-medium text-[#6B5AED] group-hover:text-[#8879FF] transition-colors flex items-center gap-1">
                    Details <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                  </button>
                </div>
              </div>
            )})}
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
             
              <button 
              onClick={() => setIsGroupModalOpen(true)} 
              className="bg-[#6B5AED] cursor-pointer hover:bg-[#5a4add] text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-[0_4px_12px_rgba(107,90,237,0.3)] hover:shadow-[0_6px_16px_rgba(107,90,237,0.4)] active:scale-95">
              <Plus size={22} />
              Create your first group
            </button>
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      {isGroupModalOpen && (
        <CreateGroupModal 
          isOpen={isGroupModalOpen} 
          onClose={() => setIsGroupModalOpen(false)} 
          onSuccess={() => {
            setIsGroupModalOpen(false);
            window.location.reload(); // Refresh to see the new group
          }}
        />
      )}
    </div>
  );
}

function CreateGroupModal({ isOpen, onClose, onSuccess }) {
  const { user: currentUser } = useAuth();
  const [grpName, setGrpName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAllUsers();
    }
  }, [isOpen]);

  const fetchAllUsers = async () => {
    try {
      setSearching(true);
      const res = await getAllUsers();
      // Filter out the current user as they are added automatically as owner
      const others = res.data.data.filter(u => u._id !== currentUser?._id);
      setAvailableUsers(others);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setSearching(false);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const toggleMember = (user) => {
    if (selectedMembers.find(m => m._id === user._id)) {
      setSelectedMembers(selectedMembers.filter(m => m._id !== user._id));
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!grpName.trim()) return alert("Group name is required");
    if (selectedMembers.length < 1) return alert("Add at least 1 other member (total 2 including you)");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('grpName', grpName);
      if (thumbnail) formData.append('thumbnail', thumbnail);
      formData.append('members', JSON.stringify(selectedMembers.map(m => m._id)));

      await createGroupApi(formData);
      onSuccess();
    } catch (err) {
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = availableUsers.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0A0D14]/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-[#1A1F2E] border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="text-[#6B5AED]" size={22} />
            Create New Group
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Thumbnail & Name */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-slate-500" size={24} />
                )}
              </div>
              <button 
                type="button"
                onClick={() => document.getElementById('group-thumb').click()}
                className="absolute -bottom-2 -right-2 p-1.5 bg-[#6B5AED] text-white rounded-lg shadow-lg hover:scale-110 transition-transform"
              >
                <Plus size={14} />
              </button>
              <input 
                id="group-thumb"
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleThumbnailChange}
              />
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Group Name</label>
              <input 
                type="text" 
                value={grpName}
                onChange={(e) => setGrpName(e.target.value)}
                placeholder="e.g. Goa Trip 2024"
                className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6B5AED]/50 transition-all"
              />
            </div>
          </div>

          {/* Members Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Add Members</label>
              <span className="text-[10px] bg-[#6B5AED]/10 text-[#6B5AED] px-2 py-0.5 rounded-full font-bold">
                {selectedMembers.length + 1} Selected
              </span>
            </div>

            {/* Selected Members Chips */}
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 py-2">
                {selectedMembers.map(m => (
                  <div key={m._id} className="flex items-center gap-2 bg-[#6B5AED] text-white pl-3 pr-1 py-1 rounded-full text-xs font-medium">
                    {m.fullName}
                    <button onClick={() => toggleMember(m)} className="p-0.5 hover:bg-white/20 rounded-full">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends by name or email..."
                className="w-full bg-[#0A0D14]/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#6B5AED]/30 transition-all"
              />
            </div>

            {/* Search Results */}
            <div className="bg-[#0A0D14]/30 border border-slate-800 rounded-2xl max-h-48 overflow-y-auto">
              {searching ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="text-[#6B5AED] animate-spin" size={24} />
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="divide-y divide-slate-800/50">
                  {filteredUsers.map(u => (
                    <div 
                      key={u._id} 
                      onClick={() => toggleMember(u)}
                      className="p-3 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                          {u.fullName[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-[#6B5AED] transition-colors">{u.fullName}</p>
                          <p className="text-[10px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        selectedMembers.find(m => m._id === u._id) 
                        ? 'bg-[#6B5AED] border-[#6B5AED]' 
                        : 'border-slate-700'
                      }`}>
                        {selectedMembers.find(m => m._id === u._id) && <Check className="text-white" size={14} />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm italic">
                  No users found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-[#1A1F2E]">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#6B5AED] hover:bg-[#5a4add] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#6B5AED]/20 active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            Create Group
          </button>
          <p className="text-center text-[10px] text-slate-500 mt-4">
            You will automatically be added as the group owner.
          </p>
        </div>
      </div>
    </div>
  );
}
