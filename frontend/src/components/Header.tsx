'use client';
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth.context";

export default function Header() {
  const { user, loaded } = useAuth();

  return (

    <header className="main-container w-full h-38.75 relative overflow-hidden mx-auto my-0">

      {/* Semi-transparent overlay that preserves required background color */}
      <div
        className="absolute inset-0 z-1"
        style={{ background: 'rgba(18, 18, 18, 0.75)' }}
      />
      {/* Search box with LiquidGL effect */}
      <div className="absolute w-118.5 h-14.75 bg-[#2d2d2d] rounded-[15px] top-12 left-[35%] z-12 flex items-center px-4">

      </div>
      <div className="w-13.75 h-[34.041px] bg-[url(https://static.codia.ai/image/2026-06-11/nT2DmxQU5E.png)] bg-cover bg-no-repeat absolute top-21.25 left-[94%] z-9" />
      <span className="flex h-5.5 justify-start items-start font-sans text-[18px] font-bold leading-[21.784px] text-white absolute top-21.25 left-[27%] text-left whitespace-nowrap z-15">
        Library
      </span>

      {/* Logo */}
      <div className="w-16.25 h-16.25 bg-[url(https://static.codia.ai/image/2026-06-11/rC96G1ToNr.png)] bg-contain bg-no-repeat absolute top-21.25 left-[5%]" />

      {/* Navigation links */}
      <span className="flex h-5.5 justify-start items-start font-sans text-[18px] font-bold leading-[21.784px] text-white absolute top-21.25 left-[13%] text-left whitespace-nowrap z-15">
        Home
      </span>
      <span className="flex h-5.5 justify-start items-start font-sans text-[18px] font-bold leading-[21.784px] text-white absolute top-21.25 left-[19%] text-left whitespace-nowrap z-15">
        Feed
      </span>
      <span className="flex h-5.5 justify-start items-start font-sans text-[18px] font-bold leading-[21.784px] text-[#ff9603] absolute top-21.25 left-[58%] text-left whitespace-nowrap z-15">
        Try Artist Pro
      </span>
      <span className="flex h-5.5 justify-start items-start font-sans text-[18px] font-bold leading-[21.784px] text-white absolute top-21.25 left-[68%] text-left whitespace-nowrap z-15">
        Artist Studio
      </span>

      {/* Icons */}
      <div className="w-9 h-11.25 bg-[url(https://static.codia.ai/image/2026-06-11/Ke2Rvob85z.png)] bg-cover bg-no-repeat absolute top-17.5 left-[53%] z-12" />
      <div className="w-9 h-11.25 bg-[url(https://static.codia.ai/image/2026-06-11/qvPrmcAHmB.png)] bg-contain bg-no-repeat opacity-[0.19] absolute top-17.5 left-[87%] z-12" />
      <div className="w-9 h-11.25 bg-[url(https://static.codia.ai/image/2026-06-11/QDKm2pJ1Wi.png)] bg-contain bg-no-repeat opacity-[0.19] absolute top-17.5 left-[91%] z-12" />

      {/* User avatar */}
      {user && loaded ?
        <Link href={`/${user.username}`}><Image width={59} height={59} className="rounded-full w-14.75 h-14.75 absolute top-12 left-[79%] z-13" src={user?.avatar_url || '/no-avatar.webp'} alt="User Avatar" /></Link>
        :
        <Link href={'/login'}><Image width={59} height={59} className="rounded-full w-14.75 h-14.75 absolute top-12 left-[79%] z-13" src={user?.avatar_url || '/no-avatar.webp'} alt="User Avatar" /></Link>
      }
    </header>
  );


};
