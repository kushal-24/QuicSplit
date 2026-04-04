import React from 'react'
import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext(null) //esse ek storage box bana diya hai maine

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

    const login = async ({ mail, password }) => {
        try {
            const res = await loginApi({ email, password });
            console.log("LOGIN RESPONSE USER:", res.data.data.user);
            setUser(res.data.data.user);
            console.log(user);
        } catch (error) {
            throw error;
        }
        finally {
            setLoading(false)
        }
    }



}

