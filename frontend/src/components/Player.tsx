// components/Player.tsx
'use client';
import { useEffect, useRef } from 'react';
import { usePlayer } from '@/contexts/player.context';
import { useAuth } from '@/contexts/auth.context';

export default function Player() {
    const { isAuthenticated, loaded } = useAuth();

    const { state, pause, next, prev, playFromList } = usePlayer();
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentTrack = state.playlistId && state.currentTrackIndex !== null
        ? state.playlists[state.playlistId]?.[state.currentTrackIndex]
        : null;

    // меняем src когда меняется трек
    useEffect(() => {
        if (!audioRef.current || !currentTrack?.path) return;
        audioRef.current.src = currentTrack.path;
        if (state.isPlaying) audioRef.current.play();
    }, [currentTrack?.id]);

    // play/pause
    useEffect(() => {
        if (!audioRef.current) return;
        state.isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }, [state.isPlaying]);

    if (!loaded || !isAuthenticated || !currentTrack) return null;

    console.log('currentTrack:', currentTrack);
    console.log('path:', currentTrack?.path);

    return (
        <div className="fixed bottom-0 w-full bg-zinc-900 p-4 flex items-center gap-4 z-50">
            <audio ref={audioRef} onEnded={next} />
            <img src={currentTrack.cover_path} className="w-12 h-12 rounded" />
            <div>
                <p className="text-white font-bold">{currentTrack.title}</p>
                <p className="text-zinc-400 text-sm">{currentTrack.artists?.[0]?.name}</p>
            </div>
            <button onClick={prev}>⏮</button>
            <button onClick={() => state.isPlaying ? pause() : playFromList(state.playlistId!, state.currentTrackIndex!)}>
                {state.isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={next}>⏭</button>
        </div>
    );
}