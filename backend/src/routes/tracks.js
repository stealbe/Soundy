var express = require('express');
const router = express.Router();

var db = require('../config/db');

const { getTracks, addStreamId } = require('../repositories/tracks.repo');
const { searchYTTracks, getYTStream } = require('../external/youtube');

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
        console.log("STEP 1", t);
        // if (!t) return res.status(404).json({ stream: '' });
        if (t.path) {
            console.log("RETURN PATH");
            return res.json({ stream: t.path });
        }
        console.log("STEP 2 before yt search");
        let search = [];
        if (!t.streamId) {
            console.log("YT SEARCH START");
            search = await searchYTTracks(
                `${t.title} ${t.artists?.[0]?.name || ""}`,
                3
            );
            console.log("YT SEARCH END", search?.length);
        }
        const trackId = t.streamId || search?.[0]?.id;
        console.log("TRACK ID:", trackId);
        if (!trackId) return res.status(404).json({ stream: '' });
        if (!t.streamId) await addStreamId(t.id, trackId);
        const stream = await getYTStream(trackId);
        console.log(stream);
        if (!stream?.url) return res.status(404).json({ stream: '' });
        console.log(stream);
        return res.json({ stream: stream.url });
    } catch (err) {
        next(err);
    }
});

module.exports = router;