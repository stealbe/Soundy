'use client';
import Image from "next/image";
import { LiquidGlass } from "@creativoma/liquid-glass";

export default function HeroSubBanner() {
    return (
        <LiquidGlass
            className="liquid-fix w-full max-w-[calc(100%-200px)] mx-auto flex flex-row flex-nowrap justify-between items-center gap-4 px-6 sm:px-8 md:px-10 py-5 rounded-[20px] overflow-hidden h-25"
            backdropBlur={20}
            displacementScale={120}
            turbulenceBaseFrequency="0.008 0.008"
            turbulenceSeed={2}
        >
                <Image width={40} height={40} src="https://static.codia.ai/image/2026-06-12/CRE0kbtmLr.png" className="w-10 h-10 shrink-0" alt="" />
                <span className="text-white/50 text-[16px] font-bold whitespace-nowrap">Now available:</span>
                <span className="text-white text-[16px] font-bold truncate">Get heard by up to 100 listeners on your next upload with Artist or Artist Pro.</span>
                <span className="text-[#5686e1] text-[16px] font-bold whitespace-nowrap cursor-pointer">Learn More.</span>
                <Image width={36} height={36} src="https://static.codia.ai/image/2026-06-12/7dz5DdabWS.png" className="w-9 h-9 shrink-0 ml-auto" alt="" />
        </LiquidGlass>
    );
}