'use client';

import React, { createContext, useContext } from 'react';

/**
 * DEPRECATED: This AuthProvider is kept for backward compatibility only.
 * All authentication is now handled via web3 wallet (CAMP Network) using useAuthState() from @campnetwork/origin/react
 * 
 * This file is no longer used and should be removed in a future refactor.
 * Use `useAuthState()` from CAMP Network for all auth checks.
 */

interface User {
    id: string;
    name: string;
    email: string;
    role: 'buyer' | 'seller';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem('swenautos_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage");
                localStorage.removeItem('swenautos_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('swenautos_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('swenautos_user');
    };

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            const newUser = { ...prev, ...updates };
            localStorage.setItem('swenautos_user', JSON.stringify(newUser));
            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
}
