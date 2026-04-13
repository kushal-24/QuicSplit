import React, { useState, useEffect } from 'react';
import { Moon, Sun, Combine, ArrowRight } from 'lucide-react';
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
      clearInterval(interval); // needs proper scope handling
    };
  }, [text, speed]);
  return displayedText;
};

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate=useNavigate();

  const headingText = "Modern payments for forward-thinking teams";
  const typedHeading = useTypewriter(headingText, 45);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#EDEDED] dark:bg-[#0A0D14] font-sans antialiased transition-colors duration-500 overflow-hidden">
      {/* Theme Toggle Floating Button THEME CHANGE BUTTON */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 bg-white/50 dark:bg-black/50 backdrop-blur-md border border-slate-300 dark:border-slate-800 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all text-slate-800 dark:text-white"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>

      {/* Left Column Container */}
      <div className="w-full md:w-[45%] lg:w-[40%] p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-between h-auto min-h-screen z-10 box-border relative">
        <div className="flex-1 flex flex-col pt-4">
          {/* Top Logo */}
          <div className="flex items-center gap-3 md:mb-20 lg:mb-32 cursor-pointer group w-fit">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#25394B] dark:bg-white rounded-xl flex items-center justify-center transform group-hover:-rotate-12 transition-transform duration-300 shadow-md">
              <Combine className="text-white dark:text-[#25394B]" size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl md:text-3xl font-bold text-[#25394B] dark:text-white tracking-tighter">QUICSPLIT</span>
          </div>

          {/* Middle Text - Centered vertically in its space */}
          <div className="max-w-md my-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-medium text-[#25394B] dark:text-white leading-[1.05] tracking-tight mb-6 md:mb-8 min-h-[160px] md:min-h-[220px]">
              {typedHeading}
              <span className="animate-[pulse_1s_infinite] inline-block ml-1 opacity-60">|</span>
            </h1>
            <p className="text-[#596675] dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-[90%]">
              Streamline your invoicing, track every transaction, and get paid faster with our all-in-one financial ecosystem.
            </p>
          </div>
        </div>

        {/* Bottom Buttons  SIGNUP AND LOGIN*/}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center">
          <button 
          onClick={()=> navigate('/auth', { state:{isLogin: false}})}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#25394B] hover:bg-[#1A2A3A] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-[#25394B] text-sm md:text-base font-semibold rounded-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-3">
            Sign up <ArrowRight size={18} />
          </button>
          <button 
          onClick={()=> navigate('/auth', { state:{isLogin: true}})}
          className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-[#25394B] dark:text-white text-sm md:text-base font-semibold rounded-lg transition-all duration-300 flex items-center justify-center">
            Login
          </button>
        </div>
      </div>

      {/* Right Column Container */}
      <div className="w-full md:w-[55%] lg:w-[60%] p-3 md:p-6 lg:p-8 flex items-center justify-center h-[60vh] md:h-screen lg:h-screen">
        <div className="w-full h-full relative overflow-hidden rounded-4xl shadow-2xl bg-[#1A1F2E]">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
            alt="Abstract presentation"
            className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:scale-105 transition-all duration-1000 ease-in-out cursor-pointer"
          />
          {/* Grid Overlay to match dribbble look */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none"></div>
          {/* Subtle color overlay */}
          <div className="absolute inset-0 bg-linear-to-tr from-[#25394B]/60 via-[#1A2A3A]/40 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
