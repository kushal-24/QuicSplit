import React from 'react';

export const GroupSkeleton = () => {
  return (
    <div className="bg-[#1A1F2E]/40 border border-slate-800/50 rounded-3xl p-6 h-[280px] flex flex-col overflow-hidden relative">
      <div className="animate-shimmer absolute inset-0 opacity-20"></div>
      
      {/* Card Top Skeleton */}
      <div className="flex items-center gap-4 mb-6 relative">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/60 animate-pulse"></div>
        <div className="space-y-2">
          <div className="w-32 h-5 bg-slate-800/60 rounded animate-pulse"></div>
          <div className="w-20 h-3 bg-slate-800/40 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Card Stats Skeleton */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative">
        <div className="bg-[#0A0D14]/50 rounded-xl p-4 border border-slate-800/30">
          <div className="w-16 h-3 bg-slate-800/40 rounded mb-2 animate-pulse"></div>
          <div className="w-12 h-5 bg-slate-800/60 rounded animate-pulse"></div>
        </div>
        <div className="bg-[#0A0D14]/50 rounded-xl p-4 border border-slate-800/30">
          <div className="w-16 h-3 bg-slate-800/40 rounded mb-2 animate-pulse"></div>
          <div className="w-20 h-5 bg-slate-800/60 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Card Footer Skeleton */}
      <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-800/30 relative">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-9 h-9 rounded-full border-2 border-[#1A1F2E] bg-slate-800/60 animate-pulse"></div>
          ))}
        </div>
        <div className="w-16 h-4 bg-slate-800/60 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export const PremiumLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#6B5AED]/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#6B5AED] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#6B5AED] rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-slate-400 text-sm font-medium animate-pulse">Syncing with secure vault...</p>
    </div>
  );
};
