'use client';
import "./page.css";
import { useAuth } from "@/contexts/auth.context";
import { MusicCard } from "@/components/Cards";
import { useSearch } from "@/hooks/useObjects";
import { useEffect } from "react";
import Image from "next/image";
import { LiquidGlass } from "@creativoma/liquid-glass";

export default function UserPage() {
    const { user, loaded, isAuthenticated } = useAuth();

    const { results, searchAll } = useSearch();

    useEffect(() => {
        if (loaded && !isAuthenticated) return;
        // fetchFavorites();
        // searchTracks();
        searchAll(undefined, 20);
        // searchAlbums();
    }, [loaded, isAuthenticated]);

    const tracks = results.tracks ?? [];

    return (
        <main className="w-full min-h-screen text-white md:pr-27 md:pl-27">
            <div className="w-full mx-auto px-6 py-12 flex flex-col gap-16">

                {/* TOP SECTION */}
                <section className="md:pr-20 md:pl-20 flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12">

                    {/* LEFT */}
                    <div className="flex flex-col items-center gap-6">
                        <Image width={200} height={200} src={user?.avatar_url || '/no-avatar.webp'} alt="avatar" className="w-45 h-45 rounded-full bg-gray-700 shadow-lg" />

                        <div className="text-center">
                            <h1 className="text-[42px] font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                                {user?.username}
                            </h1>
                            <p className="text-white/80 text-[18px]">
                                {user?.is_premium ? 'Pro Artist' : 'Artist'}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center lg:justify-end gap-10">

                            {/* FOLLOWERS */}
                            <div className="text-center min-w-[120px]">
                                <div className="text-[52px] font-bold text-cyan-300/30 drop-shadow-[0_4px_10px_rgba(40,190,255,0.76)]">
                                    12K
                                </div>
                                <div className="text-white text-[18px]">Followers</div>
                            </div>

                            {/* LIKES */}
                            <div className="text-center min-w-[120px]">
                                <div className="text-[52px] font-bold text-orange-300/30 drop-shadow-[0_4px_10px_rgba(94,79,57,0.9)]">
                                    8K
                                </div>
                                <div className="text-white text-[18px]">Likes</div>
                            </div>

                            {/* TRACKS */}
                            <div className="text-center min-w-[120px]">
                                <div className="text-[52px] font-bold text-orange-300/30 drop-shadow-[0_4px_10px_rgba(94,79,57,0.9)]">
                                    24
                                </div>
                                <div className="text-white text-[18px]">Active Tracks</div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT STATS */}
                    <div className="flex gap-8">
                        <LiquidGlass className="liquid-col-fix rounded-2xl justify-center pr-4 pl-4 pt-10.5 pb-10.5 min-h-131.75
                            bg-linear-to-b
    from-[#000000]
    via-[#000000]/31 via-52%
    to-[#FFFFFF]/31
     border
     border-gradient-line
                        ">
                            <Image width={100} height={100} src={'/flash-on.svg'} alt="flash" />
                            <div className="text-[52px] font-bold text-cyan-300/30 drop-shadow-[0_4px_10px_rgba(40,190,255,0.76)] flex gap-4 flex-col items-center">
                                <p>User</p>
                                {user?.is_premium ? <p>Subscribed</p> : <p>Unsubscribed</p>}
                            </div>
                        </LiquidGlass>
                        <LiquidGlass className="liquid-col-fix rounded-2xl justify-center pr-4 pl-4 pt-9 pb-9 min-h-131.75
                            bg-linear-to-b
    from-[#000000]
    via-[#000000]/31 via-52%
    to-[#FFFFFF]/31
     border
     border-gradient-line
                        ">
                            <div className="flex gap-9.5 flex-col">
                                <LiquidGlass className="liquid-fix rounded-2xl justify-start pr-5.5 pl-5.5 pt-3 pb-3 w-max min-h-32 md:w-95.25
                            bg-[rgba(255, 255, 255, 0.155)]
                            border
                            border-gradient-line
                        ">
                                    <div className="flex gap-4 flex-col items-start">
                                        <p>Analytics Hub</p>
                                        <svg className="h-14.5" width="169" height="69" viewBox="0 0 169 69" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g filter="url(#filter0_d_227_301)">
                                                <path d="M5.5 59.5L16.5 46H24.5L30.5 39.5H35.5H43.5L51 31.5H62L72.5 28H83.5L90 20L98 31.5H104L111.5 22.5H122L132.5 15.5H144L149 9.5L154 15.5L163.5 1.5" stroke="#FF8D0A" strokeWidth="3" strokeLinecap="round" />
                                            </g>
                                            <defs>
                                                <filter id="filter0_d_227_301" x="0" y="0" width="169" height="69" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feOffset dy="4" />
                                                    <feGaussianBlur stdDeviation="2" />
                                                    <feComposite in2="hardAlpha" operator="out" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_227_301" />
                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_227_301" result="shape" />
                                                </filter>
                                            </defs>
                                        </svg>
                                    </div>
                                    <p className="text-[32px] font-bold text-cyan-300/30 drop-shadow-[0_4px_10px_rgba(40,190,255,0.76)]">3K</p>
                                </LiquidGlass>
                                <LiquidGlass className="liquid-col-fix rounded-2xl justify-start pr-5.5 pl-5.5 pt-3 pb-3 w-max min-h-32 md:w-95.25
                            bg-[rgba(255, 255, 255, 0.155)]
                            border
                            border-gradient-line
                        ">
                                    <div className="flex flex-col gap-1 w-fit h-full justify-center w-full">
                                        <p>Earning Report</p>
                                        <p className="text-[54px] font-bold text-orange-300/30 drop-shadow-[0_4px_10px_rgba(94,79,57,0.9)]">$3500</p>
                                    </div>
                                </LiquidGlass>
                                <LiquidGlass className="liquid-col-fix rounded-2xl justify-start pr-5.5 pl-5.5 pt-3 pb-3 w-max min-h-32 md:w-95.25
                            bg-[rgba(255, 255, 255, 0.155)]
                            border
                            border-gradient-line
                        ">
                                    <div className="flex flex-col gap-1 w-fit h-full justify-center w-full">
                                        <p>Fan Base</p>
                                        <p className="text-[54px] font-bold text-cyan-300/30 drop-shadow-[0_4px_10px_rgba(40,190,255,0.76)]">8K</p>
                                    </div>
                                </LiquidGlass>
                            </div>
                        </LiquidGlass>

                    </div>

                </section>

                {/* TRACKS SECTION */}
                <section className="flex flex-col gap-8">
                    <h2 className="text-3xl font-bold">Tracks</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {tracks.map((t, i) => (
                            <MusicCard key={i} track={t} queue={tracks} />
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}