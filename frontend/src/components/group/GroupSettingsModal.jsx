import React, { useState, useEffect } from 'react';
import { X, Camera, Trash2, Edit2, Users, Check, Search, Loader2, Settings, Plus } from 'lucide-react';
import { updateGroupApi, addMemberApi } from '../../Api/group.api';
import { getAllUsers } from '../../Api/auth.api';

export default function GroupSettingsModal({ isOpen, onClose, groupData, onUpdate }) {
  const [activeTab, setActiveTab ] = useState('general'); // 'general', 'members'
  const [grpName, setGrpName] = useState(groupData.grpName || '');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(groupData.thumbnail || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'members') {
      fetchUsers();
    }
  }, [isOpen, activeTab]);

  const fetchUsers = async () => {
    try {
      setSearching(true);
      const res = await getAllUsers();
      // Filter out users who are already members
      const currentMemberIds = groupData.members?.map(m => m._id.toString()) || [];
      const others = res.data.data.filter(u => !currentMemberIds.includes(u._id.toString()));
      setAvailableUsers(others);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setSearching(false);
    }
  };

  const handleUpdateGroup = async () => {
    if (!grpName.trim()) return alert("Group name is required");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('grpName', grpName);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      } else if (!thumbnailPreview) {
        formData.append('deleteThumbnail', 'true');
      }
      
      await updateGroupApi(groupData._id, formData);
      onUpdate();
      onClose();
    } catch (err) {
      alert("Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      setLoading(true);
      await addMemberApi(groupData._id, userId);
      onUpdate();
      // Refresh available users
      setAvailableUsers(availableUsers.filter(u => u._id !== userId));
      alert("Member added successfully");
    } catch (err) {
      alert("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = availableUsers.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0A0D14]/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-[#1A1F2E] border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="text-[#6B5AED]" size={22} />
            Group Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'general' ? 'text-[#6B5AED] border-b-2 border-[#6B5AED]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            General
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'members' ? 'text-[#6B5AED] border-b-2 border-[#6B5AED]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Add Members
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
          {activeTab === 'general' ? (
            <div className="space-y-6">
              {/* Thumbnail Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="text-slate-500" size={32} />
                    )}
                  </div>
                  <button 
                    onClick={() => document.getElementById('group-edit-thumb').click()}
                    className="absolute -bottom-2 -right-2 p-2 bg-[#6B5AED] text-white rounded-lg shadow-lg hover:scale-110 transition-transform"
                  >
                    <Edit2 size={14} />
                  </button>
                  {thumbnailPreview && (
                    <button 
                      onClick={() => {
                        setThumbnail(null);
                        setThumbnailPreview('');
                      }}
                      className="absolute -bottom-2 -left-2 p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg shadow-lg hover:scale-110 transition-transform"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <input 
                    id="group-edit-thumb"
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setThumbnail(file);
                        setThumbnailPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500">Group Thumbnail</p>
              </div>

              {/* Name Section */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-widest">Group Name</label>
                <input 
                  type="text" 
                  value={grpName}
                  onChange={(e) => setGrpName(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6B5AED]/50 transition-all"
                />
              </div>

              <button 
                onClick={handleUpdateGroup}
                disabled={loading}
                className="w-full bg-[#6B5AED] hover:bg-[#5a4add] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search to add friends..."
                  className="w-full bg-[#0A0D14]/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#6B5AED]/30 transition-all"
                />
              </div>

              <div className="bg-[#0A0D14]/30 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
                {searching ? (
                  <div className="p-8 flex justify-center">
                    <Loader2 className="text-[#6B5AED] animate-spin" size={24} />
                  </div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <div key={u._id} className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                          {u.fullName[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{u.fullName}</p>
                          <p className="text-[10px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddMember(u._id)}
                        disabled={loading}
                        className="p-1.5 bg-[#6B5AED]/10 text-[#6B5AED] hover:bg-[#6B5AED] hover:text-white rounded-lg transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm italic">
                    No results found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
