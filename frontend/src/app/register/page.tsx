'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth.context';
import styles from './register.module.css';
import { LiquidGlass } from '@creativoma/liquid-glass';

const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const username_regex = /^[a-zA-Z0-9_]{3,20}$/;
const password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

export default function Register() {
    const router = useRouter();
    const { register } = useAuth();

    const [email, set_email] = useState('');
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const [password_confirm, set_password_confirm] = useState('');
    const [error, set_error] = useState('');
    const [loading, set_loading] = useState(false);
    const [pw_visible, set_pw_visible] = useState(false);
    const [pw_confirm_visible, set_pw_confirm_visible] = useState(false);

    const handle_submit = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();
            set_error('');

            if (!email || !username || !password || !password_confirm) {
                set_error('Будь ласка, заповніть всі поля');
                return;
            }

            if (!email_regex.test(email)) {
                set_error('Невірний формат email');
                return;
            }

            if (!username_regex.test(username)) {
                set_error('Username: 3-20 символів, лише літери, цифри та _');
                return;
            }

            if (!password_regex.test(password)) {
                set_error('Пароль: мін. 8 символів, літери та цифри');
                return;
            }

            if (password !== password_confirm) {
                set_error('Паролі не співпадають');
                return;
            }

            set_loading(true);
            try {
                await register(email, username, password);
                router.push('/discover');
            } catch (err: any) {
                set_error(err.message || 'Помилка реєстрації');
            } finally {
                set_loading(false);
            }
        },
        [email, username, password, password_confirm, register, router]
    );

    return (
        <main className={styles.page}>
            <LiquidGlass className={styles.card}>
                <h1 className={styles.title}>Sign Up</h1>
                <p className={styles.subtitle}>
                    Create your account and start managing your
                    <br />
                    projects. Ideas, and progress.
                </p>

                <div className={styles.inp_wrap}>
                    <img src="/registration/email.svg" alt="Email icon" className={styles.inp_icon} />
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => set_email(e.target.value)}
                        autoComplete="email"
                    />
                </div>

                <div className={styles.inp_wrap}>
                    <img src="/registration/user.svg" alt="User icon" className={styles.inp_icon} />
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => set_username(e.target.value)}
                        autoComplete="username"
                    />
                </div>

                <div className={styles.inp_wrap}>
                    <img src="/registration/key.svg" alt="Password icon" className={styles.inp_icon} />
                    <input
                        className={styles.input}
                        type={pw_visible ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => set_password(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button
                        className={styles.eye_btn}
                        onClick={() => set_pw_visible((v) => !v)}
                        aria-label="toggle password visibility"
                        type="button"
                    >
                        {pw_visible ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className={styles.inp_wrap}>
                    <img src="/registration/key.svg" alt="Password icon" className={styles.inp_icon} />
                    <input
                        className={styles.input}
                        type={pw_confirm_visible ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={password_confirm}
                        onChange={(e) => set_password_confirm(e.target.value)}
                        autoComplete="new-password"
                    />
                    <button
                        className={styles.eye_btn}
                        onClick={() => set_pw_confirm_visible((v) => !v)}
                        aria-label="toggle confirm password visibility"
                        type="button"
                    >
                        {pw_confirm_visible ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        )}
                    </button>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button
                    className={styles.login_btn}
                    onClick={handle_submit}
                    disabled={loading}
                    type="button"
                >
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>

                <div className={styles.socials}>
                    <Link className={styles.soc_btn} href="/auth/facebook">
                        <svg viewBox="0 0 24 24" fill="#1877f2">
                            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                        </svg>
                        Facebook
                    </Link>
                    <Link className={styles.soc_btn} href="/auth/google">
                        <img src="/logo/google.svg" alt="Google logo" className={styles.google_logo} />
                        Google
                    </Link>
                    <Link className={styles.soc_btn} href="/auth/instagram">
                        <svg viewBox="0 0 24 24" fill="url(#ig)">
                            <defs>
                                <radialGradient id="ig" cx="30%" cy="107%" r="150%">
                                    <stop offset="0%" stopColor="#fdf497" />
                                    <stop offset="45%" stopColor="#fd5949" />
                                    <stop offset="60%" stopColor="#d6249f" />
                                    <stop offset="90%" stopColor="#285AEB" />
                                </radialGradient>
                            </defs>
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Instagram
                    </Link>
                </div>

                <p className={styles.signup_row}>
                    Already have an account?{' '}
                    <Link href="/login">Log In.</Link>
                </p>
            </LiquidGlass>
        </main>
    );
}