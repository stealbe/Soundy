var express = require('express');
const router = express.Router();

var db = require('../config/db');

const { getTracks } = require('../repositories/tracks.repo');

router.get('/', async (req, res) => {
    if (!req.query.id || !req.query.ids) return res.json([]);
    try {
        return res.json({
            tracks: await Promise.all((await getTracks(req.query.id.split(',') || req.query.ids.split(','))).map(async t => {
                if (!t.path) {
                    const yt = await getYT();
                    const res = await yt.music.search(t.title);
                    t.path = res?.[0]?.stream ?? null;
                }
                return t;
            }))
        });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res) => {
    if (!req.params.id) return res.json([]);
    try {
        return res.json({
            tracks: await Promise.all((await getTracks(req.params.ids.split(','))).map(async t => {
                if (!t.path) {
                    const yt = await getYT();
                    const res = await yt.music.search(t.title);
                    t.path = res?.[0]?.stream ?? null;
                }
                return t;
            }))
        });
    } catch (err) { next(err); }
});

module.exports = router;