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
    // Web3 wallet auth is now the single source of truth
    // This provider is kept as a no-op for backward compatibility
    return (
        <AuthContext.Provider value={{ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false, 
            login: () => {}, 
            logout: () => {}, 
            updateUser: () => {} 
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
