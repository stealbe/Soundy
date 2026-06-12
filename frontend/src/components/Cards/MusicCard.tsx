import Image from "next/image"
import Link from "next/link"

export default function MusicCard({ id, title = 'undefined', artists = [{ id: 0, name: 'undefined' }], cover = '/no-image' }: { id: number, title: string, artists: { id: number, name: string }[], cover: string }) {
    return (
        <Link href={`/tracks/${id}`} className="group flex flex-col gap-2 w-[253px] max-lg:w-[220px] max-md:w-[180px] max-sm:w-full">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-900">
                <Image src={cover} alt={title} fill className="object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
            </div>

            <h3 className="text-white font-semibold text-[16px] truncate">{title}</h3>

            <span className="text-zinc-400 text-sm truncate">
                {artists?.map((a, i) => (
                    <span key={a.id}>
                        <Link href={`/artists/${a.id}`} className="hover:text-white transition">{a.name}</Link>
                        {i < artists.length - 1 && ', '}
                    </span>
                ))}
            </span>
        </Link>
    )
}