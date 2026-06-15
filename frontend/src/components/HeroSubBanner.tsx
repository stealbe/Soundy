"use client";

import React, { useEffect } from 'react';
import liquidGL from '../utility/liquidGL';

export default function HeroSubBanner() {
  useEffect(() => {
    try {
      const init = (liquidGL as any) || (window as any).liquidGL;
      if (!init) return;
      init({ target: '.hero-liquid' });
    } catch (e) {
      // ignore if WebGL not available
    }
  }, []);

  return (
    <div className="
      bg-[rgba(18,18,18,0.75)] rounded-[20px] main-container
      relative mx-auto mt-4
      w-[92%] max-w-[1720px]
      h-[70px] lg:h-[80px] xl:h-[100px]
    ">
      {/* Liquid glass background */}
      <div className="hero-liquid liquidGL absolute inset-0 rounded-[20px] bg-[rgba(96,96,96,0.12)] shadow-md z-[0]" />

      {/* Layout: icon | texts | X */}
      <div className="
        absolute inset-0 z-[30]
        flex items-center
        px-[18px] lg:px-[24px] xl:px-[30px]
        gap-x-[10px] lg:gap-x-[14px] xl:gap-x-[16px]
      ">

        {/* Lightning icon — left */}
        <div className="
          shrink-0
          w-[28px] h-[28px] lg:w-[34px] lg:h-[34px] xl:w-[45px] xl:h-[45px]
          bg-[url(https://static.codia.ai/image/2026-06-12/BYkiRwJ3n1.png)]
          bg-contain bg-center bg-no-repeat
        " />

        {/* Text group — centered, grows to fill space */}
        <div className="flex-1 flex items-center justify-center gap-x-[6px] lg:gap-x-[8px] xl:gap-x-[10px] min-w-0">
          <span className="
            font-['Inter'] font-bold whitespace-nowrap shrink-0
            text-[13px] lg:text-[15px] xl:text-[18px]
            leading-tight text-[rgba(255,255,255,0.7)]
          ">
            Now available:
          </span>

          <span className="
            font-['Inter'] font-bold
            text-[13px] lg:text-[15px] xl:text-[18px]
            leading-tight text-white
            truncate
          ">
            Get heard by up to 100 listeners on your next upload with Artist or Artist Pro.
          </span>

          <span className="
            font-['Inter'] font-bold whitespace-nowrap shrink-0
            text-[13px] lg:text-[15px] xl:text-[18px]
            leading-tight text-[#5686e1]
            cursor-pointer hover:underline
          ">
            Learn More.
          </span>
        </div>

        {/* X close button — right */}
        <div className="
          shrink-0
          w-[28px] h-[28px] lg:w-[34px] lg:h-[34px] xl:w-[40px] xl:h-[40px]
          bg-[url(https://static.codia.ai/image/2026-06-12/6ngp0OQp3D.png)]
          bg-cover bg-center bg-no-repeat
          cursor-pointer opacity-70 hover:opacity-100 transition-opacity
        " />

      </div>
    </div>
  );
}