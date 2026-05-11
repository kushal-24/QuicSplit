import React, { useState, useEffect } from 'react';
import { X, Activity, Trash2, Clock, CheckCircle2, UserPlus, UserMinus, PlusCircle, Trash } from 'lucide-react';
import { fetchActivityLogs, clearActivityLogs } from '../../Api/group.api';

function formatDistanceToNow(dateInput) {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `Just now`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

export default function ActivityLogsModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetchActivityLogs();
      setLogs(response.data?.data || []);
      console.log(response.data?.data);
      setError(null);
    } catch (err) {
      setError('Failed to load activity logs.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      setIsClearing(true);
      await clearActivityLogs();
      setLogs([]);
    } catch (err) {
      console.error('Failed to clear logs:', err);
    } finally {
      setIsClearing(false);
    }
  };

  if (!isOpen) return null;

  const getIconForAction = (action) => {
    switch (action) {
      case 'EXPENSE_CREATED': return <PlusCircle size={16} className="text-emerald-400" />;
      case 'EXPENSE_DELETED': return <Trash size={16} className="text-rose-400" />;
      case 'SETTLEMENT_CREATED': return <CheckCircle2 size={16} className="text-blue-400" />;
      case 'MEMBER_ADDED': return <UserPlus size={16} className="text-indigo-400" />;
      case 'MEMBER_REMOVED': return <UserMinus size={16} className="text-orange-400" />;
      case 'GROUP_CREATED': return <Activity size={16} className="text-purple-400" />;
      default: return <Activity size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-md h-full bg-[#0A0D14] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between bg-[#1A1F2E]/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6B5AED]/20 flex items-center justify-center border border-[#6B5AED]/30">
              <Activity size={18} className="text-[#8879FF]" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">Activity Logs</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#6B5AED] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-70">
              <Activity size={32} className="text-rose-500" />
              <p className="text-sm text-slate-400">{error}</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-60">
              <Clock size={40} className="text-slate-500" />
              <p className="text-sm text-slate-400 font-medium tracking-wide">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-end mb-2">
                <button 
                  onClick={handleClearLogs}
                  disabled={isClearing}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  {isClearing ? 'Clearing...' : 'Clear Logs'}
                </button>
              </div>
              
              <div className="relative border-l-2 border-slate-800/60 ml-3 space-y-8 pb-4">
                {logs.map((log) => (
                  <div key={log._id} className="relative pl-6">
                    {/* Timeline dot */}
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#1A1F2E] border-2 border-[#0A0D14] flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                    </div>
                    
                    <div className="bg-[#1A1F2E]/60 border border-slate-800/80 rounded-xl p-4 shadow-sm hover:border-slate-700/80 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-[#0A0D14] border border-slate-800/80">
                            {getIconForAction(log.action)}
                          </div>
                          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            {log.group?.grpName || 'Group'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed font-medium">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
