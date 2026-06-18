'use client';

import styles from './waveform.module.css';

interface WaveformProps {
    progress?: number; // 0..1
    duration?: string;
}

const BAR_COUNT = 200;

function gen_heights(): number[] {
    const arr: number[] = [];
    for (let i = 0; i < BAR_COUNT; i++) {
        arr.push(30 + Math.random() * 70);
    }
    return arr;
}

const HEIGHTS = gen_heights();

export default function Waveform({ duration = '1:55', progress = 0 }: WaveformProps) {
    const played_bars = Math.floor(progress * BAR_COUNT);

    return (
        <div className={styles.wrap}>
            <div className={styles.bars}>
                {HEIGHTS.map((h, i) => (
                    <div
                        key={i}
                        className={styles.bar}
                        style={{
                            height: `${h}%`,
                            background: i < played_bars ? '#fff' : 'rgba(255,255,255,0.3)',
                        }}
                    />
                ))}
            </div>
            <span className={styles.time}>{duration}</span>
        </div>
    );
}