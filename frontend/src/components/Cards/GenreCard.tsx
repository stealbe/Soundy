import Link from "next/link"
import Image from "next/image"

export default function GenreCard({ id, title, cover }: { id: number, title: string, cover: string }) {
    return (
        <Link href={`/genre/${id}`}>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-900">
                <Image src={cover} alt={title} fill className="object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
            </div>

            <h3 className="text-white font-semibold text-[16px] truncate">{title}</h3>

            <span className="text-zinc-400 text-sm truncate">
                Trending music
            </span>
        </Link>
    )
}