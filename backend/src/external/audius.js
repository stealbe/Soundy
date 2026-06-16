const { mapAudiusTrack } = require("../utils/dataMaps");

let audiusHost = null;

async function getAudiusHost() {
    if (audiusHost) return audiusHost;
    const res = await fetch('https://api.audius.co');
    const json = await res.json();
    audiusHost = json.data[0];
    return audiusHost;
}

async function searchAudiusTracks(q, limit = 20) {
    const host = await getAudiusHost();
    const res = await fetch(
        `${host}/v1/tracks/search?query=${encodeURIComponent(q)}&limit=${limit}`
    );
    const json = await res.json();
    return json.data || [];
}

async function searchAudiusMp3(q, candidates) {
    try {
        const res = await fetch(
            `https://api.audius.co/v1/tracks/search?query=${encodeURIComponent(q)}&app_name=Soundy&limit=10`
        );

        if (!res.ok) return;

        const { data = [] } = await res.json();
        console.log('[Audius]', data.length, 'tracks');

        for (const t of data) {
            if (!t) continue;
            candidates.push(mapAudiusTrack(t));
        }
    } catch (e) {
        console.warn("[Audius error]", e.message);
    }
}

module.exports = { searchAudiusTracks, searchAudiusMp3 };