"use client";
import { ArtistCardS, MusicCardS } from "./Cards";
import { useAuth } from '@/contexts/auth.context';
import Image from "next/image";
import { LiquidGlass } from "@creativoma/liquid-glass";
import { Track } from "@/types";
import { useSearch } from "@/hooks/useObjects";
import { useEffect } from "react";

export default function SideNav({ className = "" }: { className?: string }) {
    const { isAuthenticated, loaded } = useAuth();
    const { results, searchArtists, searchTracks } = useSearch();

    useEffect(() => {
        searchArtists('', 3);
        searchTracks('', 3);
    }, [loaded, isAuthenticated])

    if (!loaded || !isAuthenticated) return null;

    return (
        <aside className={`w-108 flex-none sticky top-0 ${className}`}>
            <LiquidGlass
                className="
    w-full flex flex-col items-center overflow-hidden rounded-2xl
    pt-12 pb-12
    bg-linear-to-b
    from-[#000000]
    via-[#000000]/31 via-52%
    to-[#FFFFFF]/31
     border
     border-gradient-line
  "
                backdropBlur={20}
                displacementScale={140}
                turbulenceBaseFrequency="0.008 0.008"
                turbulenceSeed={1}
            >
                <div className="w-100.25 h-65.75 shrink-0 relative z-2">
                    <div className="w-full flex flex-col gap-6 items-center mx-auto">
                        <span className="text-white text-2xl font-bold text-center">
                            Artist Tools
                        </span>

                        <div className="flex gap-6 justify-center flex-wrap w-full">
                            <Image className="cursor-pointer" width={80} height={108} src="/a-tool-1.svg" alt="artist-tool-1" />
                            <Image className="cursor-pointer" width={80} height={108} src="/a-tool-2.svg" alt="artist-tool-2" />
                            <Image className="cursor-pointer" width={80} height={108} src="/a-tool-3.svg" alt="artist-tool-3" />
                            <Image className="cursor-pointer" width={80} height={108} src="/a-tool-4.svg" alt="artist-tool-4" />
                        </div>
                    </div>
                    <div className="w-93.75 h-13.75 relative z-3 mt-7 mr-0 mb-0 ml-5.25">
                        <div className="w-93.75 h-13.75 bg-[rgba(217,217,217,0.07)] rounded-[30px] absolute top-0 left-0 z-4" />
                        <div className="w-11.25 h-11.25 bg-[url(https://static.codia.ai/image/2026-06-12/SsRDz158Dg.png)] bg-contain bg-no-repeat absolute top-1.25 left-2 z-5 cursor-pointer" />
                        <span className="flex h-4 justify-start items-start font-['Inter'] text-[13px] font-bold leading-[15.733px] text-white absolute top-5 left-14 text-left whitespace-nowrap z-6">
                            Unlock Artist tools from UAH 69.99/month.
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-4.25 items-center self-stretch shrink-0 flex-nowrap relative z-15">
                    <div className="flex flex-col gap-3 items-start self-stretch shrink-0 flex-nowrap relative z-16">
                        <div className="flex pt-3 pr-4 pb-3 pl-4 flex-col gap-4 items-start self-stretch shrink-0 flex-nowrap relative overflow-hidden z-17">
                            <div className="w-99 h-6 shrink-0 relative z-18">
                                <span className="flex h-6 justify-start items-start font-['Inter'] text-[20px] font-bold leading-6 text-white absolute top-0 left-0 text-left whitespace-nowrap z-19">
                                    Artist you should follow
                                </span>
                                <span className="flex h-6 justify-start items-start font-['Inter'] text-[20px] font-bold leading-6 text-[rgba(105,104,104,0.98)] absolute top-0 left-68.5 text-left whitespace-nowrap z-20 cursor-pointer">
                                    reshresh list
                                </span>
                            </div>
                            {(results.artists ?? []).map(a => <ArtistCardS key={a.id} {...a} />)}
                        </div>
                        <div className="flex pt-3 pr-4 pb-3 pl-4 flex-col gap-6.5 items-start self-stretch shrink-0 flex-nowrap relative overflow-hidden z-66">
                            <span className="h-6 self-stretch shrink-0 basis-auto font-['Inter'] text-[20px] font-bold leading-6 text-white relative text-left whitespace-nowrap z-67">
                                230 Likes
                            </span>
                            {(results.tracks ?? []).map(t => <MusicCardS key={t.id} track={t} queue={results.tracks ?? []} />)}
                        </div>
                        <div className="flex pt-3 pr-4 pb-3 pl-4 flex-col gap-6 items-start self-stretch shrink-0 flex-nowrap relative overflow-hidden z-125">
                            <span className="h-6 self-stretch shrink-0 basis-auto font-['Inter'] text-[20px] font-bold leading-6 text-white relative text-left whitespace-nowrap z-126">
                                Listening history
                            </span>
                            <div className="flex flex-col gap-6.5 items-start self-stretch shrink-0 flex-nowrap relative z-127">
                                {(results.tracks ?? []).map(t => <MusicCardS key={t.id} track={t} queue={results.tracks ?? []} />)}
                            </div>
                        </div>
                    </div>
                    <div className="flex w-97.75 flex-col gap-4 items-start shrink-0 flex-nowrap relative z-185">
                        <span className="h-6 self-stretch shrink-0 basis-auto font-['Inter'] text-[20px] font-bold leading-6 text-white relative text-left whitespace-nowrap z-186">
                            Go Mobile
                        </span>
                        <div className="flex gap-4 items-center self-stretch shrink-0 flex-nowrap relative z-187">
                            <div className="w-49.75 h-18.75 shrink-0 relative z-188">
                                <div className="w-44 h-18.75 bg-[rgba(217,217,217,0)] rounded-[25px] border-solid border border-black absolute top-0 left-0 z-189" />
                                <div className="w-44.5 h-9.75 absolute top-3.75 left-5.25 z-190">
                                    <div className="w-8.25 h-9.75 bg-[url(https://static.codia.ai/image/2026-06-12/67RsvUQ4RM.png)] bg-cover bg-no-repeat absolute top-0 left-0 z-194" />
                                    <div className="w-32.75 h-8.25 text-[0px] absolute top-1.5 left-11.75 z-191">
                                        <span className="block h-3.25 font-['Inter'] text-[12px] font-normal leading-3.25 text-white relative text-left whitespace-nowrap z-192 mt-0 mr-0 mb-0 ml-0">
                                            Download on the
                                        </span>
                                        <span className="block h-5 font-['Inter'] text-[15px] font-bold leading-[18.153px] text-white relative text-left whitespace-nowrap z-193 mt-0 mr-0 mb-0 ml-5.5">
                                            App Store
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-44 h-18.75 shrink-0 relative z-195">
                                <div className="w-38 h-9.75 relative z-197 mt-3.75 mr-0 mb-0 ml-5">
                                    <div className="w-26.25 h-9.25 text-[0px] absolute top-0 left-11.75 z-198">
                                        <span className="block h-3.75 font-['Inter'] text-[12px] font-normal leading-[14.523px] text-white relative text-left whitespace-nowrap z-199 mt-0 mr-0 mb-0 ml-0">
                                            GET IT ON
                                        </span>
                                        <span className="block h-5.5 font-['Inter'] text-[18px] font-bold leading-[21.784px] text-white relative text-left whitespace-nowrap z-200 mt-0 mr-0 mb-0 ml-0">
                                            Google Play
                                        </span>
                                    </div>
                                    <div className="w-[41.001px] h-10 bg-[url(https://static.codia.ai/image/2026-06-12/09jfUijFnh.png)] bg-cover bg-no-repeat absolute top-[-0.5px] left-[-0.5px] z-201" />
                                </div>
                                <div className="w-44 h-18.75 bg-[rgba(217,217,217,0)] rounded-[25px] border-solid border border-black absolute top-0 left-0 z-196" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-7 self-stretch shrink-0 bg-[url(https://static.codia.ai/image/2026-06-12/UTtZKmXYb9.png)] bg-cover bg-no-repeat relative z-202 my-5" />
                <div className="flex w-81.5 px-5 flex-col gap-6.5 items-start shrink-0 flex-nowrap relative overflow-hidden z-203">
                    <span className="h-6 self-stretch shrink-0 basis-auto font-['Inter'] text-[20px] font-bold leading-6 text-white relative text-left whitespace-nowrap z-67">
                        230 Likes
                    </span>
                    {(results.tracks ?? []).map(t => <MusicCardS key={t.id} track={t} queue={results.tracks ?? []} />)}
                </div>
            </LiquidGlass>
        </aside>
    );
}
