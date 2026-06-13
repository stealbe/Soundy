'use client';
import Image from "next/image";
import { LiquidGlass } from "@creativoma/liquid-glass";

export default function HeroSubBanner() {
    return (
        <LiquidGlass
            className="
        w-full max-w-430
        mx-auto
        flex items-center justify-between
        gap-4
        px-6 sm:px-8 md:px-10
        py-5
        rounded-[20px]
        overflow-hidden
        flex-row
        flex-nowrap
      "
            backdropBlur={20}
            displacementScale={120}
            turbulenceBaseFrequency="0.008 0.008"
            turbulenceSeed={2}
        >
            <div className="flex items-center gap-3 min-w-0">
                <Image width={20} height={20}
                    src="https://static.codia.ai/image/2026-06-12/CRE0kbtmLr.png"
                    className="w-10 h-10 shrink-0"
                    alt=""
                />

                <span className="text-white/50 text-[16px] font-bold whitespace-nowrap">
                    Now available:
                </span>
                <span className="text-white text-[16px] font-bold truncate">
                    Get heard by up to 100 listeners on your next upload with Artist or Artist Pro.
                </span>
            </div>

            <div className="flex items-center justify-between shrink-0">
                <span className="text-[#5686e1] text-[16px] font-bold whitespace-nowrap cursor-pointer">
                    Learn More.
                </span>

                <Image width={20} height={20}
                    src="https://static.codia.ai/image/2026-06-12/7dz5DdabWS.png"
                    className="w-9 h-9"
                    alt=""
                />
            </div>
        </LiquidGlass>
    );
}