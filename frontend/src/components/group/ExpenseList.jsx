import React from 'react';
import ExpenseCard from './ExpenseCard';

const MOCK_EXPENSES = [
  { 
    _id: "1", 
    expenseName: 'Hotel booking', 
    paidBy: { name: 'Raj' }, 
    createdAt: '2026-01-12T10:00:00Z', 
    group: { name: 'Goa Trip' }, 
    amount: '2,000', 
    myShare: '500', 
    type: 'owe' 
  },
  { 
    _id: "2", 
    expenseName: 'Dinner at Thalassa', 
    paidBy: { name: 'Harsh' }, 
    createdAt: '2026-01-13T20:30:00Z', 
    group: { name: 'Goa Trip' }, 
    amount: '1,200', 
    myShare: '300', 
    type: 'owe' 
  },
  { 
    _id: "3", 
    expenseName: 'Scooter rentals', 
    paidBy: { name: 'You' }, 
    createdAt: '2026-01-14T09:15:00Z', 
    group: { name: 'Goa Trip' }, 
    amount: '1,000', 
    myShare: '750', 
    type: 'get' 
  },
];

export default function ExpenseList({ expenses = MOCK_EXPENSES }) {
  const displayExpenses = expenses && expenses.length > 0 ? expenses : MOCK_EXPENSES;

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-slate-300 font-medium">{displayExpenses.length} expenses</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button className="flex-1 justify-center px-4 py-1.5 bg-[#1A1F2E]/50 hover:bg-[#252b40] text-slate-200 text-sm font-medium border border-slate-700/50 rounded-full transition-colors flex items-center gap-1">
            + add
          </button>
          <button className="flex-1 justify-center px-4 py-1.5 bg-[#1A1F2E]/50 hover:bg-[#252b40] text-slate-200 text-sm font-medium border border-slate-700/50 rounded-full transition-colors">
            upload bill
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        {displayExpenses.map(exp => (
          <ExpenseCard 
            key={exp._id || exp.id} 
            expenseName={exp.expenseName}
            group={exp.group}
            createdAt={exp.createdAt}
            paidBy={exp.paidBy}
            amount={exp.amount}
            myShare={exp.myShare}
            type={exp.type}
          />
        ))}
      </div>
    </div>
  );
}
