import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [permissions, setPermissions] = useState({});
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    
    useEffect(() => {
        // Load data from sessionStorage on initial app load
        const storedPermissions = sessionStorage.getItem("permissions");
        const storedUser = sessionStorage.getItem("user");
        const storedRole = sessionStorage.getItem("role");

        if (storedPermissions) {
            try {
                // Parse the stored string into a JSON object
                setPermissions(JSON.parse(storedPermissions));
            } catch (e) {
                console.error("Failed to parse permissions", e);
            }
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedRole) {
            setRole(storedRole)
        }
        setLoading(false);
    }, []);

    // Function to update state after login
    const login = (authData) => {
        const parsedPerms = typeof authData.permissions === 'string'
            ? JSON.parse(authData.permissions)
            : authData.permissions;

        setPermissions(parsedPerms);
        setUser(authData.user);
    };

    return (
        <AuthContext.Provider value={{ permissions, user, login, loading, role }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);