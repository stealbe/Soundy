'use client';

import Image from 'next/image';
import styles from './PlaylistPost.module.css';
import Waveform from '../Waveform/waveform';
import TrackRow from '../trackRow/trackRow';
import PostActions from '../PostActions/PostActions';
import { useState } from 'react';

interface Track {
    id: number;
    title: string;
    artist: string;
    cover_src: string;
    plays?: string;
}

interface PlaylistPostProps {
    user_avatar: string;
    user_name: string;
    playlist_name: string;
    posted_at: string;
    tracks: Track[];
    activeTrackId: number | null;
    onTrackSelect: (id: number) => void;
    total_tracks: number;
    duration?: string;
}

export default function PlaylistPost({
    user_avatar,
    user_name,
    playlist_name,
    posted_at,
    tracks,
    total_tracks,
    duration = '1:55',
    activeTrackId,
    onTrackSelect
}: PlaylistPostProps) {
    const active = tracks.find(t => t.id === activeTrackId) ?? tracks[0];
    return (
        <div className={styles.post}>
            <div className={styles.post_header}>
                <Image src={user_avatar} alt={user_name} width={48} height={48} className={styles.user_avatar} />
                <span className={styles.post_meta}>{user_name} posted playlist {posted_at}</span>
            </div>
            <div className={styles.playlist_card}>
                <div className={styles.playlist_top}>
                    {activeTrackId !== null ? (
                        <>
                            <Image
                                src={active.cover_src}
                                alt={active.title}
                                width={240}
                                height={200}
                                className={styles.playlist_cover}
                                style={{ width: '240px', height: '200px', objectFit: 'cover' }}
                            />
                            <div className={styles.playlist_info}>
                                <div className={styles.play_row}>
                                    <button className={styles.play_big} aria-label="Play track">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                    <div>
                                        <div className={styles.playlist_title}>{active.title}</div>
                                        <div className={styles.playlist_sub}>{active.artist}</div>
                                    </div>
                                </div>
                                <div className={styles.waveform_wrap}>
                                    <Waveform duration={duration} progress={0} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Image
                                src={active.cover_src}
                                alt={playlist_name}
                                width={240}
                                height={200}
                                className={styles.playlist_cover}
                                style={{ width: '240px', height: '200px', objectFit: 'cover' }}
                            />
                            <div className={styles.playlist_info}>
                                <div className={styles.play_row}>
                                    <button className={styles.play_big} aria-label="Play playlist">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                    <div>
                                        <div className={styles.playlist_title}>{playlist_name}</div>
                                        <div className={styles.playlist_sub}>{user_name}</div>
                                    </div>
                                </div>
                                <div className={styles.waveform_wrap}>
                                    <Waveform duration={duration} progress={0} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.track_list}>
                    {tracks.map((t, idx) => (
                        <TrackRow
                            key={t.id}
                            index={idx + 1}
                            title={t.title}
                            artist={t.artist}
                            cover_src={t.cover_src}
                            plays={t.plays}
                            is_active={activeTrackId === t.id}
                            on_play={() => { onTrackSelect(t.id); console.log(`Track ${t.id} selected`) }}
                        />
                    ))}
                    <button className={styles.view_all}>View {total_tracks} tracks</button>
                </div>
                {/* <PostActions currentTrack={tracks[activeTrackId - 1]?.title || null} /> */}
            </div>
        </div>
    );
}
