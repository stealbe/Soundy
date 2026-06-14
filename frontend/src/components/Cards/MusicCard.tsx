import Image from "next/image"
import Link from "next/link"
import { Track } from "@/types"
import { usePlayer } from "@/contexts/player.context"

export default function MusicCard({ track, onPlay }: { track: Track, onPlay: () => void }) {
    const { state, pause } = usePlayer();
    const currentTracks = state.playlistId ? state.playlists[state.playlistId] : [];
    const currentTrack = state.currentTrackIndex !== null ? currentTracks[state.currentTrackIndex] : null;
    const isActive = currentTrack?.id === track.id;

    return (
        <button onClick={() => isActive ? pause() : onPlay()} className="group flex flex-col gap-2 w-full" >
            <div className="relative w-full aspect-square overflow-hidden bg-zinc-900 rounded-md">
                <Image
                    src={track.cover_path || '/no-image.png'}
                    alt={track.title}
                    fill
                    sizes="(max-width: 420px) 100vw, (max-width: 640px) 50vw, (max-width: 900px) 33vw, (max-width: 1200px) 25vw, 20vw"
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
        </button >
    )
}