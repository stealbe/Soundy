const { mapJamendoTrack } = require('../utils/dataMaps');
const API = 'https://api.jamendo.com/v3.0';
async function searchJamendoTracks(q, limit = 20) {
    const res = await fetch(
        `${API}/tracks/?client_id=${process.env.JAMENDO_ID}` +
        `&format=json&limit=10&search=${encodeURIComponent(q)}&limit=${limit}`
    );
    const json = await res.json();
    return json.data || [];
}

async function searchJamendoMp3(q, candidates) {
    try {
        const res = await fetch(
            `${API}/tracks/?client_id=${process.env.JAMENDO_ID}` +
            `&format=json&limit=10&namesearch=${encodeURIComponent(q)}&audioformat=mp32`
        );

        const json = await res.json();

        for (const t of json.results || []) {
            if (!t || !t?.audio) continue;

            candidates.push(mapJamendoTrack(t));
        }

    } catch (e) {
        console.warn("[Jamendo error]", e.message);
    }
}

module.exports = { searchJamendoTracks, searchJamendoMp3 };