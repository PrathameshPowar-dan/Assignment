import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const Context = createContext(null);

export const ContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const CheckAuth = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/user/check", {
                withCredentials: true,
            });
            
            console.log("CheckAuth response:", response);
            
            if (response.data.success && response.data.data) {
                // The tenant data is already in response.data.data.tenantId
                const userData = {
                    email: response.data.data.email,
                    role: response.data.data.role,
                    userId: response.data.data.userId,
                    tenant: response.data.data.tenantId // This is the full tenant object
                };
                
                // Store both in context and localStorage
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                setLoading(false);
                return userData;
            } else {
                setUser(null);
                localStorage.removeItem("user");
                setLoading(false);
                return null;
            }
        } catch (error) {
            console.log("Error in CheckAuth:", error);
            setUser(null);
            localStorage.removeItem("user");
            setLoading(false);
            return null;
        }
    }

    const logout = async () => {
        try {
            await axios.post("http://localhost:5000/api/user/logout", {}, {
                withCredentials: true
            });
        } catch (error) {
            console.log("Logout error:", error);
        } finally {
            setUser(null);
            localStorage.removeItem("user");
        }
    };

    useEffect(() => {
        // Check if user exists in localStorage on initial load
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        
        // Then verify with server
        CheckAuth();
    }, []);

    const value = { user, setUser, CheckAuth, logout, loading };

    return (
        <Context.Provider value={value}>
            {props.children}
        </Context.Provider>
    );
}