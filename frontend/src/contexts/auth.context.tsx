'use client';
import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';

export type User = {
    id: string;
    username: string;
    email: string;
    created_at?: string;
    avatar_url?: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    loaded: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    authFetch: (input: string, init?: RequestInit) => Promise<Response>;
};

const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loaded, setLoaded] = useState(false);

    const authFetch = useCallback(async (input: string, init: RequestInit = {}): Promise<Response> => {
        const token = localStorage.getItem('token');

        const res = await fetch(`/api${input}`, {
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
        const hashedPassword = await hashPassword(password);

        const res = await fetch(`/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: hashedPassword }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Login failed');
        }

        const data = await res.json();
        localStorage.setItem('token', data.token);

        const profile = await authFetch('/users/me');
        const profileData: User = await profile.json();
        setUser(profileData);

        return profileData;
    }, [authFetch]);

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
                const res = await authFetch('/users/me');
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
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loaded, login, logout, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}