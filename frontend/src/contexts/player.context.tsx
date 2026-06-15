'use client';

import { createContext, useContext, useState } from "react";
import { Track } from "@/types";

type PlayerState = {
    queue: Track[];
    currentIndex: number | null;
    isPlaying: boolean;
};

type PlayerContextType = {
    state: PlayerState;

    playQueue: (tracks: Track[], startIndex?: number) => void;
    pause: () => void;
    play: () => void;

    next: () => void;
    prev: () => void;

    getCurrentTrack: () => Track | null;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<PlayerState>({
        queue: [],
        currentIndex: null,
        isPlaying: false,
    });

    const playQueue = (tracks: Track[], startIndex = 0) => {
        if (state.queue === tracks && state.currentIndex === startIndex) {
            setState(prev => ({ ...prev, isPlaying: true }));
        }
        setState({
            queue: tracks,
            currentIndex: startIndex,
            isPlaying: true,
        });
    };

    const pause = () =>
        setState(prev => ({ ...prev, isPlaying: false }));

    const play = () =>
        setState(prev => ({ ...prev, isPlaying: true }));

    const next = () =>
        setState(prev => {
            if (prev.currentIndex === null) return prev;
            const nextIndex = (prev.currentIndex + 1) % prev.queue.length;

            return {
                ...prev,
                currentIndex: nextIndex,
                isPlaying: true,
            };
        });

    const prev = () =>
        setState(prev => {
            if (prev.currentIndex === null) return prev;
            const prevIndex =
                (prev.currentIndex - 1 + prev.queue.length) % prev.queue.length;

            return {
                ...prev,
                currentIndex: prevIndex,
                isPlaying: true,
            };
        });

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