const { findTracks, saveTracks, getTracks, addStreamId } = require('../repositories/tracks.repo');
const { findAlbums, saveAlbums, getAlbums } = require('../repositories/albums.repo');
const { findArtists, saveArtists, getArtists } = require('../repositories/artists.repo');
const { findPlaylists, savePlaylists, getPlaylists } = require('../repositories/playlists.repo');
const { searchDeezerTracks, searchDeezerMp3, searchDeezerAlbums, searchDeezerArtists, searchDeezerPlaylists } = require("../external/deezer");
const { mapDeezerTrack, mapDeezerAlbum, mapDeezerArtist, mapDeezerPlaylist, rankAlbums, rankTracks, rankPlaylists } = require('../utils/dataMaps');
const { searchJamendoMp3 } = require('../external/jamendo');
const { searchAudiusMp3 } = require('../external/audius');
const { searchArchiveMp3 } = require('../external/internetArchive')
const { searchSCTracks, searchSCAlbums, searchSCArtists, searchSCPlaylists } = require('../external/soundcloud');
const { getYTStream, searchYTTracks } = require('../external/youtube');

async function searchTracks(q, limit = 1) {
    if (!q || !q.length) {

        // const list = await findTracks(undefined, limit);
        // return await buildTracks(list); мб stream отдавать отдельным роутом
        return await findTracks(undefined, limit);
    }
    const queries = q.split(",").map(s => s.trim()).filter(Boolean);

    console.log(queries);

    const results = [];

    for (const query of queries) {
        const local = await findTracks(query, limit);
        if (local.length > limit) { results.push(...local); continue; }

        // const res = await searchDeezerTracks(query).then(tracks => tracks.map(t => mapDeezerTrack(t)));

        const res = await searchSCTracks(query, 20);

        const albumCache = new Map();

        const resolved = await Promise.all(
            res.map(async (t) => {
                t.artists = await Promise.all(
                    t.artists.map(async (a) => {
                        const found = (await findArtists(a.name))[0];
                        return found || (await searchArtists(a.name, 1))[0] || a;
                    })
                );

                if (!t.artists[0]?.id) return null;

                let album = null;

                const albumTitle = t.album?.title || t.title;
                const artistName = (t.artists || []).map(a => a.name).join('|');

                const albumKey = (albumTitle + '::' + artistName)
                    .toLowerCase()
                    .trim();

                // 1) кеш в рамках запроса
                if (albumCache.has(albumKey)) {
                    album = albumCache.get(albumKey);
                } else {
                    // 2) сначала ищем в БД
                    if (t.album?.title) {
                        const found = await searchAlbums(t.album.title, 1);
                        album = found?.[0] || null;
                    }

                    // 3) если не нашли — создаём
                    if (!album) {
                        const aId = await saveAlbums([
                            {
                                title: albumTitle,
                                year: t.year || null,
                                cover_path: t.cover_path || null,
                                artists: t.artists?.length ? t.artists : (t.artist || []),
                                is_virtual: true
                            }
                        ]);

                        const created = await getAlbums([aId]);
                        album = created?.[0] || null;
                    }

                    albumCache.set(albumKey, album);
                }

                t.album = album;

                return t;
            })
        ).then(r => r.filter(Boolean));
        const ids = await saveTracks(resolved);
        const dbList = await getTracks(ids);

        results.push(...rankTracks(dbList, query).slice(0, limit));
    }

    return results;
}

async function buildTracks(list) {
    const tracks = await Promise.all(
        list.map(async (t) => {
            try {
                if (t.path) return t;

                let search = [];

                if (!t.streamId) {
                    search = await searchYTTracks(
                        `${t.title} ${t.artists?.[0]?.name || ""}`,
                        3
                    );
                }

                const trackId = t.streamId || search?.[0]?.id;

                if (!trackId) return null;

                if (!t.streamId)
                    await addStreamId(t.id, trackId);

                const stream = await getYTStream(trackId);

                if (!stream?.url)
                    return null;

                return {
                    ...t,
                    path: stream.url,
                };
            } catch (err) {
                console.error("TRACK ERROR:", t?.title, err.message);
                return null;
            }
        })
    );

    return tracks.filter(Boolean);
}

async function outSearchMp3(q, name) {
    const candidates = [];

    await Promise.all([
        searchAudiusMp3(q, candidates),
        // searchArchiveMp3(q, candidates),
        searchJamendoMp3(q, candidates),
    ]);

    if (!candidates.length) return null;

    return rankTracks(candidates, q + ' ' + name)[0].path;
}

async function searchAlbums(q, limit = 1) {
    if (!q || !q.length) return await findAlbums(undefined, limit);
    const queries = q.split(",").map(s => s.trim()).filter(Boolean);

    const results = []

    for (const query of queries) {
        const local = await findAlbums(query, limit);
        if (local.length >= limit) { results.push(...local); continue; }

        // const res = await searchDeezerAlbums(query, 1).then(albums => albums.map(a => mapDeezerAlbum(a)));

        const res = await searchSCAlbums(query, 1);

        for (const a of res) {
            a.artists = await Promise.all(
                a.artists.map(async (artist) => {
                    const found = (await findArtists(artist.name))[0];
                    return found || (await searchArtists(artist.name, 1))[0] || a;
                })
            );
        }

        const ids = await saveAlbums(res);
        results.push(...rankAlbums(await getAlbums(ids), query));
    }

    return results;
}

async function searchArtists(q, limit = 1) {
    if (!q || !q.length) return await findArtists(undefined, limit);
    const queries = q?.split(",").map(s => s.trim()).filter(Boolean);

    const results = []

    for (const query of queries) {
        const local = await findArtists(query, limit);
        if (local.length) { results.push(...local); continue; }
        // const res = await searchDeezerArtists(query).then(a => a.map(a => mapDeezerArtist(a)));
        const res = await searchSCArtists(query, 1);
        const ids = await saveArtists(res);
        results.push(...await getArtists(ids));
    }

    return results;
}

async function searchPlaylists(q, limit = 1) {
    if (!q || !q.length) return await findPlaylists(undefined, limit);
    const queries = q.split(",").map(s => s.trim()).filter(Boolean);
    const results = [];

    for (const query of queries) {
        const local = await findPlaylists(query, limit);
        if (local.length) { results.push(...local); continue; }

        // const res = await searchDeezerPlaylists(query, limit).then(playlists => playlists.map(p => mapDeezerPlaylist(p)));
        const res = await searchSCPlaylists(query, limit);

        const resolved = await Promise.all(
            res.map(async (p) => {
                const titles = (p.tracks || []).map(t =>
                    t.title + (t.artists?.[0]?.name ? ' ' + t.artists[0].name : '')
                ).join(',');
                p.tracks = titles.length ? await searchTracks(titles, 1) : [];
                return p;
            })
        );

        const ids = await savePlaylists(resolved);
        const list = await getPlaylists(ids);

        results.push(...rankPlaylists(list, query).slice(0, limit));
    }

    return results;
}

module.exports = { searchAlbums, searchArtists, searchTracks, searchPlaylists, buildTracks };