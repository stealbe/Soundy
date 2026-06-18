'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './PostActions.module.css';
import { title } from 'process';

interface PostActionsProps {
    likes?: number;
    reposts?: number;
    currentTrack?: string | null;
}

export default function PostActions({ likes = 0, reposts = 0, currentTrack }: PostActionsProps) {
    const [liked, set_liked] = useState(false);
    const [reposted, set_reposted] = useState(false);

    return (
        <div className={styles.actions}>
            <button
                className={`${styles.action_btn} ${liked ? styles.active : ''}`}
                onClick={() => set_liked(v => !v)}
                aria-label="Like"
            >
                <Image src="/icons/like.svg" alt="Like" width={28} height={28} />
            </button>
            <button
                className={`${styles.action_btn} ${reposted ? styles.active : ''}`}
                onClick={() => set_reposted(v => !v)}
                aria-label="Repost"
            >
                <Image src="/icons/repost.svg" alt="Repost" width={28} height={28} />
            </button>
            <button className={styles.action_btn} aria-label="Download" onClick={() => alert(`Download track: ${currentTrack}`)}>
                <Image src="/icons/download.svg" alt="Download" width={28} height={28} />
            </button>
            <button className={styles.action_btn} aria-label="Add to playlist" onClick={() => alert(`Add to playlist: ${null}`)}>
                <Image src="/icons/add.svg" alt="Add" width={28} height={28} />
            </button>
            <button className={styles.action_btn} aria-label="Share" onClick={() => alert('Share functionality not implemented yet.')}>
                <Image src="/icons/share.svg" alt="Share" width={20} height={20} />
            </button>
        </div>
    );
}
