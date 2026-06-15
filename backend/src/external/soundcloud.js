const { mapSCTrack, mapSCPlaylist, mapSCArtist, mapSCAlbum } = require('../utils/dataMaps');

const BASE_URL = "https://api-v2.soundcloud.com/search";

const SC_CLIENT_ID = process.env.SC_CLIENT_ID;
const SC_USER_ID = process.env.SC_USER_ID;
const SC_A_ID = process.env.SC_A_ID;

function buildUrl(q, limit) {
    const url = new URL(BASE_URL);

    url.search = new URLSearchParams({
        q: q || "",
        sc_a_id: SC_A_ID,
        facet: "model",
        user_id: SC_USER_ID,
        client_id: SC_CLIENT_ID,
        limit: String(limit),
        offset: "0",
        linked_partitioning: "1",
        app_version: "1781092636",
        app_locale: "en",
    }).toString();

    return url;
}

async function fetchSC(q, limit = 20) {
    const res = await fetch(buildUrl(q, limit));

    if (!res.ok) {
        throw new Error(`SoundCloud API error: ${res.status}`);
    }

    const json = await res.json();
    return json.collection || [];
}

async function searchSCTracks(q, limit = 20) {
    const collection = await fetchSC(q, limit);

    return collection
        .filter(item => item.kind === "track")
        .map(mapSCTrack);
}

async function searchSCPlaylists(q, limit = 20) {
    const res = await fetch(
        `https://api-v2.soundcloud.com/search?q=${encodeURIComponent(q)}&sc_a_id=${process.env.SC_A_ID}` +
        `&facet=model&user_id=${process.env.SC_USER_ID}` +
        `&client_id=${process.env.SC_CLIENT_ID}&limit=${limit}&offset=0` +
        `&linked_partitioning=1&app_version=1781092636&app_locale=en`
    );

    const json = await res.json();

    return (json.collection || [])
        .filter(i => i.kind === "playlist" && i.is_album === false)
        .map(mapSCPlaylist);
}

async function searchSCArtists(q, limit = 20) {
    const collection = await fetchSC(q, limit);

    return collection
        .filter(item => item.kind === "user")
        .map(mapSCArtist);
}


async function searchSCAlbums(q, limit = 20) {
    const res = await fetch(
        `https://api-v2.soundcloud.com/search?q=${encodeURIComponent(q)}&sc_a_id=${process.env.SC_A_ID}` +
        `&facet=model&user_id=${process.env.SC_USER_ID}` +
        `&client_id=${process.env.SC_CLIENT_ID}&limit=${limit}&offset=0` +
        `&linked_partitioning=1&app_version=1781092636&app_locale=en`
    );

    const json = await res.json();

    return (json.collection || [])
        .filter(i => i.kind === "playlist" && i.is_album === true)
        .map(mapSCAlbum);
}

module.exports = {
    searchSCTracks,
    searchSCPlaylists,
    searchSCArtists,
    searchSCAlbums
};