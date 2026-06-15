var express = require('express');
const router = express.Router();

var db = require('../config/db');

const { getPlaylists } = require('../repositories/playlists.repo');

router.get('/', async (req, res) => {
    if (!req.query.id || !req.query.ids) return res.json([]);
    try {
        const playlists = await getPlaylists(req.query.id.split(',') || req.query.ids.split(','));
        return res.json(await Promise.all(
            playlists.map(async (p) => ({
                ...p,
                tracks: await buildTracks(p.tracks ?? []),
            }))
        ));
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res) => {
    if (!req.params.id) return res.json([])
    try {
        const playlists = await getPlaylists(req.params.id.split(','));
        return res.json(await Promise.all(
            playlists.map(async (p) => ({
                ...p,
                tracks: await buildTracks(p.tracks ?? []),
            }))
        ));
    } catch (err) { next(err); }
});

module.exports = router;