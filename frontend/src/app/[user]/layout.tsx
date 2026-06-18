'use client';
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loaded } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (loaded && !isAuthenticated) router.push('/');
    }, [loaded, isAuthenticated, router]);

    return (
        <div>
            {children}
        </div>
    );
}
