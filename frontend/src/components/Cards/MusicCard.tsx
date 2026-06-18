import Image from "next/image"
import Link from "next/link"
import { Track } from "@/types"
import { usePlayer } from "@/contexts/player.context"

export default function MusicCard({ track, queue }: { track: Track, queue: Track[] }) {
    const { getCurrentTrack, play, pause, playQueue, state } = usePlayer();
    const currentTrack = getCurrentTrack();
    const isActive = currentTrack?.id === track.id;

    const handleClick = () => {
        if (isActive) {
            if (state.isPlaying) {
                pause();
            } else {
                play();
            }
            return;
        }

        const index = queue.findIndex(t => t.id === track.id);

        console.log(queue + ': ' + index);

        playQueue(queue, index !== -1 ? index : 0);
    };

    return (
        <button onClick={handleClick} className="group flex flex-col align-sub gap-2 w-full" >
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

            <h3 className="text-white font-semibold text-[16px] truncate text-justify">{track.title}</h3>

            <span className="text-zinc-400 text-sm truncate flex">
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