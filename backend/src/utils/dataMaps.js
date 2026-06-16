const Fuse = require('fuse.js');

function mapDeezerTrack(track) {
    return {
        source: "deezer",
        rank: 1.0,

        external_id: String(track.id),
        title: track.title,
        artists: [{ name: track.artist?.name || "Unknown", subscribers: null }],
        album: { title: track.album?.title || null },
        duration_ms: track.duration * 1000,
        cover_path: track.album?.cover_xl,
        // path: track.preview
    };
}

function mapJamendoTrack(track) {
    return {
        source: "jamendo",
        rank: 0.5,

        external_id: String(track.id),
        title: track.name,
        artists: [{ name: track.artist_name || "Unknown", subscribers: null }],
        album: { title: track.album_name || null },
        duration_ms: track.duration * 1000,
        cover_path: track.album_image || track.image,
        path: track.audio
    };
}

function mapAudiusTrack(track) {
    return {
        source: "audius",
        rank: track.play_count > 10000 ? 0.9 :
            track.play_count > 1000 ? 0.8 :
                track.play_count > 100 ? 0.7 : 0.6,

        external_id: String(track.id),
        title: track.title,
        artists: [{ name: track.user?.name || "Unknown", subscribers: track.user?.follower_count ?? null }],
        album: null,
        duration_ms: track.duration,
        cover_path: track.artwork?.["480x480"],
        path: track.stream?.url || track.stream || ''
    };
}

function rankTracks(tracks, query) {
    const fuse = new Fuse(tracks, {
        keys: [
            { name: 'title', weight: 0.7 },
            { name: 'artists.name', weight: 0.3 }
        ],
        includeScore: true,
        threshold: 0.4,
        getFn: (obj, path) => {
            const val = Fuse.config.getFn(obj, path);
            if (typeof val === 'string') return val.toLowerCase();
            if (Array.isArray(val)) return val.map(v => typeof v === 'string' ? v.toLowerCase() : v);
            return val;
        }
    });

    const results = fuse.search(query.toLowerCase());

    if (!results.length) return tracks.sort((a, b) => b.rank - a.rank);

    return results
        .map(r => ({
            ...r.item,
            score: (r.item.rank * 0.6) + ((1 - r.score) * 0.4)
        }))
        .sort((a, b) => b.score - a.score);
}

function rankAlbums(albums, query) {

    const fuse = new Fuse(albums, {
        keys: [
            { name: "title", weight: 0.6 },
            { name: "artists.name", weight: 0.4 }
        ],
        includeScore: true,
        threshold: 0.4,
        ignoreLocation: true
    });

    return fuse.search(query)
        .map(r => ({
            ...r.item,
            score: ((r.item.rank ?? 1) * 0.6) + ((1 - (r.score ?? 1)) * 0.4)
        }))
        .sort((a, b) => b.score - a.score);
}

function mapDeezerAlbum(album) {
    return {
        source: "deezer",
        rank: 1.0,
        external_id: String(album.id),
        title: album.title,
        artists: [{ name: album.artist?.name || "Unknown", subscribers: null }],
        cover_path: album.cover_xl
    };
}

function mapDeezerArtist(artist) {
    return {
        source: "deezer",
        rank: 1.0,
        external_id: String(artist.id),
        name: artist.name,
        subscribers: artist.nb_fans,
        cover_path: artist.picture_xl
    };
}

function mapDeezerPlaylist(p) {
    return {
        name: p.title,
        description: p.description || null,
        cover_path: p.picture_xl || p.picture_big || null,
        owner_id: null,
        owner: {
            name: 'soundy',
            avatar_url: ''
        },
        tracks: (p.tracks || []).map(t => ({
            deezer_id: t.id,
            title: t.title,
            duration_ms: t.duration * 1000,
            path: t.preview || null,
            cover_path: null,
            is_explicit: t.explicit_lyrics,
            position: null,
            artists: [{ name: t.artist.name }],
            album: { title: null }
        })),
        collaborators: []
    };
}

function cleanSCTitle(title = "", artist = "") {
    let result = title;

    // удалить ссылки в скобках
    result = result.replace(/\((?:https?:\/\/)?(?:www\.)?[^\)]*\)/gi, "");

    // удалить [] теги
    result = result.replace(/\[[^\]]+\]/g, "");

    // если название начинается с артиста
    if (artist) {
        const escaped = artist.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        result = result.replace(
            new RegExp(`^${escaped}\\s*[-—–:]\\s*`, "i"),
            ""
        );
    }

    // убрать лишние пробелы
    result = result.replace(/\s+/g, " ").trim();

    return result;
}

