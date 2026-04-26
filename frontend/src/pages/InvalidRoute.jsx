import { useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const InvalidRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden px-6 animate-page-enter">

      {/* Ambient gradient blobs */}
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-125 h-125 bg-violet-500/10 rounded-full blur-3xl" />

      {/* Glass Card */}
      <div className="relative z-10 max-w-md w-full p-10 rounded-2xl
        bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl
        animate-[fadeUp_0.25s_ease-out] text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-full
          bg-cyan-500/10 border border-cyan-500/30
          flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-cyan-400" />
        </div>

        {/* 404 */}
        <h1 className="text-7xl font-extrabold tracking-tight
          bg-linear-to-r from-cyan-400 via-blue-500 to-violet-500
          bg-clip-text text-transparent mb-3">
          404
        </h1>

        {/* Text */}
        <h2 className="text-2xl font-semibold text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex cursor-pointer items-center justify-center gap-2
            px-6 py-3 rounded-xl font-medium text-white
            bg-linear-to-r from-cyan-500 to-violet-500
            hover:opacity-90 transition-all shadow-lg
            hover:shadow-cyan-500/30"
        >
          <Home className="w-4 h-4" />
          Go to Boards
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default InvalidRoute;
