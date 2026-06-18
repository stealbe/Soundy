'use client';
import { useAuth } from "@/contexts/auth.context";

export default function UserPage() {
    const { user } = useAuth();

    return (
        <div>{user?.username}</div>
    );
}