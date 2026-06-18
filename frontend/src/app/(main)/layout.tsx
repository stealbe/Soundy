'use client';
import SideNav from "@/components/SideNav";
import HeroSubBanner from "@/components/HeroSubBanner";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loaded && !isAuthenticated) router.push('/login');
    }, [loaded, isAuthenticated, router]);

    return (
        <>
            <HeroSubBanner />
            <div className="flex w-full items-start pr-25">
                {children}
                <SideNav />
            </div>
        </>
    )
}