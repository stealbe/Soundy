/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useRouter} from 'next/navigation';
import { FaShieldAlt } from 'react-icons/fa';
import { useAuth } from "@/contexts/auth.context";

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) { setError('Будь ласка, заповніть всі поля'); return; }

        setLoading(true);
        try {
            await login(email, password);
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect') ?? '/user';
            router.push(redirect);
        } catch (err: any) {
            setError(err.message || 'Помилка входу');
        } finally {
            setLoading(false);
        }
    }, [email, password, login, router]);

    return (
        <main>
            <div className="container">
                <div className="loginBox">
                    <div className="header">
                        <FaShieldAlt className="headerIcon" />
                        Вхід до аккаунту
                    </div>

                    <form onSubmit={handleSubmit} className="form">
                        <input
                            type="email"
                            placeholder="Email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Link href="/forgot-password" className="forgotPasswordLink">
                            Забули пароль?
                        </Link>

                        {error && <p className="error">{error}</p>}

                        <button type="submit" className="submitButton" disabled={loading}>
                            {loading ? 'Зачекайте...' : 'Увійти'}
                        </button>
                    </form>

                    <div className="footerText">
                        Немає облікового запису?{' '}
                        <Link href="/register" className="footerLink">
                            Реєстрація
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}