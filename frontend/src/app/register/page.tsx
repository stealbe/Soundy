'use client';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaShieldAlt } from 'react-icons/fa';
import { useAuth } from "@/contexts/auth.context";

export default function Register() {
    const router = useRouter();
    const { register } = useAuth();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !username || !password || !passwordConfirm) {
            setError('Будь ласка, заповніть всі поля');
            return;
        }

        if (password !== passwordConfirm) {
            setError('Паролі не співпадають');
            return;
        }

        setLoading(true);
        try {
            await register(email, username, password);
            router.push('/user');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Помилка реєстрації');
        } finally {
            setLoading(false);
        }
    }, [email, username, password, passwordConfirm, register, router]);

    return (
        <main>
            <div className="container">
                <div className="loginBox">
                    <div className="header">
                        <FaShieldAlt className="headerIcon" />
                        Реєстрація
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
                            type="text"
                            placeholder="Імʼя користувача"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="input"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Повторіть пароль"
                            className="input"
                            autoComplete="new-password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                        />

                        {error && <p className="error">{error}</p>}

                        <button type="submit" className="submitButton" disabled={loading}>
                            {loading ? 'Зачекайте...' : 'Зареєструватися'}
                        </button>
                    </form>

                    <div className="footerText">
                        Вже є акаунт?{' '}
                        <Link href="/login" className="footerLink">
                            Увійти
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}