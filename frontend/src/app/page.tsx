'use client';
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./main.module.css";

export default function Home() {
    const { isAuthenticated, loaded } = useAuth();
    const router = useRouter();
    const [search_query, set_search_query] = useState('');
    useEffect(() => {
        if (loaded && isAuthenticated) router.push('/discover');
    }, [loaded, isAuthenticated, router]);

    return (
        <div className={styles.wrapper}>

            <div className={styles.hero_image_wrap}>
                <Image
                    src="/MainNotRestration/MainNotRestrationBanner.png"
                    alt="Hero"
                    fill
                    className={styles.hero_image}
                    priority
                />
                <nav className={styles.nav}>
                    <span className={styles.logo}>Soundy</span>
                    <div className={styles.nav_actions}>
                        <Link href="/login" className={styles.btn_login}>Log in</Link>
                        <Link href="/register" className={styles.btn_signin}>Sign in</Link>
                    </div>
                </nav>
            </div>

            <div className={styles.search_wrap}>
                <div className={styles.search_box}>
                    <input
                        type="text"
                        className={styles.search_input}
                        placeholder="Search for artist , brand , tracks , podcasts"
                        value={search_query}
                        onChange={(e) => set_search_query(e.target.value)}
                    />
                    <button className={styles.search_btn} aria-label="Search">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </button>
                </div>
            </div>

            <section className={styles.hero_section}>
                <div className={styles.hero_text}>
                    <h1 className={styles.hero_title}>
                        NEVER<br />STOP<br />LISTENING
                    </h1>
                </div>
                <div className={styles.hero_headphones}>
                    <Image
                        src="/MainNotRestration/headphones.png"
                        alt="Headphones"
                        width={600}
                        height={300}
                        className={styles.headphones_img}
                    />
                </div>
            </section>

            <section className={styles.creators_section}>
                <div className={styles.creators_image_wrap}>
                    <Image
                        src="/MainNotRestration/MainNotRestrationBanner2.png"
                        alt="Creator on stage"
                        width={750}
                        height={300}
                        className={styles.creators_image}
                    />
                </div>
                <div className={styles.creators_text}>
                    <h2 className={styles.creators_title}>
                        Calling<br />All<br />Creators
                    </h2>
                </div>
            </section>

            <footer className={styles.footer}>
                <p className={styles.footer_copy}>© 2026 Soundy. Все права защищены.</p>
                <p className={styles.footer_legal}>
                    Использование материалов сайта возможно только с активной гиперссылкой на источник.<br />
                    Весь контент, представленный на платформе, является объектом авторского права и интеллектуальной собственности.
                </p>
            </footer>
        </div>
    )
}