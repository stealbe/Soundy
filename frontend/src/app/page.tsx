'use client';
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { isAuthenticated, loaded } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (loaded && isAuthenticated) router.push('/discover');
    }, [loaded, isAuthenticated, router]);
    return (
        <div>Login</div>
    )
}