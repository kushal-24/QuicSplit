import { useAuth } from "../Context/Auth.Context.jsx";
import { Navigate } from "react-router-dom";

const privateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <>
                <div className=" h-screen flex justify-center items-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
                LOADING...
                </div>
            </>
        )
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace /> //“Replace the current URL in history instead of adding a new one.”
    }

    return children;
};

export default privateRoute;