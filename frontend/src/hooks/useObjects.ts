/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useCallback } from 'react';
import type { Track, Album, Artist, Playlist, User } from '@/types';

type SearchResults = {
    tracks?: Track[];
    albums?: Album[];
    artists?: Artist[];
    playlists?: Playlist[];
};

async function publicFetch<T>(url: string): Promise<T> {
    const res = await fetch(`/api${url}`);
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
}

function useFetch<T>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const get = useCallback(async (url: string): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const json = await publicFetch<T>(url);
            setData(json);
            return json;
        } catch (e: any) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, get };
}

export function useTracks() {
    const { data, loading, error, get } = useFetch<Track[]>();
    const getById = useCallback((id: string) => get(`/tracks/${id}`), [get]);
    const getByIds = useCallback((ids: string[]) => get(`/tracks?id=${ids.join(',')}`), [get]);
    return { tracks: data, loading, error, getById, getByIds };
}

export function useAlbums() {
    const { data, loading, error, get } = useFetch<Album[]>();
    const getById = useCallback((id: string) => get(`/albums/${id}`), [get]);
    const getByIds = useCallback((ids: string[]) => get(`/albums?id=${ids.join(',')}`), [get]);
    return { albums: data, loading, error, getById, getByIds };
}

export function useArtists() {
    const { data, loading, error, get } = useFetch<Artist[]>();
    const getById = useCallback((id: string) => get(`/artists/${id}`), [get]);
    const getByIds = useCallback((ids: string[]) => get(`/artists?id=${ids.join(',')}`), [get]);
    return { artists: data, loading, error, getById, getByIds };
}

export function usePlaylists() {
    const { data, loading, error, get } = useFetch<Playlist[]>();
    const getById = useCallback((id: string) => get(`/playlists/${id}`), [get]);
    const getByIds = useCallback((ids: string[]) => get(`/playlists?id=${ids.join(',')}`), [get]);
    return { playlists: data, loading, error, getById, getByIds };
}

export function useUsers() {
    const { data, loading, error, get } = useFetch<User>();
    const getById = useCallback((id: string) => get(`/users/${id}`), [get]);
    return { user: data, loading, error, getById };
}

export function useSearch() {
    const [results, setResults] = useState<SearchResults>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (path: string) => {
        setLoading(true);
        setError(null);
        try {
            return await publicFetch<any>(`/search${path}`);
        } catch (e: any) {
            setError(e.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const searchTracks = useCallback(async (q?: string, limit = 20) => {
        const params = new URLSearchParams({ limit: String(limit) });
        if (q) params.set('q', q);
        const json = await search(`/tracks?${params}`);
        if (json) setResults(prev => ({ ...prev, tracks: json.tracks }));
    }, [search]);

    const searchAlbums = useCallback(async (q?: string, limit = 20) => {
        const params = new URLSearchParams({ limit: String(limit) });
        if (q) params.set('q', q);
        const json = await search(`/albums?${params}`);
        if (json) setResults(prev => ({ ...prev, albums: json.albums }));
    }, [search]);

    const searchArtists = useCallback(async (q?: string, limit = 20) => {
        const params = new URLSearchParams({ limit: String(limit) });
        if (q) params.set('q', q);
        const json = await search(`/artists?${params}`);
        if (json) setResults(prev => ({ ...prev, artists: json.artists }));
    }, [search]);

    const searchPlaylists = useCallback(async (q?: string, limit = 20) => {
        const params = new URLSearchParams({ limit: String(limit) });
        if (q) params.set('q', q);
        const json = await search(`/playlists?${params}`);
        if (json) setResults(prev => ({ ...prev, playlists: json.playlists }));
    }, [search]);

    const searchAll = useCallback(async (q?: string) => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        const json = await search(`?${params}`);
        if (json) setResults(json);
    }, [search]);

    return { results, loading, error, searchAll, searchTracks, searchAlbums, searchArtists, searchPlaylists };
}