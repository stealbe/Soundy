'use client';
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
    const { isAuthenticated, loaded } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (loaded && isAuthenticated) router.push('/discover');
    }, [loaded, isAuthenticated, router]);
    return (
        <Link href={'/login'}> login</Link>
    )
}