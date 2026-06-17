import { FaPlay } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRetweet } from "react-icons/fa6";
import { FaCommentAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Track } from "@/types";
import { usePlayer } from "@/contexts/player.context";

export default function MusicCardS({ track, queue }: { track: Track, queue: Track[] }) {
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
        <div className="flex items-start gap-2 w-full" onClick={handleClick}>

            {/* cover */}
            <Image width={200} height={200} src={track.cover_path || 'no-image'} alt={track.title}
                className="w-17.5 h-17.5 max-sm:w-14 max-sm:h-14 shrink-0 bg-cover bg-center" />

            {/* content */}
            <div className="flex flex-col gap-1 w-full min-w-0">

                {/* title + artist */}
                <div className="flex flex-col">
                    <span className=" text-white text-[18px] font-extrabold truncate min-w-0 block max-sm:text-[16px] max-w-80">
                        {track.title}
                    </span>
                    <span className="text-zinc-500 text-[16px] font-extrabold truncate max-sm:text-[14px]">
                        {track.artists?.map((a, i) => (
                            <span key={a.id}>
                                <Link href={`/artists/${a.id}`} className="hover:text-white transition">{a.name}</Link>
                                {i < (track.artists || []).length - 1 && ', '}
                            </span>
                        ))}
                    </span>
                </div>

                {/* stats */}
                <div className="flex items-center gap-4 flex-wrap">

                    <div className="flex items-center gap-1">
                        <FaPlay className="w-6 h-6 fill-black" />
                        <span className="text-white text-[13px] font-bold">{track.play_count}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FaHeart className="w-6 h-6 fill-black" />
                        <span className="text-white text-[13px] font-bold">{track.likes}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FaRetweet className="w-6 h-6 fill-black" />
                        <span className="text-white text-[13px] font-bold">{track.reposts}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FaCommentAlt className="w-6 h-6 fill-black" />
                        <span className="text-white text-[13px] font-bold">{track.comments}</span>
                    </div>

                </div>

            </div>
        </div>
    )
}