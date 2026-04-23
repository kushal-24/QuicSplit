import React from 'react';

export default function ExpenseCard({groupData, expenseName, createdAt, description, paidBy, amount}) {
  // Gracefully handle date missing/invalid by defaulting or parsing
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    : 'Unknown date';
    
  // Attempt to extract string representation of populated objects
  const groupName = groupData?.grpName || 'Unknown Group';
  const payerName = paidBy?.fullName || 'N.A';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-[#1A1F2E]/40 border border-slate-800/80 rounded-2xl mb-3 hover:bg-[#1A1F2E]/80 transition-colors gap-3 sm:gap-0">
      <div>
        <h4 className="text-white font-semibold text-base">{expenseName}</h4>
        <p className="text-sm text-slate-400 mt-1">
          {payerName} paid · {formattedDate} · {groupName}
        </p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-white font-bold text-lg">₹{amount}</p>
        {/* <p className={`text-sm mt-1 font-medium ${type === 'owe' ? 'text-red-400' : 'text-green-400'}`}>
          {type === 'owe' ? `you owe ₹${myShare}` : `you get ₹${myShare}`}
        </p> */}
      </div>
    </div>
  );
}
