'use client';

import { useState } from 'react';
import styles from './page.module.css';
import PlaylistPost from '@/components/PlaylistPost/PlaylistPost';

const TRACKS_POST_1 = [
    { id: 1, title: 'Loose Cannon', artist: 'PUZZLE', cover_src: '/feed/Loose_Cannon.jpg', plays: '1M' },
    { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', cover_src: '/feed/Blinding_Lights.jpg', plays: '1M' },
    { id: 3, title: 'I Gotta Feeling', artist: 'The Black Eyed Peas', cover_src: '/feed/I_Gotta_Feeling.jpg', plays: '1M' },
    { id: 4, title: 'bury a friend', artist: 'Billie Eilish', cover_src: '/feed/bury_a_friend.jpg', plays: '1M' },
    { id: 5, title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', cover_src: '/feed/Uptown_Funk.jpg', plays: '1M' },
];

const user_data = { name: "ZENGY", avatar: "/no-avatar.webp" };



const TRACKS_POST_2 = TRACKS_POST_1.map(t => ({ ...t, id: t.id + 10 }));

export default function FeedPage() {
    const [activeTrack1, setActiveTrack1] = useState<number | null>(null);
    const [activeTrack2, setActiveTrack2] = useState<number | null>(null);
    return (
        <div className={styles.layout}>
            <div className={styles.content}>
                <main className={styles.main}>
                    <h2 className={styles.feed_title}>
                        Hear the latest posts from the people you're following:
                    </h2>
                    <div className={styles.posts}>
                        <PlaylistPost
                            user_avatar={user_data.avatar}
                            user_name={user_data.name}
                            playlist_name="Low Cortisol"
                            posted_at="7 weeks ago"
                            tracks={TRACKS_POST_1}
                            activeTrackId={activeTrack1}
                            total_tracks={TRACKS_POST_1.length}
                            duration="2:55"
                            onTrackSelect={setActiveTrack1}
                        />
                        <PlaylistPost
                            user_avatar={user_data.avatar}
                            user_name={user_data.name}
                            playlist_name="Low Cortisol"
                            posted_at="7 weeks ago"
                            tracks={TRACKS_POST_2}
                            activeTrackId={activeTrack2}
                            total_tracks={TRACKS_POST_2.length}
                            duration="1:55"
                            onTrackSelect={setActiveTrack2}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}