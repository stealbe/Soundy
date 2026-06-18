'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './Sidebar.module.css';

interface Artist {
    id: number;
    name: string;
    avatar: string;
    followers: number;
    tracks: number;
}

interface SidebarTrack {
    id: number;
    title: string;
    artist: string;
    cover_src: string;
    plays: string;
    likes: string;
    reposts: string;
    comments: string;
}

const ARTISTS: Artist[] = [
    { id: 1, name: 'XDswagg',     avatar: '/users/artist1.jpg', followers: 16,  tracks: 120 },
    { id: 2, name: 'Tremor',      avatar: '/users/artist2.jpg', followers: 58,  tracks: 3   },
    { id: 3, name: 'YoungTalent', avatar: '/users/artist3.jpg', followers: 192, tracks: 23  },
];

const LIKED_TRACKS: SidebarTrack[] = [
    { id: 1, title: "Don't waste my time", artist: "TheyFwNate, rira's fa", cover_src: '/tracks/track1.jpg', plays: '1M', likes: '101k', reposts: '80k', comments: '2456' },
    { id: 2, title: "Don't waste my time", artist: "TheyFwNate, rira's fa", cover_src: '/tracks/track2.jpg', plays: '1M', likes: '101k', reposts: '80k', comments: '2456' },
    { id: 3, title: "Don't waste my time", artist: "TheyFwNate, rira's fa", cover_src: '/tracks/track3.jpg', plays: '1M', likes: '101k', reposts: '80k', comments: '2456' },
];

const HISTORY_TRACKS = LIKED_TRACKS;

function ArtistTools() {
    return (
        <div className={styles.section}>
            <h3 className={styles.section_title}>Artist Tools</h3>
            <div className={styles.tools_grid}>
                {[
                    { icon: '/icons/tool-lightning.svg', label: 'Boost' },
                    { icon: '/icons/tool-process.svg',   label: 'Process' },
                    { icon: '/icons/tool-geo.svg',       label: 'Geo' },
                    { icon: '/icons/tool-upload.svg',    label: 'Upload' },
                ].map((t) => (
                    <button key={t.label} className={styles.tool_btn} aria-label={t.label}>
                        <Image src={t.icon} alt={t.label} width={36} height={36} />
                    </button>
                ))}
            </div>
            <div className={styles.unlock_bar}>
                <Image src="/icons/plus.svg" alt="Unlock" width={28} height={28} />
                <span>Unlock Artist tools from UAH 69.99/month.</span>
            </div>
        </div>
    );
}

function ArtistsToFollow({ artists }: { artists: Artist[] }) {
    const [followed, set_followed] = useState<Set<number>>(new Set());

    const toggle = (id: number) => {
        set_followed(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className={styles.section}>
            <div className={styles.section_header}>
                <h3 className={styles.section_title}>Artist you should follow</h3>
                <button className={styles.refresh_btn}>refresh list</button>
            </div>
            <div className={styles.artists_list}>
                {artists.map((a) => (
                    <div key={a.id} className={styles.artist_row}>
                        <Image src={a.avatar} alt={a.name} width={46} height={46} className={styles.artist_avatar} />
                        <div className={styles.artist_info}>
                            <span className={styles.artist_name}>{a.name}</span>
                            <div className={styles.artist_stats}>
                                <Image src="/icons/person.svg" alt="Followers" width={18} height={18} />
                                <span>{a.followers}</span>
                                <Image src="/icons/wave.svg" alt="Tracks" width={18} height={18} />
                                <span>{a.tracks}</span>
                            </div>
                        </div>
                        <button
                            className={`${styles.follow_btn} ${followed.has(a.id) ? styles.following : ''}`}
                            onClick={() => toggle(a.id)}
                        >
                            {followed.has(a.id) ? 'Following' : 'Follow'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SidebarTrackList({ title, tracks }: { title: string; tracks: SidebarTrack[] }) {
    return (
        <div className={styles.section}>
            <h3 className={styles.section_title}>{title}</h3>
            <div className={styles.track_list}>
                {tracks.map((t) => (
                    <div key={t.id} className={styles.track_row}>
                        <Image src={t.cover_src} alt={t.title} width={52} height={52} className={styles.track_cover} />
                        <div className={styles.track_info}>
                            <span className={styles.track_title}>{t.title}</span>
                            <span className={styles.track_artist}>{t.artist}</span>
                            <div className={styles.track_stats}>
                                <Image src="/icons/play-small.svg"   alt="Plays"    width={18} height={18} />
                                <span>{t.plays}</span>
                                <Image src="/icons/heart-small.svg"  alt="Likes"    width={18} height={18} />
                                <span>{t.likes}</span>
                                <Image src="/icons/retweet-small.svg" alt="Reposts" width={18} height={18} />
                                <span>{t.reposts}</span>
                                <Image src="/icons/comment-small.svg" alt="Comments" width={18} height={18} />
                                <span>{t.comments}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function GoMobile() {
    return (
        <div className={styles.section}>
            <h3 className={styles.section_title}>Go Mobile</h3>
            <div className={styles.store_btns}>
                <a href="#" className={styles.store_btn}>
                    <Image src="/icons/apple.svg" alt="Apple" width={24} height={24} />
                    <div>
                        <div className={styles.store_label}>Download on the</div>
                        <div className={styles.store_name}>App Store</div>
                    </div>
                </a>
                <a href="#" className={styles.store_btn}>
                    <Image src="/icons/google-play.svg" alt="Google Play" width={24} height={24} />
                    <div>
                        <div className={styles.store_label}>GET IT ON</div>
                        <div className={styles.store_name}>Google Play</div>
                    </div>
                </a>
            </div>
        </div>
    );
}

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <ArtistTools />
            <ArtistsToFollow artists={ARTISTS} />
            <SidebarTrackList title="230 Likes"         tracks={LIKED_TRACKS}   />
            <SidebarTrackList title="Listening history" tracks={HISTORY_TRACKS} />
            <GoMobile />
            <SidebarTrackList title="230 Likes"         tracks={LIKED_TRACKS}   />
        </aside>
    );
}
