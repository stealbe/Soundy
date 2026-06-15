const { findTracks, saveTracks, getTracks, addStreamId } = require('../repositories/tracks.repo');
const { findAlbums, saveAlbums, getAlbums } = require('../repositories/albums.repo');
const { findArtists, saveArtists } = require('../repositories/artists.repo');
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

        const list = await findTracks(limit);
        return await buildTracks(list);
    }
    const queries = q.split(",").map(s => s.trim()).filter(Boolean);

    console.log(queries);

    const results = [];

    for (const query of queries) {
        const local = await findTracks(query, limit);
        if (local.length > limit) { results.push(...local); continue; }

        // const res = await searchDeezerTracks(query).then(tracks => tracks.map(t => mapDeezerTrack(t)));

        const res = await searchSCTracks(query, 20);

        const resolved = await Promise.all(
            res.map(async (t) => {
                let album = null;
                if (t.album?.title) {
                    const found = await searchAlbums(t.album.title, 1);
                    album = found?.[0] || null;
                }
                if (!album) {
                    const aId = await saveAlbums([
                        {
                            title: t.album?.title || t.title,
                            year: t.year || null,
                            cover_path: t.cover_path || null,
                            artists: t.artist || [],
                            is_virtual: true
                        }
                    ]);
                    const created = await getAlbums([aId]);
                    album = created?.[0] || null;
                }
                t.album = album;
                t.artists = await Promise.all(
                    t.artists.map(async (a) => {
                        const found = (await findArtists(a.name))[0];
                        return found || (await searchArtists(a.name, 1))[0] || a;
                    })
                );
                // if (!t.path) t.path = await outSearchMp3(t.title, t.artists[0]?.name);

                // if (!t.path) {
                //     const candidates = [];
                //     await searchDeezerMp3(q, candidates);
                //     t.path = rankTracks(candidates, q + ' ' + name)[0].path
                // }
                // if (!t.path) return null;
                if (!t.artists[0]?.id) return null;
                return t;
            })
        ).then(r => r.filter(Boolean));

        const ids = await saveTracks(resolved);
        const dbList = await getTracks(ids);

        const enriched = await buildTracks(dbList);

        results.push(...rankTracks(enriched, query).slice(0, limit));
    }

    return results;
}

async function buildTracks(list) {
    const resolved = [];

    for (const t of list) {
        if (t.path) continue;
        try {
            const search = [];

            if (!t.streamId) {
                const search = await searchYTTracks(
                    `${t.title} ${t.artists?.[0]?.name || ""}`,
                    3
                );
            }

            const trackId = t.streamId || search?.[0]?.id;
            if (!trackId) continue;

            if (!t.streamId) await addStreamId(t.id, trackId);

            const stream = await getYTStream(trackId);
            if (!stream?.url) continue;
            resolved.push({
                ...t,
                // source: {
                //     id: search[0].id,
                //     title: search[0].title,
                //     url: search[0].url,
                // },
                path: stream.url,
            });
        } catch (err) {
            console.error("TRACK ERROR:", t?.title, err.message);
            continue;
        }
    }

    return resolved || [];
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
    if (!q || !q.length)
        return Promise.all(
            (await findAlbums(limit)).map(async a => ({
                ...a,
                tracks: await buildTracks(a.tracks ?? []),
            }))
        );
    const queries = q.split(",").map(s => s.trim()).filter(Boolean);

    const results = []

    for (const query of queries) {
        const local = await findAlbums(query, limit);
        if (local.length) { results.push(...local); continue; }

        // const res = await searchDeezerAlbums(query, 1).then(albums => albums.map(a => mapDeezerAlbum(a)));

        const res = await searchSCAlbums(query, 1);

        for (const a of res) {
            a.artists = await Promise.all(
                a.artists.map(async (artist) => {
                    const found = (await findArtists(artist.name))[0];
                    return found || (await searchArtists(artist.name, 1))[0] || artist;
                })
            );
        }

        const ids = await saveAlbums(res);
        results.push(
            ...rankAlbums(
                await Promise.all(
                    (await getAlbums(ids)).map(async a => ({
                        ...a,
                        tracks: await buildTracks(a.tracks ?? []),
                    }))
                ),
                query
            )
        );
    }

    return results;
}

async function searchArtists(q, limit = 1) {
    if (!q || !q.length) return await findArtists(q, limit);
    const queries = q?.split(",").map(s => s.trim()).filter(Boolean);

    const results = []

    for (const query of queries) {
        const local = await findArtists(query, limit);
        if (local.length) { results.push(...local); continue; }
        // const res = await searchDeezerArtists(query).then(a => a.map(a => mapDeezerArtist(a)));
        const res = await searchSCArtists(query, 1);
        const ids = await saveArtists(res);
        results.push(...await findArtists(query, limit));
    }

    return results;
}

async function searchPlaylists(q, limit = 1) {
    if (!q || !q.length) {
        const list = await findPlaylists(limit);

        return await Promise.all(
            list.map(async p => ({
                ...p,
                tracks: await buildTracks(a.tracks ?? []),
            }))
        );
    }
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

        const enriched = await Promise.all(
            list.map(async p => ({
                ...p,
                tracks: await buildTracks(a.tracks ?? []),
            }))
        );

        results.push(...rankPlaylists(enriched, query).slice(0, limit));
    }

    return results;
}

module.exports = { searchAlbums, searchArtists, searchTracks, searchPlaylists, buildTracks };