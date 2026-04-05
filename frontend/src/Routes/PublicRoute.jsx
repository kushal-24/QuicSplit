import {Navigate} from "react-router-dom"
import {useAuth} from "../Context/Auth.Context.jsx"

const publicRoute= ({children})=>{
    const {isAuthenticated, loading}=useAuth()

    if(loading){
        return(
            <>
            <div className=" h-screen flex justify-center items-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
                </div>
            </>
        )
    }
    if(isAuthenticated){
        return <Navigate to="/boards" replace />;
    }

    return children;
    
}