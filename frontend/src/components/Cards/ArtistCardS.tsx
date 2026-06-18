import Link from "next/link";
import Image from "next/image";
import { Artist } from "@/types";
import { FaUserTie } from "react-icons/fa";
import { LuAudioLines } from "react-icons/lu";

export default function ArtistCard(artist: Artist) {
    return (
        <Link href={`/artists/${artist.id}`} className="w-full">
            <div className="flex items-center justify-between w-full gap-3">

                {/* avatar */}
                <Image width={200} height={200} src={artist.cover_path} alt={artist.name}
                    className="w-14.5 h-14.5 max-sm:w-12 max-sm:h-12 rounded-full bg-cover bg-center shrink-0" />

                {/* middle */}
                <div className="flex items-center justify-between w-full gap-4">

                    <div className="flex flex-col min-w-0">
                        <span className="text-white font-bold text-[18px] max-sm:text-[16px] truncate">
                            {artist.name}
                        </span>

                        <div className="flex items-center gap-4 mt-1">

                            <div className="flex items-center gap-1">
                                <FaUserTie className="fill-black  w-6 h-6" />
                                <span className="text-white text-[13px] font-bold">
                                    {artist.subscribers}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <LuAudioLines className="stroke-black stroke-3 w-6 h-6" />
                                <span className="text-white text-[13px] font-bold">
                                    {artist.tracks_count}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* button */}
                    <button className="px-5 py-1 bg-white text-black font-bold rounded-full text-[16px] max-sm:text-[14px] shrink-0 ml-auto cursor-pointer">
                        Follow
                    </button>

                </div>
            </div>
        </Link>
    )
}