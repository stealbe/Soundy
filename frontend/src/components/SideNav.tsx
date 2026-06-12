import React from "react";
import "./index.css";
import { ArtistCard, MusicCardS } from "./Cards";

interface Artist {
    id: number;
    name: string;
    cover: string;
    tracks: number;
    subscribers: number;
    following?: boolean;
}

interface Track {
    id: number;
    title: string;
    artists: Artist[];
    cover: string;
    play_count: number;
    likes: number;
    reposts: number;
    comments: number;
}

const SUGGESTED_ARTISTS: Artist[] = [
    { id: 1, name: "XDswagg", cover: "https://static.codia.ai/image/2026-06-12/42ZZHQOft7.png", tracks: 16, subscribers: 120 },
    { id: 2, name: "laydown", cover: "https://static.codia.ai/image/2026-06-12/nZ51t169o6.png", tracks: 16, subscribers: 120 },
    { id: 3, name: "rira_fa", cover: "https://static.codia.ai/image/2026-06-12/VnMokxs3xx.png", tracks: 16, subscribers: 120 },
];

const LIKED_TRACKS: Track[] = [
    {
        id: 1, title: "Don't waste my time",
        artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
        cover: "https://static.codia.ai/image/2026-06-12/UP6nM8nzNJ.png",
        play_count: 1_000_000, likes: 101_000, reposts: 80_000, comments: 2456,
    },
    {
        id: 2, title: "Don't waste my time",
        artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
        cover: "https://static.codia.ai/image/2026-06-12/2JOo69F8wh.png",
        play_count: 1_000_000, likes: 101_000, reposts: 80_000, comments: 2456,
    },
    {
        id: 3, title: "Don't waste my time",
        artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
        cover: "https://static.codia.ai/image/2026-06-12/7njksXoWoj.png",
        play_count: 1_000_000, likes: 101_000, reposts: 80_000, comments: 2456,
    },
];

const HISTORY_TRACKS: Track[] = [
    {
        id: 4, title: "Don't waste my time",
        artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
        cover: "https://static.codia.ai/image/2026-06-12/w2cCMUEx8D.png",
        play_count: 1_000_000, likes: 101_000, reposts: 80_000, comments: 2456,
    },
    {
        id: 5, title: "Don't waste my time",
        artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
        cover: "https://static.codia.ai/image/2026-06-12/XgpQtCcR4a.png",
        play_count: 1_000_000, likes: 101_000, reposts: 80_000, comments: 2456,
    },
    {
        id: 6, title: "Don't waste my time",
        artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
        cover: "https://static.codia.ai/image/2026-06-12/j7SMCQmhDL.png",
        play_count: 1_000_000, likes: 101_000, reposts: 80_000, comments: 2456,
    },
];

