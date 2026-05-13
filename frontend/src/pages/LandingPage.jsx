import React, { useState, useEffect } from 'react';
import { Combine, ArrowRight, CheckCircle2, Sparkles, MessageSquare, Receipt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const useTypewriter = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    let interval;
    setDisplayedText('');
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayedText((prev) => text.substring(0, prev.length + 1));
        index++;
        if (index === text.length) {
          clearInterval(interval);
        }
      }, speed);
    }, 300);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed]);
  return displayedText;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const typedHeading = useTypewriter("Split expenses with", 45);

  return (
    <div className="min-h-screen bg-[#05050A] font-sans antialiased overflow-hidden selection:bg-[#6B5AED]/30 selection:text-white relative">
      
      {/* Deep Navy/Black Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        
        {/* Neon Purple & Cyan Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6B5AED] rounded-full blur-[150px] opacity-20 animate-[pulse_8s_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-cyan-600 rounded-full blur-[150px] opacity-10 animate-[pulse_10s_infinite_reverse]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 w-full px-6 py-6 md:px-12 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-[#6B5AED] rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_20px_rgba(107,90,237,0.4)]">
            <Combine className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">QUICSPLIT</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login', { state: { isLogin: true } })} className="text-slate-300 hover:text-white text-sm font-semibold transition-colors hidden md:block cursor-pointer">
            Sign In
          </button>
          <button onClick={() => navigate('/login', { state: { isLogin: false } })} className="cursor-pointer px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white text-xs sm:text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(107,90,237,0.3)]">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-[1400px] mx-auto min-h-[calc(100vh-88px)] flex flex-col lg:flex-row items-center justify-between p-6 md:p-12 gap-12 lg:gap-8">
        
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6B5AED]/10 border border-[#6B5AED]/20 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_20px_rgba(107,90,237,0.15)]">
            <Sparkles size={14} className="animate-pulse" /> AI-Powered Finance
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-6">
            {typedHeading} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-[#8879FF] to-purple-600 animate-pulse">
              AI Intelligence.
            </span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mb-10 border-l-0 lg:border-l-2 border-[#6B5AED]/50 lg:pl-5">
            Type your expense, or upload a receipt. Our AI instantly parses who paid what, calculates balances, and keeps your group perfectly synced. No math required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button onClick={() => navigate('/login', { state: { isLogin: false } })} className="cursor-pointer group relative px-6 py-3.5 sm:px-8 sm:py-4 bg-white rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] w-full sm:w-auto">
              <div className="absolute inset-0 bg-linear-to-r from-cyan-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center justify-center gap-2 text-[#05050A] font-black text-base sm:text-lg tracking-wide">
                Start Splitting <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>

        {/* Right 3D Visual */}
        <div className="w-full lg:w-1/2 h-[400px] sm:h-[500px] lg:h-[700px] relative flex items-center justify-center perspective-[1200px] scale-[0.85] sm:scale-100 transition-transform">
          
          {/* Main AI Chat Interface */}
          <div className="relative z-20 w-full max-w-[320px] sm:max-w-[380px] bg-[#0A0D14]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_20px_70px_rgba(0,0,0,0.5),0_0_40px_rgba(107,90,237,0.2)] p-4 sm:p-5 transform rotate-y-[-12deg] rotate-x-[8deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out group">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-5">
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-cyan-400 to-[#6B5AED] flex items-center justify-center shadow-[0_0_15px_rgba(107,90,237,0.5)]">
                 <Combine size={18} className="text-white" />
               </div>
               <div>
                 <h3 className="text-white font-bold text-xs sm:text-sm">QuicSplit AI</h3>
                 <p className="text-cyan-400 text-[8px] sm:text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Online
                 </p>
               </div>
            </div>

            {/* Chat Area */}
            <div className="space-y-4">
              {/* User Prompt */}
              <div className="flex justify-end transform translate-x-2 sm:translate-x-4 opacity-0 animate-[fade-in-right_0.5s_ease-out_1s_forwards]">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tr-sm p-3 sm:p-4 text-xs sm:text-sm text-slate-300 max-w-[85%] shadow-lg">
                  "Kushal paid ₹3000 for dinner split among 5."
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start transform -translate-x-2 sm:-translate-x-4 opacity-0 animate-[fade-in-left_0.5s_ease-out_2s_forwards]">
                <div className="bg-linear-to-br from-[#6B5AED]/20 to-[#0A0D14] border border-[#6B5AED]/40 rounded-2xl rounded-tl-sm p-3 sm:p-4 text-xs sm:text-sm text-slate-200 max-w-[90%] shadow-[inset_0_0_20px_rgba(107,90,237,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-cyan-400 to-purple-500"></div>
                  <p className="mb-2 sm:mb-3 font-medium flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400" /> Expense added.
                  </p>
                  <div className="bg-black/40 rounded-xl p-2 sm:p-3 border border-white/5">
                    <p className="text-white font-bold mb-1 text-xs sm:text-sm">Dinner</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium flex items-center gap-1.5">
                      <Receipt size={10} className="text-[#6B5AED]" /> ₹600 each
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="mt-5 relative">
              <div className="w-full bg-black/40 border border-white/10 rounded-full py-2.5 sm:py-3 px-4 flex items-center gap-2">
                <MessageSquare size={14} className="text-slate-500" />
                <div className="w-full h-3 sm:h-4 bg-slate-800/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          
          {/* Frosted Glass Avatar Card 1 */}
          <div className="absolute top-[5%] sm:top-[10%] -right-2 sm:-right-4 lg:-right-12 z-30 bg-[#1A1F2E]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 sm:p-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] animate-[float_6s_ease-in-out_infinite] scale-90 sm:scale-100">
             <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-[0_0_15px_rgba(52,211,153,0.4)]">K</div>
                <div>
                   <p className="text-white text-xs sm:text-sm font-bold">Kushal</p>
                   <p className="text-emerald-400 text-[10px] sm:text-xs font-bold tracking-wide">+ ₹2400</p>
                </div>
             </div>
          </div>
          
          {/* Frosted Glass Avatar Card 2 */}
          <div className="absolute bottom-[10%] sm:bottom-[15%] -left-2 sm:-left-4 lg:-left-12 z-30 bg-[#1A1F2E]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 sm:p-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)] animate-[float_8s_ease-in-out_infinite_reverse] scale-90 sm:scale-100">
             <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-[0_0_15px_rgba(244,63,94,0.4)]">R</div>
                <div>
                   <p className="text-white text-[10px] sm:text-xs font-bold">Raj</p>
                   <div className="flex items-center gap-1 mt-0.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.8)]"></span>
                     <p className="text-rose-400 text-[8px] sm:text-[10px] font-bold tracking-wide uppercase">Owes ₹600</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Settlement Badge */}
          <div className="absolute top-[35%] sm:top-[40%] -left-6 sm:-left-8 lg:-left-16 z-10 bg-cyan-500/10 backdrop-blur-md border border-cyan-400/30 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-[float_7s_ease-in-out_infinite_1s] scale-90 sm:scale-100">
            <span className="text-cyan-300 text-[10px] sm:text-sm font-black tracking-wider uppercase flex items-center gap-2">
              <CheckCircle2 size={14}/> Settled!
            </span>
          </div>

        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in-right {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-left {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
