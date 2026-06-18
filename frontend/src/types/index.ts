// types/index.ts

export type User = {
    id: string;
    email: string;
    username: string;
    avatar_url?: string;
    is_premium?: boolean;
    country_code?: string;
    is_active?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme_config?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
};

export type Artist = {
    id: string;
    name: string;
    cover_path: string;
    created_at?: string;
    subscribers?: number;
    tracks_count: number;
};

export type Album = {
    id: string;
    title: string;
    year?: number;
    cover_path?: string;
    created_at?: string;
    // joined
    artists?: Artist[];
    tracks?:Track[];
};

export type Track = {
    id: string;
    album_id?: string;
    title: string;
    year?: number;
    genre?: string;
    duration_ms?: number;
    is_explicit?: boolean;
    play_count?: number;
    path?: string;
    cover_path?: string;
    created_at?: string;
    updated_at?: string;
    likes?: number;
    reposts?: number;
    comments?: number;
    // joined
    album?: Album;
    artists?: Artist[];
    isLiked?: boolean;
    // ifPlaylist
    added_at?:string;
};

export type Playlist = {
    id: string;
    owner_id: string;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    // joined
    owner?: User;
    tracks?: Track[];
};

export type Session = {
    id: string;
    user_id: string;
    device_info?: string;
    refresh_token?: string;
    expires_at?: string;
    last_used_at?: string;
    revoked?: boolean;
    created_at?: string;
};

export type SearchResults = {
    tracks?: Track[];
    albums?: Album[];
    artists?: Artist[];
    playlists?: Playlist[];
};