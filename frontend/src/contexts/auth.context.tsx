'use client';
import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { User } from '@/types';

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loaded: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (email: string, username: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    authFetch: (input: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);

    const authFetch = useCallback(async (input: string, init: RequestInit = {}): Promise<Response> => {
        const token = localStorage.getItem('token');

        const res = await fetch(`${input}`, {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...init.headers,
            },
        });

        if (res.status === 401) {
            localStorage.removeItem('token');
            setUser(null);
        }

        return res;
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<User> => {
        const res = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Login failed');
        }

        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        setUser(data.user);

        return data.user;
    }, []);

    const register = useCallback(async (email: string, username: string, password: string): Promise<User> => {
        const res = await fetch(`/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Register failed');
        }

        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        setUser(data.user);

        return data.user;
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await authFetch('/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error('Logout error', e);
        }
        localStorage.removeItem('token');
        setUser(null);
    }, [authFetch]);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('token');
            if (!token) { setLoaded(true); return; }

            try {
                const res = await authFetch('api/users/me');
                if (res.ok) {
                    setUser(await res.json());
                } else {
                    localStorage.removeItem('token');
                }
            } catch (e) {
                console.error('Session restore failed', e);
            } finally {
                setLoaded(true);
            }
        })();
    }, [authFetch]);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loaded, login, register, logout, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}