import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Sun, Moon, AlertCircle, Check, Combine } from 'lucide-react';
import { signupApi } from '../Api/auth.api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/Auth.Context';
import { useTheme } from '../Context/Theme.Context';

export default function Login() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin ?? true);
  const { isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();
  const {login}= useAuth()

  const handleGoogleLogin = () => {
    // Redirect to backend Google Auth route
    window.location.href = `http://localhost:3000/api/v1/auth/google`;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Basic validation
    if (!email || !password || (!isLogin && !fullName)) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    if (isLogin) {
      try {
        await login({ email, password });
        navigate("/dashboard");
        setSuccessMsg("Logged in successfully!");
      } 
      catch (error) {
        const message = error?.response?.data?.message || "Invalid email or password";
        setErrorMsg(message);
      }
      finally {
        setLoading(false);
      }
    }
    else {
      try {
        await signupApi({email, password, fullName});
        setSuccessMsg("Account created successfully! Please log in.");
        setIsLogin(true);
      } catch (error) {
        const message = error?.response?.data?.message || "Failed to create account";
        setErrorMsg(message);
      }
      finally {
        setLoading(false);
      }
    }
  }

  // Global theme is managed by ThemeProvider now
  
  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(244,247,254)] dark:bg-[#0A0D14] font-sans p-4 transition-colors duration-500 relative animate-page-enter">
      {/* Logo Section */}
      <div 
        className="absolute top-6 left-6 lg:top-8 lg:left-8 z-50 flex items-center gap-3 cursor-pointer group" 
        onClick={() => navigate('/')}
      >
        <div className="w-10 h-10 bg-[#6B5AED] dark:bg-white rounded-xl flex items-center justify-center transform group-hover:-rotate-12 transition-transform duration-300 shadow-[0_0_15px_rgba(107,90,237,0.2)]">
          <Combine className="text-white dark:text-[#0A0D14]" size={24} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tighter">QUICSPLIT</span>
      </div>

      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-50">
        {/* <button
          onClick={toggleTheme}
          className="p-3 bg-white/50 dark:bg-[#1A1F2E]/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all text-slate-800 dark:text-white cursor-pointer"
          aria-label="Toggle theme">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button> */}
      </div>

      <div className="w-full max-w-[480px] bg-white dark:bg-[#1A1F2E] rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 md:p-8 transition-all duration-500 relative overflow-hidden">

        {/* Top Decorative Blob/Gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-br from-[#6B5AED]/10 dark:from-[#6B5AED]/20 to-transparent -z-10 blur-xl"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6B5AED]/20 dark:bg-[#6B5AED]/30 rounded-full blur-2xl"></div>

        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#6B5AED]/10 dark:bg-[#6B5AED]/20 text-[#6B5AED] dark:text-[#8879FF] mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            {isLogin
              ? 'Enter your credentials to access your account.'
              : 'Sign up to get started with our platform.'}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4 relative z-10" onSubmit={onSubmitHandler}>
          
          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-500 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <Check size={18} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {/* SIGNUP COMPONENT */}
          {!isLogin && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  onChange={(e) => {
                    setFullName(e.target.value)
                    setErrorMsg("");
                  }}
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6B5AED]/30 focus:border-[#6B5AED] dark:focus:border-[#6B5AED] transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrorMsg("");
                }}
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6B5AED]/30 focus:border-[#6B5AED] dark:focus:border-[#6B5AED] transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              {/* {isLogin && <a href="#" className="text-sm text-[#6B5AED] dark:text-[#8879FF] hover:underline font-medium">Forgot password?</a>} */}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrorMsg("");
                }}
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6B5AED]/30 focus:border-[#6B5AED] dark:focus:border-[#6B5AED] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}  
            className="w-full py-3 px-4 bg-[#6B5AED] hover:bg-[#5a4add] dark:bg-[#6B5AED] dark:hover:bg-[#7a6cf0] text-white rounded-xl font-semibold shadow-[0_4px_12px_rgba(107,90,237,0.3)] hover:shadow-[0_6px_16px_rgba(107,90,237,0.4)] transition-all flex items-center justify-center gap-2 mt-1 cursor-pointer">
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="my-5 flex items-center justify-center space-x-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
          <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 bg-white dark:bg-[#1A1F2E] hover:bg-slate-50 dark:hover:bg-[#22283A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer">
          <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
        </button>

        {/* Footer switch */}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleMode}
            className="text-[#6B5AED] dark:text-[#8879FF] font-semibold hover:underline cursor-pointer"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
