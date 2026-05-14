import React, { useContext } from 'react'
import { createContext, useEffect, useState } from "react";
import { getMeApi, loginApi, logoutApi } from '../Api/auth.api';
import {devLog} from "../utils/logger.js"

const AuthContext = createContext(null) //esse ek storage box bana diya hai maine

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await getMeApi();
            setUser(res.data.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async ({ email, password }) => {
        try {
            const res = await loginApi({ email, password });
            devLog("LOGIN RESPONSE USER:", res.data.data.user);
            setUser(res.data.data.user);
            devLog(user);
        } catch (error) {
            throw error;
        }
        finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.log(error);
        }
        finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                logout,
                checkAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);