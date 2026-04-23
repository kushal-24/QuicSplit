import { useState, useRef, useEffect } from 'react';
import { Combine, Settings, User, Lock, Trash2, ArrowLeft, Camera, X, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/Auth.Context';
import { changeFullName, changePassApi, updateAvatarApi, deleteAvatarApi, deleteAccountApi, getMeApi } from '../Api/auth.api';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [userData, setUserData] = useState({ fullName: '', email: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Name update state
  const [newName, setNewName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  
  // Password update state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await getMeApi();
      setUserData(res.data.data);
      setNewName(res.data.data.fullName);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim() || newName === userData.fullName) {
      setIsEditingName(false);
      return;
    }
    try {
      setUpdating(true);
      await changeFullName({ fullName: newName });
      setUserData({ ...userData, fullName: newName });
      setIsEditingName(false);
    } catch (err) {
      alert("Failed to update name");
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUpdating(true);
      const res = await updateAvatarApi(formData);
      setUserData({ ...userData, avatar: res.data.data.avatar });
    } catch (err) {
      alert("Failed to upload avatar");
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      setUpdating(true);
      await deleteAvatarApi();
      setUserData({ ...userData, avatar: '' });
    } catch (err) {
      alert("Failed to delete avatar");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match");
      return;
    }
    try {
      setUpdating(true);
      await changePassApi({
        email: userData.email,
        password: passwords.current,
        newPassword: passwords.new,
        confirmNewPassword: passwords.confirm
      });
      alert("Password updated successfully");
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setUpdating(true);
      await deleteAccountApi();
      await logout();
      navigate('/login');
    } catch (err) {
      alert("Failed to delete account");
    } finally {
      setUpdating(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#6B5AED] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] font-sans text-slate-200 relative overflow-x-hidden">
      
      {/* Background Gradients & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 right-0 h-[800px] bg-linear-to-br from-[#6B5AED]/20 via-[#6B5AED]/5 to-transparent blur-[130px]"></div>
        <div className="absolute bottom-[-200px] right-[-100px] w-[800px] h-[800px] bg-[#6B5AED]/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Header */}
      <nav className="w-full h-20 border-b border-slate-800/60 bg-[#0A0D14]/50 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-[#1A1F2E] rounded-full transition-colors group"
            >
              <ArrowLeft size={20} className="text-slate-400 group-hover:text-white" />
            </button>
            <h1 className="text-xl font-bold text-white tracking-tight">Settings</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
               <Combine className="text-[#6B5AED]" size={18} />
             </div>
             <span className="text-sm font-bold tracking-tighter">QUICSPLIT</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 relative z-10 space-y-8">
        
        {/* Profile Section */}
        <section className="bg-[#1A1F2E]/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#6B5AED]/20 rounded-xl flex items-center justify-center">
              <User className="text-[#6B5AED]" size={20} />
            </div>
            <div>
               <h2 className="text-lg font-semibold text-white">Profile Information</h2>
               <p className="text-sm text-slate-400">Update your personal details and profile picture.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Avatar Display */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#6B5AED]/50 bg-[#0A0D14] flex items-center justify-center relative">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="https://i.pinimg.com/474x/40/d6/55/40d655b7022ce45320f3916c10a37e19.jpg" className="w-full h-full object-cover" />
                ) : (
                  <User size={60} className="text-slate-700" />
                )}
                
                {updating && (
                  <div className="absolute inset-0 bg-[#0A0D14]/60 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#6B5AED] animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="absolute -bottom-2 -right-2 flex gap-2">
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="p-2.5 bg-[#6B5AED] cursor-pointer hover:bg-[#5a4add] text-white rounded-full shadow-lg transition-all active:scale-90"
                  title="Upload picture"
                >
                  <Camera size={16} />
                </button>
                {userData.avatar && (
                  <button 
                    onClick={handleAvatarDelete}
                    className="p-2.5 bg-red-500/10 cursor-pointer hover:bg-red-500/20 text-red-400 rounded-full border border-red-500/20 shadow-lg transition-all active:scale-90"
                    title="Remove picture"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            {/* Name/Email Info */}
            <div className="flex-1 space-y-6 w-full">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="flex items-center gap-3">
                  {isEditingName ? (
                    <div className="flex flex-1 gap-2">
                      <input 
                        type="text" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 bg-[#0A0D14] border border-[#6B5AED]/50 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6B5AED]/20 transition-all"
                        autoFocus
                      />
                      <button onClick={handleNameUpdate} className="p-2.5 cursor-pointer bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 transition-colors">
                        <Check size={20} />
                      </button>
                      <button onClick={() => { setIsEditingName(false); setNewName(userData.fullName); }} className="p-2.5 cursor-pointer bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center justify-between bg-[#0A0D14]/50 border border-slate-800 rounded-xl px-4 py-2.5 group">
                      <span className="text-white font-medium">{userData.fullName}</span>
                      <button 
                        onClick={() => setIsEditingName(true)}
                        className="text-xs text-[#6B5AED] cursor-pointer hover:text-[#8879FF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="bg-[#0A0D14]/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed">
                  {userData.email}
                </div>
                <p className="text-[10px] text-slate-600">Email address cannot be changed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-[#1A1F2E]/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#6B5AED]/20 rounded-xl flex items-center justify-center">
              <Lock className="text-[#6B5AED]" size={20} />
            </div>
            <div>
               <h2 className="text-lg font-semibold text-white">Security</h2>
               <p className="text-sm text-slate-400">Manage your password and account security.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
            {[
              { id: 'current', label: 'Current Password', value: passwords.current },
              { id: 'new', label: 'New Password', value: passwords.new },
              { id: 'confirm', label: 'Confirm New Password', value: passwords.confirm }
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{field.label}</label>
                <div className="relative">
                  <input 
                    type={showPass[field.id] ? "text" : "password"}
                    value={field.value}
                    onChange={(e) => setPasswords({...passwords, [field.id]: e.target.value})}
                    className="w-full bg-[#0A0D14] border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#6B5AED]/50 focus:ring-2 focus:ring-[#6B5AED]/10 transition-all placeholder:text-slate-700"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass({...showPass, [field.id]: !showPass[field.id]})}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 hover:text-slate-300"
                  >
                    {showPass[field.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            ))}

            <button 
              type="submit"
              disabled={updating}
              className="bg-[#6B5AED] cursor-pointer hover:bg-[#5a4add] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updating ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
               <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                 <Trash2 size={20} /> Danger Zone
               </h2>
               <p className="text-sm text-slate-500 mt-1">
                 Permanently delete your account and all associated data. This action cannot be undone.
               </p>
            </div>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-3 bg-red-500/10 cursor-pointer hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold transition-all active:scale-95 whitespace-nowrap">
              Delete Account
            </button>
          </div>
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-[#0A0D14]/80 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="bg-[#1A1F2E] border border-slate-800 w-full max-w-md rounded-3xl p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Trash2 className="text-red-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-2">Delete Account?</h3>
            <p className="text-slate-400 text-center mb-8">
              Are you sure you want to delete your account? All your transaction history, groups, and settlements will be permanently removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-slate-800 cursor-pointer hover:bg-slate-700 text-white rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={updating}
                className="flex-1 px-6 py-3 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                {updating ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Updating Overlay */}
      {updating && !showDeleteModal && (
        <div className="fixed bottom-8 right-8 z-100 bg-[#6B5AED] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
           <Loader2 size={18} className="animate-spin" />
           <span className="text-sm font-bold">Saving changes...</span>
        </div>
      )}
    </div>
  );
}
