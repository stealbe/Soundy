import Link from "next/link";
import Image from "next/image";

export default function ArtistCard({ id, name = 'Undefined', cover = '/no-image', subscribers = 0, tracks = 0 }: { id: number, name: string, cover: string, subscribers: number, tracks: number }) {
    return (
        <Link href={`/artists/${id}`}>
            <div className="flex items-center justify-between w-full gap-3">

                {/* avatar */}
                <Image src={cover} alt={name}
                    className="w-14.5 h-14.5 max-sm:w-12 max-sm:h-12 rounded-full bg-cover bg-center shrink-0"/>

                {/* middle */}
                <div className="flex items-center justify-between w-full gap-4">

                    <div className="flex flex-col min-w-0">
                        <span className="text-white font-bold text-[18px] max-sm:text-[16px] truncate">
                            {name}
                        </span>

                        <div className="flex items-center gap-4 mt-1">

                            <div className="flex items-center gap-1">
                                <div className="w-5.5 h-5.5 bg-[url(https://static.codia.ai/image/2026-06-11/V0kDy3DwG8.png)] bg-contain bg-no-repeat" />
                                <span className="text-white text-[13px] font-bold">
                                    {subscribers}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <div className="w-5.5 h-5.5 bg-[url(https://static.codia.ai/image/2026-06-11/B9KHSk5zqt.png)] bg-contain bg-no-repeat" />
                                <span className="text-white text-[13px] font-bold">
                                    {tracks}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* button */}
                    <button className="px-5 py-1 bg-white text-black font-bold rounded-full text-[16px] max-sm:text-[14px] shrink-0">
                        Follow
                    </button>

                </div>
            </div>
        </Link>
    )
}