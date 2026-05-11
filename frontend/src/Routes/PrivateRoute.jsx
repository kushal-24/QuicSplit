import { useAuth } from "../Context/Auth.Context.jsx";
import { Navigate } from "react-router-dom";
import { Combine } from "lucide-react";

const privateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen flex flex-col justify-center items-center bg-[#0A0D14] relative overflow-hidden">
                {/* Background aesthetic */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6B5AED]/20 blur-[100px] rounded-full"></div>
                
                {/* Loader Content */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="relative">
                        {/* Outer rotating ring */}
                        <div className="absolute -inset-4 border border-[#6B5AED]/30 border-t-[#6B5AED] rounded-2xl animate-[spin_2s_linear_infinite]"></div>
                        {/* Logo Box */}
                        <div className="w-16 h-16 bg-[#6B5AED] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(107,90,237,0.3)] animate-pulse">
                            <Combine className="text-white" size={32} strokeWidth={2.5} />
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 mt-4">
                        <h2 className="text-xl font-bold text-white tracking-widest uppercase">QuicSplit</h2>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6B5AED] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6B5AED] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#6B5AED] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace /> //“Replace the current URL in history instead of adding a new one.”
    }

    return children;
};

export default privateRoute;