import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";

function Header() {
    const { user, isAuthenticated } = useAuth();

    return (
        <header>
            {isAuthenticated ? <span>{user?.username}</span> : <Link href="/login">Войти</Link>}
        </header>
    );
}