import Image from "next/image"
import Link from "next/link"
import { Track } from "@/types"

export default function MusicCard(track: Track) {
    return (
        <div className="group flex flex-col gap-2 w-full">
            <div className="relative w-full aspect-square overflow-hidden bg-zinc-900 rounded-md">
                <Image
                    src={track.cover_path || '/no-image.png'}
                    alt={track.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
            </div>

            <h3 className="text-white font-semibold text-[16px] truncate">{track.title}</h3>

            <span className="text-zinc-400 text-sm truncate">
                {track.artists?.map((a, i) => (
                    <span key={i}>
                        <Link href={`/artists/${a.id}`} className="hover:text-white transition">{a.name}</Link>
                        {i < (track.artists || []).length - 1 && ', '}
                    </span>
                ))}
            </span>
        </div>
    )
}