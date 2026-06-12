"use client";

import React, { useEffect } from 'react';
import liquidGL from '../utility/liquidGL';
import "./Header.css";
import Image from "next/image";


export default function Header({user = null}: {user: {avatar_url: string} | null}) {
  useEffect(() => {
    try {
      const init = (liquidGL as any) || (window as any).liquidGL;
      if (!init) return;
      // initialize liquidGL for all elements with .liquidGL class
      init({ target: '.liquidGL' });
    } catch (e) {
      // fail silently if WebGL not available
    }
  }, []);

  return (

    <header className="main-container w-[100%] h-[155px] relative overflow-visible mx-auto my-0">

      {/* Semi-transparent overlay that preserves required background color */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'rgba(18, 18, 18, 0.75)' }}
      />
      {/* Search box with LiquidGL effect */}
      <div className="main-container w-[474px] h-[59px] bg-[rgba(82,81,81,0.17)] rounded-[15px] left-[50%] -translate-x-1/2 opacity-75 relative mx-auto my-0" />
      <div className="w-[55px] h-[34.041px] bg-[url(https://static.codia.ai/image/2026-06-11/nT2DmxQU5E.png)] bg-cover bg-no-repeat absolute top-[75px] left-[94%] z-[9]" />
      <span className="flex h-[22px] justify-start items-start font-sans text-[18px] font-bold leading-[21.784px] text-[#fff] absolute top-[85px] left-[26%] text-left whitespace-nowrap z-[15]">
        Library
      </span>

      {/* Logo */}
      <div className="w-[65px] h-[65px] bg-[url(https://static.codia.ai/image/2026-06-11/rC96G1ToNr.png)] bg-contain bg-no-repeat absolute top-[85px] left-[5%]" />
      
      {/* Navigation links */}
      <span className="flex h-[22px] justify-start items-start font-sans text-[18px] font-bold leading-[21.784px] text-[#fff] absolute top-[85px] left-[13%] text-left whitespace-nowrap z-[15]">
        Home
      </span>
      <span className="flex h-[22px] justify-start items-start font-sans text-[18px] font-bold leading-[21.784px] text-[#fff] absolute top-[85px] left-[20%] text-left whitespace-nowrap z-[15]">
        Feed
      </span>
      <span className="flex h-[22px] justify-start items-start font-sans text-[18px] font-bold leading-[21.784px] text-[#ff9603] absolute top-[85px] left-[58%] text-left whitespace-nowrap z-[15]">
        Try Artist Pro
      </span>
      <span className="flex h-[22px] justify-start items-start font-sans text-[18px] font-bold leading-[21.784px] text-[#fff] absolute top-[85px] left-[68%] text-left whitespace-nowrap z-[15]">
        Artist Studio
      </span>

      {/* Icons */}
      <div className="w-[36px] h-[45px] bg-[url(https://static.codia.ai/image/2026-06-11/Ke2Rvob85z.png)] bg-cover bg-no-repeat absolute top-[70px] left-[53%] z-[12]" />
      <div className="w-[36px] h-[45px] bg-[url(https://static.codia.ai/image/2026-06-11/qvPrmcAHmB.png)] bg-contain bg-no-repeat opacity-[0.19] absolute top-[70px] left-[86%] z-[12]" />
      <div className="w-[36px] h-[45px] bg-[url(https://static.codia.ai/image/2026-06-11/QDKm2pJ1Wi.png)] bg-contain bg-no-repeat opacity-[0.19] absolute top-[70px] left-[90%] z-[12]" />
      <div className="w-[70px] h-[65px] bg-[url(/ChevronDown.svg)] bg-contain bg-no-repeat absolute top-[80px] left-[82%] z-[12]" />
      
      {/* User avatar */}
      <Image width={59} height={59} className="rounded-full w-[59px] h-[59px] absolute top-[65px] left-[79%] z-[13]" src={user?.avatar_url || '/no-avatar.webp'} alt="User Avatar" />
    </header>
  );
};

