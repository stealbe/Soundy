const db = require('../config/db');

async function findArtists(q, limit = 20) {
    if (!q || !q.length) {
        return await db.query(`
            SELECT
                a.*,
                COUNT(DISTINCT t.id) AS tracks_count
            FROM artists a
            LEFT JOIN tracks_compositors tc ON tc.author_id = a.id
            LEFT JOIN tracks t ON t.id = tc.track_id
            GROUP BY a.id
            ORDER BY a.id
            LIMIT $1;
            `, [limit]).then(r => r.rows);
    }
    return await db.query(`
        SELECT
            a.*,
            COALESCE(tc.tracks_count, 0) AS tracks_count,
            similarity(a.name, $1) AS score
        FROM artists a
        LEFT JOIN (
            SELECT
                author,
                COUNT(DISTINCT track_id) AS tracks_count
            FROM tracks_compositors
            GROUP BY author
        ) tc ON tc.author_id = a.id
        WHERE a.name % $1
        ORDER BY score DESC
        LIMIT $2;
        `, [q, limit]).then(r => r.rows);
}

async function getArtists(ids) {
    return await db.query(`
        SELECT
        *
        FROM artists a
        WHERE id = ANY($1)
        ORDER by id
        `, [ids]).then(r => r.rows);
}

async function saveArtists(artists) {
    const ids = [];
    for (const a of artists) {
        const result = await db.query(`
        INSERT INTO artists (name, subscribers, cover_path)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name, subscribers = EXCLUDED.subscribers
        RETURNING id
    `, [a.name, a.subscribers, a.cover_path]);

        ids.push(result.rows[0].id);
    }

    return ids;
}


module.exports = { findArtists, saveArtists, getArtists };