function mapSCTrack(track) {
    const artist =
        track.publisher_metadata?.artist ||
        track.user?.username ||
        "Unknown";

    return {
        source: "soundcloud",
        rank: 0.9,

        external_id: String(track.id),
        title: cleanSCTitle(track.title, artist),

        artists: [
            {
                name: track.user?.username || "Unknown",
                subscribers: track.user?.followers_count ?? null
            }
        ],

        album: track.publisher_metadata?.album_title
            ? { title: track.publisher_metadata.album_title }
            : null,

        duration_ms: track.duration ?? null,

        cover_path:
            track.artwork_url?.replace("-large.", "-t500x500.") ||
            track.user?.avatar_url?.replace("-large.", "-t500x500.") ||
            null,

        permalink: track.permalink_url
    };
}

function mapSCPlaylist(p) {
    return {
        source: "soundcloud",
        external_id: String(p.id),

        name: p.title,
        description: p.description || null,

        cover_path:
            (p.artwork_url && p.artwork_url.replace("-large", "-t500x500")) ||
            (p.tracks?.[0]?.artwork_url &&
                p.tracks[0].artwork_url.replace("-large", "-t500x500")) ||
            null,

        owner_id: p.user?.id ? String(p.user.id) : null,

        owner: p.user
            ? {
                name: p.user.username,
                avatar_url:
                    (p.user.avatar_url &&
                        p.user.avatar_url.replace("-large", "-t500x500")) ||
                    null,
            }
            : null,

        tracks: (p.tracks || []).map(t => ({
            sc_id: t.id,
            title: t.title,

            duration_ms: t.duration || 0,

            path: null, // streaming через transcoding

            cover_path:
                (t.artwork_url &&
                    t.artwork_url.replace("-large", "-t500x500")) ||
                (p.artwork_url &&
                    p.artwork_url.replace("-large", "-t500x500")) ||
                null,

            is_explicit: t.sharing === "private",

            position: t.track_number ?? null,

            artists: t.user ? [{ name: t.user.username }] : [],

            album: {
                title: p.title,
            },
        })),

        collaborators: p.collaborative
            ? (p.tracks || [])
                .map(t => t.user?.username)
                .filter(Boolean)
            : [],
    };
}

function mapSCAlbum(a) {
    return {
        source: "soundcloud",
        rank: 1.0,
        external_id: String(a.id),

        title: a.title,

        artists: [
            {
                name: a.user?.username || "Unknown",
                subscribers: a.user?.followers_count ?? null,
            },
        ],

        cover_path:
            (a.artwork_url && a.artwork_url.replace("-large", "-t500x500")) ||
            (a.user?.avatar_url &&
                a.user.avatar_url.replace("-large", "-t500x500")) ||
            null,

        track_count: a.track_count ?? (a.tracks ? a.tracks.length : 0),
    };
}

function mapSCArtist(user) {
    return {
        source: "soundcloud",
        rank: 1.0,

        external_id: String(user.id),

        name: user.username,

        subscribers: user.followers_count ?? null,

        cover_path:
            (user.avatar_url &&
                user.avatar_url.replace("-large", "-t500x500")) ||
            null,

        description: user.description || null,

        city: user.city || null,
        country: user.country || null,

        verified: user.verified ?? false,
    };
}

function rankPlaylists(playlists, query) {
    const fuse = new Fuse(playlists, {
        keys: [
            { name: 'name', weight: 0.7 },
            { name: 'owner.username', weight: 0.3 }
        ],
        includeScore: true,
        threshold: 0.4,
        ignoreLocation: true
    });

    return fuse.search(query)
        .map(r => ({
            ...r.item,
            score: ((r.item.fans ?? 1) * 0.6) + ((1 - (r.score ?? 1)) * 0.4)
        }))
        .sort((a, b) => b.score - a.score);
}

module.exports = { mapAudiusTrack, mapDeezerTrack, mapJamendoTrack, rankTracks, rankAlbums, mapDeezerAlbum, mapDeezerArtist, mapDeezerPlaylist, mapSCTrack, mapSCPlaylist, mapSCAlbum, mapSCArtist, rankPlaylists };