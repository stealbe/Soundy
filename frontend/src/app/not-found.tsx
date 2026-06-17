'use client';
import Link from 'next/link';
import Image from 'next/image';
import { LiquidGlassText } from "@/components/LiquidGlassText";

export default function NotFound() {
    return (
        <main className='flex flex-col items-center gap-16'>
            <div className='flex flex-col relative'>
                <Image width={960} height={700} src={'/og.png'} alt='og 404' />
                <span className='flex text-[200px] font-normal absolute top-120'>
                    {/* <p className='liquid-text opacity-53' data-text="Error">Error</p>
                    <p className='liquid-text opacity-10' data-text="404">404</p> */}
                    <LiquidGlassText
                        fontSize={200}
                        style={{ opacity: 0.5 }}
                        glassColor="white"
                        glassOpacity={0.5}
                        distortionScale={30}
                        blurAmount={4}
                    >
                        Error
                    </LiquidGlassText>
                    <LiquidGlassText
                        fontSize={200}
                        style={{ opacity: 0.15 }}
                        glassColor="white"
                        glassOpacity={0}
                        distortionScale={40}
                        blurAmount={4}
                    >
                        404
                    </LiquidGlassText>
                </span>
            </div>
            <p className='text-[24px] font-bold'>PAGE NOT FOUND</p>
            <div className='flex md:gap-28'>
                <Link className='bg-[#D9D9D9] font-bold text-black text-[40px] px-41.75 py-8 rounded-full' href={'../'}>GO BACK</Link>
                <Link className='bg-[#D9D9D9] font-bold text-black text-[40px] px-41.75 py-8 rounded-full' href={'/'}>HOME</Link>
            </div>
        </main>
    );
}