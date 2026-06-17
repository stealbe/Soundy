'use client';

import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { Track } from "@/types";
import { useFetch } from "@/hooks/useObjects";

type PlayerState = {
    queue: Track[];
    currentIndex: number | null;
    isPlaying: boolean;
    streamUrl: string | null;
    progress: number;
    duration: number;
};

type PlayerContextType = {
    state: PlayerState;
    playQueue: (tracks: Track[], startIndex?: number) => Promise<void>;
    pause: () => void;
    play: () => void;
    next: () => Promise<void>;
    prev: () => Promise<void>;
    seek: (time: number) => void;
    getCurrentTrack: () => Track | null;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const { get } = useFetch<{ stream: string }>();
    const streamCache = useRef<Record<string, string>>({});
    const requestIdRef = useRef(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [state, setState] = useState<PlayerState>({
        queue: [],
        currentIndex: null,
        isPlaying: false,
        streamUrl: null,
        progress: 0,
        duration: 0,
    });

    const stateRef = useRef(state);
    useEffect(() => { stateRef.current = state; }, [state]);

    // — AUDIO INIT —
    useEffect(() => {
        const audio = new Audio();
        audioRef.current = audio;

        const onTimeUpdate = () => setState(s => ({ ...s, progress: audio.currentTime }));
        const onLoadedMetadata = () => setState(s => ({ ...s, duration: audio.duration || 0 }));
        const onEnded = () => nextRef.current();
        const onError = () => {
            setState(s => ({ ...s, progress: 0, duration: 0 }));
            nextRef.current();
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);

        return () => {
            audio.pause();
            audio.src = '';
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);
        };
    }, []);

    // — STREAM URL CHANGE → load audio —
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        audio.removeAttribute('src');
        audio.load();

        setState(s => ({ ...s, progress: 0, duration: 0 }));

        if (!state.streamUrl) return;

        audio.src = state.streamUrl;
        audio.load();

        if (state.isPlaying) {
            audio.addEventListener('canplay', function onCanPlay() {
                audio.play().catch(console.error);
                audio.removeEventListener('canplay', onCanPlay);
            });
        }
    }, [state.streamUrl]);

    // — ISPLAYING CHANGE → play/pause —
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !state.streamUrl) return;

        if (state.isPlaying) {
            audio.play().catch(console.error);
        } else {
            audio.pause();
        }
    }, [state.isPlaying]);

    // — RESOLVE STREAM —
    const resolveStream = useCallback(async (track: Track): Promise<string | null> => {
        if (!track) return null;
        if (track.path) return track.path;

        if (streamCache.current[track.id]) return streamCache.current[track.id];

        try {
            const res = await get(`/tracks/${track.id}/stream`);
            if (!res?.stream) return null;
            streamCache.current[track.id] = res.stream;
            return res.stream;
        } catch {
            return null;
        }
    }, [get]);

    // — NEXT / PREV через ref чтобы не было stale closure в audio listeners —
    const nextRef = useRef<() => Promise<void>>(async () => { });
    const prevRef = useRef<() => Promise<void>>(async () => { });

    const next = useCallback(async () => {
        const { queue, currentIndex } = stateRef.current;
        if (!queue.length || currentIndex === null) return;

        const nextIndex = (currentIndex + 1) % queue.length;
        const track = queue[nextIndex];

        setState(s => ({ ...s, currentIndex: nextIndex, streamUrl: null, isPlaying: false }));

        const stream = await resolveStream(track);

        setState(s => ({ ...s, streamUrl: stream, isPlaying: !!stream }));

        if (!stream) setTimeout(() => nextRef.current(), 0);
    }, [resolveStream]);

    const prev = useCallback(async () => {
        const { queue, currentIndex } = stateRef.current;
        if (!queue.length || currentIndex === null) return;

        const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
        const track = queue[prevIndex];

        setState(s => ({ ...s, currentIndex: prevIndex, streamUrl: null, isPlaying: false }));

        const stream = await resolveStream(track);

        setState(s => ({ ...s, streamUrl: stream, isPlaying: !!stream }));

        if (!stream) setTimeout(() => prevRef.current(), 0);
    }, [resolveStream]);

    useEffect(() => { nextRef.current = next; }, [next]);
    useEffect(() => { prevRef.current = prev; }, [prev]);

    // — PLAY QUEUE —
    const playQueue = useCallback(async (tracks: Track[], startIndex = 0) => {
        const requestId = ++requestIdRef.current;

        const track = tracks[startIndex];
        if (!track) return;

        const stream = await resolveStream(track);

        if (requestId !== requestIdRef.current) return;

        setState({
            queue: tracks,
            currentIndex: startIndex,
            isPlaying: !!stream,
            streamUrl: stream,
            progress: 0,
            duration: 0,
        });

        if (!stream) setTimeout(() => nextRef.current(), 0);
    }, [resolveStream]);

    const pause = useCallback(() => setState(s => ({ ...s, isPlaying: false })), []);
    const play = useCallback(() => setState(s => ({ ...s, isPlaying: true })), []);

    const seek = useCallback((time: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = time;
        setState(s => ({ ...s, progress: time }));
    }, []);

    const getCurrentTrack = useCallback(() => {
        const { queue, currentIndex } = stateRef.current;
        if (currentIndex === null) return null;
        return queue[currentIndex] ?? null;
    }, []);

    return (
        <PlayerContext.Provider value={{ state, playQueue, pause, play, next, prev, seek, getCurrentTrack }}>
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
    return ctx;
}