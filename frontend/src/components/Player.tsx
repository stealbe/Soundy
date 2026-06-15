'use client';

import { useEffect, useRef } from 'react';
import { usePlayer } from '@/contexts/player.context';
import { useAuth } from '@/contexts/auth.context';

export default function Player() {
    const { isAuthenticated, loaded } = useAuth();
    const { state, pause, next, prev } = usePlayer();

    const audioRef = useRef<HTMLAudioElement>(null);

    // 👇 защита от гонок
    const playToken = useRef(0);

    const currentTrack =
        state.playlistId && state.currentTrackIndex !== null
            ? state.playlists[state.playlistId]?.[state.currentTrackIndex]
            : null;

    // 1. смена трека
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack?.path) return;

        const token = ++playToken.current;

        audio.src = currentTrack.path;
        audio.load();

        const tryPlay = async () => {
            try {
                await audio.play();

                // если уже сменился трек — игнор
                if (token !== playToken.current) return;
            } catch (err) {
                // игнорируем устаревшие play()
                if (token !== playToken.current) return;
                console.warn('play aborted or interrupted', err);
            }
        };

        if (state.isPlaying) {
            tryPlay();
        }

    }, [currentTrack?.id]);

    // 2. play/pause
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (state.isPlaying) {
            audio.play().catch(() => { });
        } else {
            audio.pause();
        }
    }, [state.isPlaying]);

    if (!loaded || !isAuthenticated || !currentTrack) return null;

    return (
        <div className="fixed bottom-0 w-full bg-zinc-900 p-4 flex items-center gap-4 z-50">
            <audio
                ref={audioRef}
                onEnded={next}
            />

            <img
                src={currentTrack.cover_path}
                className="w-12 h-12 rounded"
            />

            <div>
                <p className="text-white font-bold">
                    {currentTrack.title}
                </p>
                <p className="text-zinc-400 text-sm">
                    {currentTrack.artists?.[0]?.name}
                </p>
            </div>

            <button onClick={prev}>⏮</button>

            <button
                onClick={() =>
                    state.isPlaying
                        ? pause()
                        : next() // можно заменить на resume позже
                }
            >
                {state.isPlaying ? '⏸' : '▶'}
            </button>

            <button onClick={next}>⏭</button>
        </div>
    );
}