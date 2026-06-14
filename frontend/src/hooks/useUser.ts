'use client';
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth.context';

export type User = {
    id: string;
    email: string;
    username: string;
    avatar_url?: string;
    is_premium?: boolean;
    country_code?: string;
    is_active?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme_config?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
};

export type Artist = {
    id: string;
    name: string;
    created_at?: string;
    subscribers?: number;
};

export type Album = {
    id: string;
    title: string;
    year?: number;
    cover_path?: string;
    created_at?: string;
};

export type Track = {
    index: number;
    id: string;
    album_id?: string;
    title: string;
    year?: number;
    genre?: string;
    duration_ms?: number;
    is_explicit?: boolean;
    play_count?: number;
    path?: string;
    cover_path?: string;
    created_at?: string;
    updated_at?: string;
    likes?: number;
    reposts?: number;
    comments?: number;
    // joined
    artist_name?: string;
};

export type Playlist = {
    id: string;
    owner_id: string;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
};

export type Session = {
    id: string;
    user_id: string;
    device_info?: string;
    expires_at?: string;
    last_used_at?: string;
    revoked?: boolean;
    created_at?: string;
};

export function useUser() {
    const { authFetch, logout } = useAuth();

    // --- favorites ---
    const [favorites, setFavorites] = useState<Track[]>([]);
    const [favLoading, setFavLoading] = useState(false);

    const fetchFavorites = useCallback(async (limit = 20, offset = 0) => {
        setFavLoading(true);
        try {
            const res = await authFetch(`/api/users/me/favorites?limit=${limit}&offset=${offset}`);
            setFavorites(await res.json());
        } finally {
            setFavLoading(false);
        }
    }, [authFetch]);

    const addFavorite = useCallback(async (trackId: string) => {
        await authFetch(`/api/users/me/favorites/${trackId}`, { method: 'POST' });
        await fetchFavorites();
    }, [authFetch, fetchFavorites]);

    const removeFavorite = useCallback(async (trackId: string) => {
        await authFetch(`/api/users/me/favorites/${trackId}`, { method: 'DELETE' });
        setFavorites(prev => prev.filter(t => t.id !== trackId));
    }, [authFetch]);

    // --- library ---
    const [library, setLibrary] = useState<Track[]>([]);
    const [libLoading, setLibLoading] = useState(false);

    const fetchLibrary = useCallback(async (limit = 20, offset = 0) => {
        setLibLoading(true);
        try {
            const res = await authFetch(`/api/users/me/library?limit=${limit}&offset=${offset}`);
            setLibrary(await res.json());
        } finally {
            setLibLoading(false);
        }
    }, [authFetch]);

    const addToLibrary = useCallback(async (trackId: string) => {
        await authFetch(`/api/users/me/library/${trackId}`, { method: 'POST' });
        await fetchLibrary();
    }, [authFetch, fetchLibrary]);

    const removeFromLibrary = useCallback(async (trackId: string) => {
        await authFetch(`/api/users/me/library/${trackId}`, { method: 'DELETE' });
        setLibrary(prev => prev.filter(t => t.id !== trackId));
    }, [authFetch]);

    // --- sessions ---
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sessLoading, setSessLoading] = useState(false);

    const fetchSessions = useCallback(async () => {
        setSessLoading(true);
        try {
            const res = await authFetch('/api/users/me/sessions');
            setSessions(await res.json());
        } finally {
            setSessLoading(false);
        }
    }, [authFetch]);

    const revokeSession = useCallback(async (sessionId: string) => {
        await authFetch(`/api/users/me/sessions/${sessionId}`, { method: 'DELETE' });
        setSessions(prev => prev.filter(s => s.id !== sessionId));
    }, [authFetch]);

    const revokeAllSessions = useCallback(async () => {
        await authFetch('/api/users/me/sessions', { method: 'DELETE' });
        await logout();
    }, [authFetch, logout]);

    // --- update profile ---
    const updateMe = useCallback(async (data: Partial<{ username: string; email: string; avatar_url: string }>) => {
        const res = await authFetch('/api/users/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return res.json();
    }, [authFetch]);

    // --- delete account ---
    const deleteMe = useCallback(async () => {
        await authFetch('/api/users/me', { method: 'DELETE' });
        await logout();
    }, [authFetch, logout]);

    return {
        // favorites
        favorites, favLoading,
        fetchFavorites, addFavorite, removeFavorite,
        // library
        library, libLoading,
        fetchLibrary, addToLibrary, removeFromLibrary,
        // sessions
        sessions, sessLoading,
        fetchSessions, revokeSession, revokeAllSessions,
        // profile
        updateMe, deleteMe,
    };
}