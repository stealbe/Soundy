'use client';
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth.context';
import { User, Artist, Album, Track, Playlist, Session } from '@/types';

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