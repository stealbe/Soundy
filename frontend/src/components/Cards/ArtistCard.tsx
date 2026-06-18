import { IoAdd } from "react-icons/io5";
import { LiquidGlass } from "@creativoma/liquid-glass";
import { Artist } from "@/types";
import Image from "next/image";

export default function ArtistCard(artist: Artist) {
    return (
        <div className="flex flex-col items-center relative">
            <Image width={300} height={300} src={artist.cover_path || '/no-avatar.webp'} alt="avatar" className="w-[300px] h-[300px] rounded-full bg-gray-700 shadow-lg" />
            <LiquidGlass className="rounded-full absolute ml-auto -top-25 last:none">
                <IoAdd className="w-18.75 h-18.75" width={75} height={75} />
            </LiquidGlass>
            <div className="text-center">
                <h4 className="text-[24px] font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] underline">
                    {artist.name}
                </h4>
            </div>
            <p className="text-[#A8A8A8] text-[15px]">{artist.subscribers} followers</p>
        </div>
    )
}