export default function SideNav() {
    return (
        <div className="main-container w-[433px] h-[2024px] relative mx-auto my-0">
            <div className="flex w-[433px] flex-col gap-[11px] items-center flex-nowrap relative z-[1] mt-[53px] mr-0 mb-0 ml-0">
                <div className="w-[401px] h-[263px] shrink-0 relative z-[2]">
                    <div className="flex w-[401px] flex-col gap-[43px] items-center flex-nowrap relative z-[7] mt-0 mr-0 mb-0 ml-0">
                        <span className="h-[29px] self-stretch shrink-0 basis-auto font-['Inter'] text-[24px] font-bold leading-[29px] text-[#fff] relative text-center whitespace-nowrap z-[8]">
                            Artist Tools
                        </span>
                        <div className="flex gap-[27px] items-center self-stretch shrink-0 flex-nowrap relative z-[9]">
                            <div className="w-[80px] h-[108px] shrink-0 bg-[url(https://static.codia.ai/image/2026-06-12/DNGq50kZ1m.png)] bg-cover bg-no-repeat relative z-10" />
                            <div className="w-[80px] h-[108px] shrink-0 bg-[url(https://static.codia.ai/image/2026-06-12/PfNvN71vYs.png)] bg-cover bg-no-repeat relative z-[11]" />
                            <div className="w-[80px] h-[108px] shrink-0 bg-[url(https://static.codia.ai/image/2026-06-12/q7Sxe41AzQ.png)] bg-cover bg-no-repeat relative z-[12]" />
                            <div className="w-[80px] h-[108px] shrink-0 bg-[url(https://static.codia.ai/image/2026-06-12/d6nDdtkabh.png)] bg-cover bg-no-repeat relative z-[13]" />
                        </div>
                    </div>
                    <div className="w-[375px] h-[55px] relative z-[3] mt-[28px] mr-0 mb-0 ml-[21px]">
                        <div className="w-[375px] h-[55px] bg-[rgba(217,217,217,0.07)] rounded-[30px] absolute top-0 left-0 z-[4]" />
                        <div className="w-[45px] h-[45px] bg-[url(https://static.codia.ai/image/2026-06-12/SsRDz158Dg.png)] bg-contain bg-no-repeat absolute top-[5px] left-[8px] z-[5]" />
                        <span className="flex h-[16px] justify-start items-start font-['Inter'] text-[13px] font-bold leading-[15.733px] text-[#fff] absolute top-[20px] left-[56px] text-left whitespace-nowrap z-[6]">
                            Unlock Artist tools from UAH 69.99/month.
                        </span>
                    </div>
                </div>
                <div className="h-[28px] self-stretch shrink-0 bg-[url(https://static.codia.ai/image/2026-06-12/yQTiwiwQq7.png)] bg-cover bg-no-repeat relative z-[14]" />
                <div className="flex flex-col gap-[17px] items-center self-stretch shrink-0 flex-nowrap relative z-[15]">
                    <div className="flex flex-col gap-[12px] items-start self-stretch shrink-0 flex-nowrap relative z-[16]">
                        <div className="flex pt-[12px] pr-[16px] pb-[12px] pl-[16px] flex-col gap-[16px] items-start self-stretch shrink-0 flex-nowrap relative overflow-hidden z-[17]">
                            <div className="w-[396px] h-[24px] shrink-0 relative z-[18]">
                                <span className="flex h-[24px] justify-start items-start font-['Inter'] text-[20px] font-bold leading-[24px] text-[#fff] absolute top-0 left-0 text-left whitespace-nowrap z-[19]">
                                    Artist you should follow
                                </span>
                                <span className="flex h-[24px] justify-start items-start font-['Inter'] text-[20px] font-bold leading-[24px] text-[rgba(105,104,104,0.98)] absolute top-0 left-[274px] text-left whitespace-nowrap z-20">
                                    reshresh list
                                </span>
                            </div>
                            {SUGGESTED_ARTISTS.map(a => <ArtistCard key={a.id} {...a} />)}
                        </div>
                        <div className="flex pt-[12px] pr-[16px] pb-[12px] pl-[16px] flex-col gap-[26px] items-start self-stretch shrink-0 flex-nowrap relative overflow-hidden z-[66]">
                            <span className="h-[24px] self-stretch shrink-0 basis-auto font-['Inter'] text-[20px] font-bold leading-[24px] text-[#fff] relative text-left whitespace-nowrap z-[67]">
                                230 Likes
                            </span>
                            {LIKED_TRACKS.map(t => <MusicCardS key={t.id} {...t} />)}
                        </div>
                        <div className="flex pt-[12px] pr-[16px] pb-[12px] pl-[16px] flex-col gap-[24px] items-start self-stretch shrink-0 flex-nowrap relative overflow-hidden z-[125]">
                            <span className="h-[24px] self-stretch shrink-0 basis-auto font-['Inter'] text-[20px] font-bold leading-[24px] text-[#fff] relative text-left whitespace-nowrap z-[126]">
                                Listening history
                            </span>
                            <div className="flex flex-col gap-[26px] items-start self-stretch shrink-0 flex-nowrap relative z-[127]">
                                {HISTORY_TRACKS.map(t => <MusicCardS key={t.id} {...t} />)}
                            </div>
                        </div>
                    </div>
                    <div className="flex w-[391px] flex-col gap-[16px] items-start shrink-0 flex-nowrap relative z-[185]">
                        <span className="h-[24px] self-stretch shrink-0 basis-auto font-['Inter'] text-[20px] font-bold leading-[24px] text-[#fff] relative text-left whitespace-nowrap z-[186]">
                            Go Mobile
                        </span>
                        <div className="flex gap-[16px] items-center self-stretch shrink-0 flex-nowrap relative z-[187]">
                            <div className="w-[199px] h-[75px] shrink-0 relative z-[188]">
                                <div className="w-[176px] h-[75px] bg-[rgba(217,217,217,0)] rounded-[25px] border-solid border border-[#000] absolute top-0 left-0 z-[189]" />
                                <div className="w-[178px] h-[39px] absolute top-[15px] left-[21px] z-[190]">
                                    <div className="w-[33px] h-[39px] bg-[url(https://static.codia.ai/image/2026-06-12/67RsvUQ4RM.png)] bg-cover bg-no-repeat absolute top-0 left-0 z-[194]" />
                                    <div className="w-[131px] h-[33px] text-[0px] absolute top-[6px] left-[47px] z-[191]">
                                        <span className="block h-[13px] font-['Inter'] text-[12px] font-normal leading-[13px] text-[#fff] relative text-left whitespace-nowrap z-[192] mt-0 mr-0 mb-0 ml-0">
                                            Download on the
                                        </span>
                                        <span className="block h-[20px] font-['Inter'] text-[15px] font-bold leading-[18.153px] text-[#fff] relative text-left whitespace-nowrap z-[193] mt-0 mr-0 mb-0 ml-[22px]">
                                            App Store
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[176px] h-[75px] shrink-0 relative z-[195]">
                                <div className="w-[152px] h-[39px] relative z-[197] mt-[15px] mr-0 mb-0 ml-[20px]">
                                    <div className="w-[105px] h-[37px] text-[0px] absolute top-0 left-[47px] z-[198]">
                                        <span className="block h-[15px] font-['Inter'] text-[12px] font-normal leading-[14.523px] text-[#fff] relative text-left whitespace-nowrap z-[199] mt-0 mr-0 mb-0 ml-0">
                                            GET IT ON
                                        </span>
                                        <span className="block h-[22px] font-['Inter'] text-[18px] font-bold leading-[21.784px] text-[#fff] relative text-left whitespace-nowrap z-[200] mt-0 mr-0 mb-0 ml-0">
                                            Google Play
                                        </span>
                                    </div>
                                    <div className="w-[41.001px] h-[40px] bg-[url(https://static.codia.ai/image/2026-06-12/09jfUijFnh.png)] bg-cover bg-no-repeat absolute top-[-0.5px] left-[-0.5px] z-[201]" />
                                </div>
                                <div className="w-[176px] h-[75px] bg-[rgba(217,217,217,0)] rounded-[25px] border-solid border border-[#000] absolute top-0 left-0 z-[196]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[28px] self-stretch shrink-0 bg-[url(https://static.codia.ai/image/2026-06-12/UTtZKmXYb9.png)] bg-cover bg-no-repeat relative z-[202]" />
                <div className="flex w-[326px] pt-[3px] pr-0 pb-[3px] pl-0 flex-col gap-[26px] items-start shrink-0 flex-nowrap relative overflow-hidden z-[203]">
                    <span className="h-[24px] self-stretch shrink-0 basis-auto font-['Inter'] text-[20px] font-bold leading-[24px] text-[#fff] relative text-left whitespace-nowrap z-[67]">
                        230 Likes
                    </span>
                    {LIKED_TRACKS.map(t => <MusicCardS key={t.id} {...t} />)}
                </div>
            </div>
            <div className="w-[433px] h-[2024px] bg-[url(https://static.codia.ai/image/2026-06-12/ViT3HNddY4.png)] bg-cover bg-no-repeat rounded-[15px] absolute top-0 left-0" />
        </div>
    );
}
