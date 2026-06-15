"use client";

import React, { useEffect } from 'react';
import liquidGL from '../utility/liquidGL';
import "./Header.css";
import Image from "next/image";

export default function Header({ user = null }: { user: { avatar_url: string } | null }) {
  useEffect(() => {
    try {
      const init = (liquidGL as any) || (window as any).liquidGL;
      if (!init) return;
      init({ target: '.liquidGL' });
    } catch (e) {}
  }, []);

  return (
    <header className="main-container w-full h-[120px] lg:h-[140px] xl:h-[155px] relative overflow-visible mx-auto my-0">

      {/* Background overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: 'rgba(18, 18, 18, 0.75)' }}
      />

      {/* Logo */}
      <div className="
        w-[45px] h-[45px] lg:w-[55px] lg:h-[55px] xl:w-[65px] xl:h-[65px]
        bg-[url(https://static.codia.ai/image/2026-06-11/rC96G1ToNr.png)]
        bg-contain bg-no-repeat
        absolute top-1/2 -translate-y-1/2 left-[5%]
      " />

      {/* Nav: Home */}
      <span className="
        font-sans font-bold text-white whitespace-nowrap
        text-[14px] lg:text-[16px] xl:text-[18px]
        absolute top-1/2 -translate-y-1/2 left-[13%] z-[15]
      ">
        Home
      </span>

      {/* Nav: Feed */}
      <span className="
        font-sans font-bold text-white whitespace-nowrap
        text-[14px] lg:text-[16px] xl:text-[18px]
        absolute top-1/2 -translate-y-1/2 left-[20%] z-[15]
      ">
        Feed
      </span>

      {/* Nav: Library */}
      <span className="
        font-sans font-bold text-white whitespace-nowrap
        text-[14px] lg:text-[16px] xl:text-[18px]
        absolute top-1/2 -translate-y-1/2 left-[26%] z-[15]
      ">
        Library
      </span>

      {/* Search box */}
      <div className="
        h-[46px] lg:h-[54px] xl:h-[59px]
        w-[320px] lg:w-[400px] xl:w-[474px]
        bg-[rgba(82,81,81,0.17)] rounded-[15px] opacity-75
        absolute top-1/2 -translate-y-1/2 left-[33%] z-[5]
      " />

      {/* Upload icon */}
      <div className="
        w-[28px] h-[35px] lg:w-[32px] lg:h-[40px] xl:w-[36px] xl:h-[45px]
        bg-[url(https://static.codia.ai/image/2026-06-11/Ke2Rvob85z.png)]
        bg-cover bg-no-repeat
        absolute top-1/2 -translate-y-1/2 left-[53%] z-[12]
      " />

      {/* Try Artist Pro */}
      <span className="
        font-sans font-bold text-[#ff9603] whitespace-nowrap
        text-[14px] lg:text-[16px] xl:text-[18px]
        absolute top-1/2 -translate-y-1/2 left-[58%] z-[15]
      ">
        Try Artist Pro
      </span>

      {/* Artist Studio */}
      <span className="
        font-sans font-bold text-white whitespace-nowrap
        text-[14px] lg:text-[16px] xl:text-[18px]
        absolute top-1/2 -translate-y-1/2 left-[68%] z-[15]
      ">
        Artist Studio
      </span>

      {/* User avatar */}
      <Image
        width={59}
        height={59}
        className="rounded-full absolute top-1/2 -translate-y-1/2 left-[79%] z-[13]
          w-[46px] h-[46px] lg:w-[52px] lg:h-[52px] xl:w-[59px] xl:h-[59px]"
        src={user?.avatar_url || '/no-avatar.webp'}
        alt="User Avatar"
      />

      {/* Chevron down */}
      <div className="
        w-[50px] h-[46px] lg:w-[60px] lg:h-[55px] xl:w-[70px] xl:h-[65px]
        bg-[url(/ChevronDown.svg)] bg-contain bg-no-repeat
        absolute top-[100px] -translate-y-1/2 left-[82%] z-[12]
      " />

      {/* Icon 1 */}
      <div className="
        w-[28px] h-[35px] lg:w-[32px] lg:h-[40px] xl:w-[36px] xl:h-[45px]
        bg-[url(https://static.codia.ai/image/2026-06-11/qvPrmcAHmB.png)]
        bg-contain bg-no-repeat opacity-[0.19]
        absolute top-1/2 -translate-y-1/2 left-[86%] z-[12]
      " />

      {/* Icon 2 */}
      <div className="
        w-[28px] h-[35px] lg:w-[32px] lg:h-[40px] xl:w-[36px] xl:h-[45px]
        bg-[url(https://static.codia.ai/image/2026-06-11/QDKm2pJ1Wi.png)]
        bg-contain bg-no-repeat opacity-[0.19]
        absolute top-1/2 -translate-y-1/2 left-[90%] z-[12]
      " />

      {/* Logo right */}
      <div className="
        w-[42px] h-[26px] lg:w-[48px] lg:h-[30px] xl:w-[55px] xl:h-[34px]
        bg-[url(https://static.codia.ai/image/2026-06-11/nT2DmxQU5E.png)]
        bg-cover bg-no-repeat
        absolute top-1/2 -translate-y-1/2 left-[94%] z-[9]
      " />

    </header>
  );
}