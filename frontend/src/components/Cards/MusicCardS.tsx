import { FaPlay } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRetweet } from "react-icons/fa6";
import { FaCommentAlt } from "react-icons/fa";
import Link from "next/link"
import Image from "next/image"

export default function MusicCardS({ id, title = 'undefined', artists = [{ id: 0, name: 'undefined' }], cover = '/no-image', play_count = 0, likes = 0, reposts = 0, comments = 0 }: { id: number, title: string, artists: { id: number, name: string }[], cover: string, play_count: number, likes: number, reposts: number, comments: number }) {
    return (
        <Link href={`/tracks/${id}`} className="flex items-start gap-2 w-full">

            {/* cover */}
            <Image src={cover} alt={title}
                className="w-17.5 h-17.5 max-sm:w-14 max-sm:h-14 shrink-0 bg-cover bg-center" />

            {/* content */}
            <div className="flex flex-col gap-1 w-full min-w-0">

                {/* title + artist */}
                <div className="flex flex-col">
                    <span className="text-white text-[18px] font-extrabold truncate max-sm:text-[16px]">
                        {title}
                    </span>
                    <span className="text-zinc-500 text-[16px] font-extrabold truncate max-sm:text-[14px]">
                        {artists?.map((a, i) => (
                            <span key={a.id}>
                                <Link href={`/artists/${a.id}`} className="hover:text-white transition">{a.name}</Link>
                                {i < artists.length - 1 && ', '}
                            </span>
                        ))}
                    </span>
                </div>

                {/* stats */}
                <div className="flex items-center gap-4 flex-wrap">

                    <div className="flex items-center gap-1">
                        <FaPlay className="w-24 h-24" />
                        <span className="text-white text-[13px] font-bold">{play_count}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FaHeart className="w-24 h-24" />
                        <span className="text-white text-[13px] font-bold">{likes}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FaRetweet className="w-24 h-24" />
                        <span className="text-white text-[13px] font-bold">{reposts}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <FaCommentAlt className="w-24 h-24" />
                        <span className="text-white text-[13px] font-bold">{comments}</span>
                    </div>

                </div>

            </div>
        </Link>
    )
}