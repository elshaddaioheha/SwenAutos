'use client';

import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';

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
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                        email: session.user.email || '',
                        role: session.user.user_metadata.role || 'buyer'
                    });
                }
            } catch (error) {
                console.error("Error checking auth session:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                    email: session.user.email || '',
                    role: session.user.user_metadata.role || 'buyer'
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = (userData: User) => {
        // This is now primarily for manual state updates if needed, 
        // but Supabase listener is the source of truth.
        setUser(userData);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('swenautos_user');
    };

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            return { ...prev, ...updates };
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
