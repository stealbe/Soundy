'use client';
import { createContext, useContext, useState } from "react";
import { Track } from "@/types";
import { useCallback } from "react";

type PlayerState = {
    playlists: Record<string, Track[]>;
    playlistId: string | null;
    currentTrackIndex: number | null;
    isPlaying: boolean;
};

type PlayerContextType = {
    state: PlayerState;
    registerPlaylist: (id: string, tracks: Track[]) => void;
    playFromList: (playlistId: string, index: number) => void;
    pause: () => void;
    next: () => void;
    prev: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<PlayerState>({
        playlists: {},
        playlistId: null,
        currentTrackIndex: null,
        isPlaying: false
    });

    const registerPlaylist = useCallback((id: string, tracks: Track[]) =>
        setState(prev => ({
            ...prev,
            playlists: { ...prev.playlists, [id]: tracks }
        })), []);

    const playFromList = (playlistId: string, index: number) =>
        setState(prev => ({
            ...prev,
            playlistId,
            currentTrackIndex: index,
            isPlaying: true,
        }));

    const pause = () =>
        setState(prev => ({ ...prev, isPlaying: false }));

    const next = () =>
        setState(prev => {
            if (prev.currentTrackIndex === null || !prev.playlistId) return prev;
            const tracks = prev.playlists[prev.playlistId] ?? [];
            const nextIndex = (prev.currentTrackIndex + 1) % tracks.length;
            return { ...prev, currentTrackIndex: nextIndex, isPlaying: true };
        });

    const prev = () =>
        setState(prev => {
            if (prev.currentTrackIndex === null || !prev.playlistId) return prev;
            const tracks = prev.playlists[prev.playlistId] ?? [];
            const prevIndex = (prev.currentTrackIndex - 1 + tracks.length) % tracks.length;
            return { ...prev, currentTrackIndex: prevIndex, isPlaying: true };
        });

    return (
        <PlayerContext.Provider value={{ state, registerPlaylist, playFromList, pause, next, prev }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer(): PlayerContextType {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
    return ctx;
}