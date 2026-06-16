'use client';

import { createContext, useContext, useState, useRef } from "react";
import { Track } from "@/types";
import { useFetch } from "@/hooks/useObjects";

type PlayerState = {
    queue: Track[];
    currentIndex: number | null;
    isPlaying: boolean;
    streamUrl: string | null;
};

type PlayerContextType = {
    state: PlayerState;

    playQueue: (tracks: Track[], startIndex?: number) => Promise<void>;
    pause: () => void;
    play: () => void;

    next: () => Promise<void>;
    prev: () => Promise<void>;

    getCurrentTrack: () => Track | null;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const { get } = useFetch<{ stream: string }>();
    const streamCache = useRef<Record<string, string>>({});
    const requestIdRef = useRef(0);

    const [state, setState] = useState<PlayerState>({
        queue: [],
        currentIndex: null,
        isPlaying: false,
        streamUrl: null,
    });

    const resolveStream = async (track: Track): Promise<string | null> => {
        if (!track) return null;
        if (track?.path) return track.path;

        if (streamCache.current[track.id]) {
            return streamCache.current[track.id];
        }

        const res = await get(`/tracks/${track.id}/stream`);
        if (!res?.stream) return null;

        streamCache.current[track.id] = res.stream;
        return res.stream;
    };

    const playQueue = async (tracks: Track[], startIndex = 0) => {
        const requestId = ++requestIdRef.current;

        const track = tracks[startIndex];
        if (!track) return;
        const stream = await resolveStream(track);

        if (requestId !== requestIdRef.current) return;

        setState({
            queue: tracks,
            currentIndex: startIndex,
            isPlaying: true,
            streamUrl: stream ?? null,
        });
    };

    const pause = () =>
        setState(prev => ({ ...prev, isPlaying: false }));

    const play = () =>
        setState(prev => ({ ...prev, isPlaying: true }));

    const next = async () => {
        let track: Track | null = null;

        setState(prev => {
            if (!prev.queue.length || prev.currentIndex === null) return prev;

            const nextIndex = (prev.currentIndex + 1) % prev.queue.length;
            track = prev.queue[nextIndex];

            return {
                ...prev,
                currentIndex: nextIndex,
            };
        });

        if (!track) return;

        const stream = await resolveStream(track);

        setState(prev => ({
            ...prev,
            streamUrl: stream ?? null,
            isPlaying: !!stream,
        }));
    };

    const prev = async () => {
        let track: Track | null = null;

        setState(prev => {
            if (!prev.queue.length || prev.currentIndex === null) return prev;

            const prevIndex =
                (prev.currentIndex - 1 + prev.queue.length) % prev.queue.length;

            track = prev.queue[prevIndex];

            return {
                ...prev,
                currentIndex: prevIndex,
            };
        });

        if (!track) return;

        const stream = await resolveStream(track);

        setState(prev => ({
            ...prev,
            streamUrl: stream ?? null,
            isPlaying: !!stream,
        }));
    };

    const getCurrentTrack = () => {
        if (state.currentIndex === null) return null;
        return state.queue[state.currentIndex] ?? null;
    };

    return (
        <PlayerContext.Provider
            value={{
                state,
                playQueue,
                pause,
                play,
                next,
                prev,
                getCurrentTrack,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
    return ctx;
}