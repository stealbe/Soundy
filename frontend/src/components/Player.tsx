'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '@/contexts/player.context';
import { useAuth } from '@/contexts/auth.context';
import { LiquidGlass } from '@creativoma/liquid-glass';

export default function Player() {
    const { isAuthenticated, loaded } = useAuth();
    const { state, pause, play, next, prev, getCurrentTrack } = usePlayer();

    const audioRef = useRef<HTMLAudioElement>(null);

    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const currentTrack = getCurrentTrack();

    // 🎧 play / pause sync
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (state.isPlaying) {
            audio.play().catch(() => { });
        } else {
            audio.pause();
        }
    }, [state.isPlaying]);

    // 🎧 track change
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentTrack?.path) return;

        audio.src = currentTrack.path;
        audio.load();

        if (state.isPlaying) {
            audio.play().catch(() => { });
        }
    }, [currentTrack?.id]);

    if (!loaded || !isAuthenticated || !currentTrack) return null;

    const progressPercent = duration
        ? (progress / duration) * 100
        : 0;

    return (
        <LiquidGlass
            className="
                fixed bottom-4 left-1/2 -translate-x-1/2
                w-[95%] max-w-[1882px]
                flex flex-wrap md:flex-nowrap
                items-center
                gap-4 md:gap-[40px]
                px-4 md:px-[48px]
                py-3 md:py-[11px]
                rounded-[30px]
                z-50
            "
            backdropBlur={20}
            displacementScale={120}
            turbulenceBaseFrequency="0.008 0.008"
            turbulenceSeed={2}
        >
            {/* COVER */}
            <div className="relative w-[58px] h-[58px] md:w-[81px] md:h-[70px] shrink-0">
                <Image
                    src={currentTrack.cover_path || '/no-image'}
                    alt="cover"
                    fill
                    className="object-cover rounded-[6px]"
                />
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-3 md:gap-[32px] shrink-0">
                <Image src="/shuffle.svg" alt="shuffle" width={28} height={28} />

                <Image
                    src="/skip-to-start.svg"
                    alt="prev"
                    width={30}
                    height={30}
                    onClick={prev}
                    className="cursor-pointer"
                />

                <Image
                    src={state.isPlaying ? "/icons/pause.svg" : "/play-button-circled.svg"}
                    alt="play"
                    width={36}
                    height={36}
                    onClick={() =>
                        state.isPlaying ? pause() : play()
                    }
                    className="cursor-pointer"
                />

                <Image
                    src="/end.svg"
                    alt="next"
                    width={30}
                    height={30}
                    onClick={next}
                    className="cursor-pointer"
                />

                <Image src="/retweet.svg" alt="repeat" width={28} height={28} />
            </div>

            {/* TRACK INFO */}
            <div className="flex flex-col min-w-[120px] md:min-w-[160px]">
                <span className="text-white font-bold text-sm md:text-[15px] truncate">
                    {currentTrack.title}
                </span>
                <span className="text-white/60 text-xs md:text-sm truncate">
                    {currentTrack.artists?.[0]?.name}
                </span>
            </div>

            {/* PROGRESS */}
            <div className="flex items-center gap-3 flex-1 min-w-[160px] md:min-w-[300px]">
                <span className="text-white text-xs md:text-sm w-[42px]">
                    {fmt(progress)}
                </span>

                <div className="relative flex-1 h-[6px] rounded-full bg-white/10 overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-white transition-all" style={{ width: `${progressPercent}%` }} />
                </div>

                <span className="text-white text-xs md:text-sm w-[42px]">
                    {fmt(duration)}
                </span>
            </div>

            {/* AUDIO */}
            <audio ref={audioRef}
                onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={next}
            />
        </LiquidGlass>
    );
}

function fmt(sec: number) {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}