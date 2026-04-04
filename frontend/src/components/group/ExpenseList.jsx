import React from 'react';
import ExpenseCard from './ExpenseCard';

const MOCK_EXPENSES = [
  { id: 1, title: 'Hotel booking', paidBy: 'Raj', date: '12 Jan', subtitle: 'split 4 ways', amount: '2,000', myShare: '500', type: 'owe' },
  { id: 2, title: 'Dinner at Thalassa', paidBy: 'Harsh', date: '13 Jan', subtitle: 'split 4 ways', amount: '1,200', myShare: '300', type: 'owe' },
  { id: 3, title: 'Scooter rentals', paidBy: 'You', date: '14 Jan', subtitle: 'split 4 ways', amount: '1,000', myShare: '750', type: 'get' },
];

export default function ExpenseList() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-slate-300 font-medium">{MOCK_EXPENSES.length} expenses</h3>
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
        {MOCK_EXPENSES.map(exp => (
          <ExpenseCard key={exp.id} {...exp} />
        ))}
      </div>
    </div>
  );
}
