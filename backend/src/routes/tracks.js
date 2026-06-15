var express = require('express');
const router = express.Router();

var db = require('../config/db');

const { getTracks } = require('../repositories/tracks.repo');
const { buildTracks } = require('../services/search.service');

router.get('/', async (req, res) => {
    if (!req.query.id || !req.query.ids) return res.json([]);
    try {
        const tracks = await getTracks(req.query.id.split(',') || req.query.ids.split(','));
        return res.json({ tracks: await buildTracks(tracks) });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    if (!req.params.id) return res.json({ tracks: [] });
    try {
        const tracks = await getTracks(req.params.id.split(','));
        return res.json({ tracks: await buildTracks(tracks) });
    } catch (err) {
        next(err);
    }
});

module.exports = router;