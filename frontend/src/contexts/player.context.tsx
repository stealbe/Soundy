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

    const [state, setState] = useState<PlayerState>({
        queue: [],
        currentIndex: null,
        isPlaying: false,
        streamUrl: null,
    });

    const resolveStream = async (track: Track): Promise<string | null> => {
        if (track.path) return track.path;

        if (streamCache.current[track.id]) {
            return streamCache.current[track.id];
        }

        const res = await get(`/tracks/${track.id}/stream`);
        if (!res?.stream) return null;

        streamCache.current[track.id] = res.stream;
        return res.stream;
    };

    const playQueue = async (tracks: Track[], startIndex = 0) => {
        const track = tracks[startIndex];

        const stream = await resolveStream(track);
        if (!stream) {
            setState({
                queue: tracks,
                currentIndex: startIndex,
                isPlaying: false,
                streamUrl: null,
            });
            return;
        }

        setState({
            queue: tracks,
            currentIndex: startIndex,
            isPlaying: true,
            streamUrl: stream,
        });
    };

    const pause = () =>
        setState(prev => ({ ...prev, isPlaying: false }));

    const play = () =>
        setState(prev => ({ ...prev, isPlaying: true }));

    const next = async () => {
        const prevState = state;

        if (!prevState.queue.length || prevState.currentIndex === null) return;

        const nextIndex =
            (prevState.currentIndex + 1) % prevState.queue.length;

        const track = prevState.queue[nextIndex];

        setState(prev => ({
            ...prev,
            currentIndex: nextIndex,
        }));

        const stream = await resolveStream(track);

        if (nextIndex !== state.currentIndex) return;

        if (!stream) {
            setState(prev => ({ ...prev, isPlaying: false }));
            return;
        }

        setState(prev => ({
            ...prev,
            streamUrl: stream,
            isPlaying: true,
        }));
    };

    const prev = async () => {
        const prevState = state;

        if (!prevState.queue.length || prevState.currentIndex === null) return;

        const prevIndex =
            (prevState.currentIndex - 1 + prevState.queue.length) %
            prevState.queue.length;

        const track = prevState.queue[prevIndex];

        setState(prev => ({
            ...prev,
            currentIndex: prevIndex,
        }));

        const stream = await resolveStream(track);

        if (prevIndex !== state.currentIndex) return;

        if (!stream) {
            setState(prev => ({ ...prev, isPlaying: false }));
            return;
        }

        setState(prev => ({
            ...prev,
            streamUrl: stream,
            isPlaying: true,
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