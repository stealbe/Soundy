'use client';

import Image from 'next/image';
import styles from './TrackRow.module.css';
import { useState } from 'react';
import { LiquidGlass } from '@creativoma/liquid-glass';

interface TrackRowProps {
    index: number;
    title: string;
    artist: string;
    cover_src: string;
    plays?: string;
    is_active?: boolean;
    on_play?: () => void;
}

export default function TrackRow({
    index,
    title = "Label",
    artist = "John Doe",
    cover_src,
    plays = '1M',
    is_active = false,
    on_play,
}: TrackRowProps) {
    const content = (
        <div className={`${styles.row} ${is_active ? styles.active : ''}`} onClick={on_play}>
            <Image
                src={cover_src}
                alt={title}
                width={44}
                height={44}
                className={styles.cover}
            />
            <div className={styles.info}>
                <span className={styles.title}>{index} - {title}</span>
                <span className={styles.dot} />
                <span className={styles.artist}>{artist}</span>
            </div>
            <div className={styles.right}>
                <span className={styles.plays}>{plays}</span>
                <button className={styles.play_btn} onClick={on_play} aria-label="Play">
                    <Image src="/icons/play.svg" alt="Play" width={18} height={18} />
                </button>
            </div>
        </div>
    );

    if (is_active) {
        return <LiquidGlass>{content}</LiquidGlass>;
    }

    return content;
}