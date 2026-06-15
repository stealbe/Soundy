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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack?.id]);

    if (!loaded || !isAuthenticated || !currentTrack) return null;

    const progressPercent = duration
        ? (progress / duration) * 100
        : 0;

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        const audio = audioRef.current;
        if (!audio || !duration) return;

        audio.currentTime = (value / 100) * duration;
        setProgress(audio.currentTime);
    };

    console.log(currentTrack);

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-470.5 z-50">
            <LiquidGlass className="liquid-fix liquid-justify-between w-full flex flex-row flex-nowrap items-center gap-4 px-6 py-3 rounded-[30px] overflow-hidden
                bg-linear-to-b
                from-[#000000]
                via-[#000000]/31 via-52%
                to-[#FFFFFF]/31
                border
                border-gradient-line
                "
                backdropBlur={20}
                displacementScale={120}
                turbulenceBaseFrequency="0.008 0.008"
                turbulenceSeed={2}
            >
                {/* COVER */}
                <div className="relative w-14.5 h-14.5 md:w-20.25 md:h-17.5 shrink-0">
                    <Image
                        src={currentTrack.cover_path || '/no-image'}
                        alt="cover"
                        fill
                        className="object-cover rounded-md cursor-pointer"
                    />
                </div>

                {/* CONTROLS */}
                <div className="flex items-center gap-3 md:gap-8 shrink-0">
                    <Image className='cursor-pointer' src="/shuffle.svg" alt="shuffle" width={30} height={30} />

                    <div className='flex md:gap-[-6px]'>
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
                    </div>

                    <Image className='cursor-pointer' src="/retweet.svg" alt="repeat" width={28} height={28} />
                </div>

                {/* PROGRESS */}
                <div className="flex items-center gap-1.75 max-w-205.75 flex-1 min-w-40 md:min-w-75">
                    <span className="text-white text-xs md:text-sm w-10.5">
                        {fmt(progress)}
                    </span>

                    {/* <input
                        type="range"
                        min={0}
                        max={100}
                        value={progressPercent || 0}
                        onChange={handleSeek}
                        className="w-full h-[6px] cursor-pointer progress-slider"
                    /> */}
                    {/* <div className="relative flex-1 h-[6px] rounded-full overflow-hidden bg-linear-to-b from-[#FF6302]/40 via-[#FFFFFF]/40 via-52% to-[#FF5A27]/31 border border-gradient-line"> <div className="absolute left-0 top-0 h-full bg-[#FF6302] transition-all" style={{ width: `${progressPercent}%` }} /> </div> */}

                    <div className="relative flex-1 min-w-40 md:min-w-75 h-5 flex items-center">
                        {/* BUFFER / TRACK BACKGROUND */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full
                            bg-linear-to-b from-[#FF6302]/40 via-[#FFFFFF]/40 via-52% to-[#FF5A27]/31
                            border border-gradient-line"
                        />

                        {/* PROGRESS FILL */}
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[#FF6302] transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />

                        {/* INPUT OVERLAY */}
                        <input
                            type="range"
                            min={0}
                            max={duration || 1}
                            value={progress}
                            onChange={handleSeek}
                            className="
                                relative w-full h-5
                                appearance-none bg-transparent cursor-pointer z-10
                                [&::-webkit-slider-thumb]:appearance-none
                                [&::-webkit-slider-thumb]:w-3.5
                                [&::-webkit-slider-thumb]:h-3.5
                                [&::-webkit-slider-thumb]:rounded-full
                                [&::-webkit-slider-thumb]:bg-[#FF6302]
                                [&::-webkit-slider-thumb]:border
                                [&::-webkit-slider-thumb]:border-white/60
                                [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,99,2,0.6)]
                                [&::-webkit-slider-thumb]:transition-transform
                                [&::-webkit-slider-thumb]:hover:scale-110

                                [&::-moz-range-thumb]:w-3.5
                                [&::-moz-range-thumb]:h-3.5
                                [&::-moz-range-thumb]:rounded-full
                                [&::-moz-range-thumb]:bg-[#FF6302]
                                [&::-moz-range-thumb]:border
                                [&::-moz-range-thumb]:border-white/60
                            "
                        />
                    </div>

                    <span className="text-white text-xs md:text-sm w-10.5">
                        {fmt(duration)}
                    </span>
                </div>

                <div className='flex gap-3 md:pr-34.5'>
                    <button className='cursor-pointer'>
                        {currentTrack.isLiked ?
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <rect width="40" height="40" fill="url(#pattern0_111_221)" />
                                <defs>
                                    <pattern id="pattern0_111_221" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlinkHref="#image0_111_221" transform="scale(0.015625)" />
                                    </pattern>
                                    <image id="image0_111_221" width="64" height="64" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADM0lEQVR4nO2ay2sUQRCHW3NRxBfiA73pQSXJTtWuiYpCQBIyVZMXwuIDgngRPfgHCEKu3jzoRVBRggeD4EFQ4m73LCbmLIoehUQhBqKoURFNjHTWQFQ22dnt2ZkJ/UHddmrrV9Vdu9PVQlgsFovFYrFYLBZLFcwKsaLAuNdndJUHp5SXPiMZTvjswEA2WxfUn35GP6t9aF/ap/atv0PEiQJlGiXDVckwphhnS9h7SXhdf3Ypf9IDRzHckIQfSvojGFUMV3wv1SCiIu85OyThLUU4s4jwv0wy/FQEl4e7dq/911+up2mTJOgP4k8RTCuGm4+7cHtNxStyDinGibID/T8RY7LdqZ/3pyupCN9W7I9gPNeBB2si3ienRzF+rzTYBdWbzHtOsza9Rar2NxcTdIcqvuCmUDF+MRDsfOU+S8YpY/4Yp3QPCUX8YFtqTbH5mAk2LJOEr0eyB1YbT4BkvBi1uAAr64JR8X63s0ExfIpaWPkGH3OtmfXGEiAZe6MXFXgVnDSYALgXtaDARnDXZALGEpiAUSPi+/rESsnwI3JBAU3HrGOvOgFPXNgctZhKTcdedQKGvMaNUQup1B66zeuqTsBANls39xITA0GRbAGNJHiVuAQQvhCmUIx3kpcA6DeWAEl4OnEJYOw1lgCfm7YlqQ/o/W/kF2AhkuFBgqp/X5jGp3RH1MLKtTwBhXLqKxmeRy1uSSN8pmMVYSAZj8Z++XvYFYr4eSRjIcbVVyJsZLtTLwm+xU88fPU7MntCT4BGMp6P3dJ34ZyoFbPFhhibn0VJ8Ci0xleKfGfDVkX4LgbixwfbUltEFORcaDJ5rh/YCL7WbCJUCknpI0YmRUErr0+pvHS7iAO+h8cDDTWrrjzOKMJjIk7kCc8Wp7WhL/tpfV9AxBHF0K33ZZh7PvR/etXyZ9o7EYL4ST2WF0lAupldho/RXua8fTtFkvBbWlZJgkvVNEfJ+EsRXNOTaZFUfA9aJeObwOIJxhU7nlgODBVnC7fnKlpG1fXdI/2MWG4ozuxXhE8XET+sm6hY7vhu5rB+d1/Q4UfyLnbW/IUmavT1tppfcbNYLBaLxWKxWITmN7PpX097svQ1AAAAAElFTkSuQmCC" />
                                </defs>
                            </svg> :
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <rect width="40" height="40" fill="url(#pattern0_2054_261)" />
                                <defs>
                                    <pattern id="pattern0_2054_261" patternContentUnits="objectBoundingBox" width="1" height="1">
                                        <use xlinkHref="#image0_2054_261" transform="scale(0.015625)" />
                                    </pattern>
                                    <image id="image0_2054_261" width="64" height="64" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAE1klEQVR4AeyaSWgUQRSGTcbJJJmJW0DUoODRfTkEFzzoQQVxIZ4EJW4oLgcFRU/i1ZMHPaiouCF6cRcXokFwQUWNiBuiIIhEgwghmWSSzIzfC9MHB6a7qpeZbqbDe1RV16v//fVXdfV0k8ohZf4XClDmG2BIuAPCHVDmCoS3QJlvgPAQDG+B8BYocwVcuwWy2WxFKpWa1Nvbu7Snp6eZcksymVzT1dU1k76Irs4yRsYKhmDlMJemyKGLZRbvWAAITYPkUUh+z2QyHyB+h4RnKI9XVFRcjEQib+j7zQROSix9ptbX1zeD2FPEdshYwRAsBgnmHclB/3dyHiFmKtcdmW0BINAAkTMQaoPkDliMxwvZKDo2EfsaMQ4zoTra/1lnZ2c9eOfT6fRrOjYSM5KykE0g507w2hhzuru7e1yhQKvrtgRg8vMhIESbSaCDMZSJ7UKE96zeFMYOGvWp0Wj0LY21uA6e3FobKisrX8FpLmMtLT9AJ9ngWNRexeQf0BiN27XxrN4jtnujuNQBasDt2hg4tSLkSl0ALQGY/CzUvkCSGO7U6tnuLbiIKbeIU7wYQl5A0Bk6QMoCsHXjTP4a4HHcLZOzIOEWGDgJBL0K1xrqSqYsAPftbhAn4H63iXDdpUpSSQAUHQHgXjwotg/Ow1XIKgmAossBG4YHxYbDeZkKWSUBOGG1T1eV5B7HKHFWEoDt1OgxWS/g56iAWgrA5CVmjAqYz2LG5rib0pLJmQbwQlJPQBQPmkVz3E15WwqQSCQGTBF83An3lBU9SwEA6MSDKEI/vLtwU7MUgCdAGoQveNDsM9wzVqQtBcgBvMmVQSraVMiqCtCiAuazmPsqfJQE4AVDvvIE6RzoHxgYuCsCWLmSAJym7TxTlQCtEhajn3v/dl1dXYdKLiUBBIhX4eNSBsRPqPJUFiAWi90G9B3ua2OnvoWr8m5VFoBtBXb2oK9nDzl26gHhSlXJlAUQtNra2iuUj3C/Wmt1dfUNHXJaAggwCssn8B6p+8yTcNuuy0lbAO6v92yxfbqJvI6H0x64fdLNoy2AJCDRUQ6EW1L3id+F0zE7XGwJgNpZPkFvJuEvvNTWzo+eZuFkh4gtASQRP45+IYJ8K7R845J4jzzJTmziR89vu/i2BZCE8Xj8JaV8e7N87ybObetn1Zt4Mj1zAuxIAElcU1PzkFVYT93y1ZMYtyxDznU88u45BXQsgBBgFS6xGvJ4lG8HcslLT5NrGzkvu5HEFQGECKtxjOfwaupJ3CtLMvkmcin/1rci4poAkohH0fVIJLKQuu1DibGF7A/bfjGT1/qlVwjMuO6qAAJaVVX1glWaR/0j7pZ9ALORbf/EClC333UBhACr9BWfDelDtJ0cjlnGnwCrEf9G3XXzRABhyeR7Ib2fcgntH7iutTN2OU+ZrZTduoNV4z0TwCCACC34dNrncFlRClOTmLOMmYzLNwjTYKedngsgBFnBv6xkM4eY/B/PU7lWwJ9wiM4hdr2MKRDj6uWiCGAw5hB7zuTm016At+KGPWPCK1jxBXKIGheLURZVAGNCiPAYX8S7RIM49XlM/iYiyPY3wopSlkQAY2a8S/wUN9qlKEsqQCkmnJ8zFCBfkXJrhzug3FY8f77hDshXpNza4Q4I+oo75f8PAAD//7eHL24AAAAGSURBVAMAh8qokMwFU98AAAAASUVORK5CYII=" />
                                </defs>
                            </svg>}
                    </button>
                    <Image className='cursor-pointer' src="/shuffle.svg" alt="shuffle" width={30} height={30} />
                    <Image className='cursor-pointer' src="/collaborator_male.svg" alt='collaborator male' width={40} height={40} />
                    <Image className='cursor-pointer' src="/gears.svg" alt='gears' width={40} height={40} />
                </div>

                {/* AUDIO */}
                <audio
                    ref={audioRef}
                    onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    onEnded={next}
                    onError={(e) => {
                        console.error("Audio error", e.currentTarget.error);

                        setProgress(0);
                        setDuration(0);

                        next(); // пропускаем битый трек
                    }}
                />
            </LiquidGlass>
        </div>
    );
}

function fmt(sec: number) {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}