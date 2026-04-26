import React from 'react';

export default function ExpenseCard({groupData, expenseName, createdAt, description, paidBy, amount, index}) {
  // Gracefully handle date missing/invalid by defaulting or parsing
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    : 'Unknown date';
    
  // Attempt to extract string representation of populated objects
  const groupName = groupData?.grpName || 'Unknown Group';
  const payerName = paidBy?.fullName || 'N.A';

  return (
    <div 
      style={{ animationDelay: `${index * 80}ms` }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white dark:bg-[#1A1F2E]/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl mb-3 hover:bg-slate-50 dark:hover:bg-[#1A1F2E]/80 transition-colors gap-3 sm:gap-0 animate-slide-up opacity-0">
      <div>
        <h4 className="text-slate-900 dark:text-white font-semibold text-base">{expenseName}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {payerName} paid · {formattedDate} · {groupName}
        </p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-slate-900 dark:text-white font-bold text-lg">₹{Math.round(amount)}</p>
      </div>
    </div>
  );
}
