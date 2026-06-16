var express = require('express');
const router = express.Router();

var db = require('../config/db');

const { getTracks, addStreamId } = require('../repositories/tracks.repo');
const { searchYTTracks, getYTStream } = require('../external/youtube');
const { searchDeezerMp3 } = require('../external/deezer');
const { rankTracks } = require('../utils/dataMaps');

router.get('/', async (req, res) => {
    if (!req.query.id || !req.query.ids) return res.json([]);
    try {
        return res.json({ tracks: await getTracks(req.query.id.split(',') || req.query.ids.split(',')) });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    if (!req.params.id) return res.json({ tracks: [] });
    try {
        return res.json({ tracks: await getTracks(req.params.id.split(',')) });
    } catch (err) {
        next(err);
    }
});

router.get('/:id/stream', async (req, res, next) => {
    if (!req.params.id) return res.json({ stream: '' });
    try {
        const tracks = await getTracks(req.params.id.split(','));
        const t = tracks[0];
        if (!t) return res.status(404).json({ stream: '' });
        if (t.path) return res.json({ stream: t.path });
        let search = [];
        if (!t.streamId) search = await searchYTTracks(`${t.title} ${t.artists?.[0]?.name || ""}`, 3);
        const trackId = t.streamId || search?.[0]?.id;
        if (!trackId) {
            const candidates = [];
            await searchDeezerMp3(q, candidates);
            return res.status(404).json({ stream: rankTracks(candidates, q + ' ' + name)[0].path });
        }
        if (!t.streamId) await addStreamId(t.id, trackId);
        const stream = await getYTStream(trackId);
        if (!stream?.url) return res.status(404).json({ stream: '' });
        return res.json({ stream: stream.url });
    } catch (err) {
        next(err);
    }
});

module.exports = router;