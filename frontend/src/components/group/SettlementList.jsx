import React from 'react';
import { ArrowRight } from 'lucide-react';
import {devLog} from "../../utils/logger.js"


export default function SettlementList({ transactions, onSettle }) {
  const handleSettle = (settlement) => {
    if (onSettle) {
      onSettle(settlement);
    } else {
      devLog('API: mark settlement complete');
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <h3 className="text-slate-300 font-medium mb-6">{transactions?.length || 0} pending settlements</h3>
      <div className="flex flex-col gap-3">
        {transactions?.map((settlement, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-[#1A1F2E]/40 border border-slate-800/80 rounded-2xl hover:bg-[#1A1F2E]/80 transition-colors gap-3 sm:gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-white font-semibold text-base">
                {settlement.from?.name} <ArrowRight size={14} className="text-slate-400" /> {settlement.to?.name}
              </div>
              <p className="text-sm text-slate-400">settlement</p>
            </div>
            <div className="flex items-center gap-5">
              <span className="text-red-400 font-bold text-lg">₹{Math.round(settlement.amount)}</span>
              <button
                onClick={() => handleSettle(settlement)}
                className="px-4 py-2 bg-transparent hover:bg-white/5 border border-slate-600 rounded-full text-sm font-medium text-slate-300 transition-colors cursor-pointer"
              >
                mark settled
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-12 pb-6">
        <p className="text-sm text-slate-500 font-medium">all other members are settled up</p>
      </div>
    </div>
  );
}
