var express = require('express');
const router = express.Router();

var db = require('../config/db');

const { getAlbums } = require('../repositories/albums.repo');

router.get('/', async (req, res) => {
    if (!req.query.id || !req.query.ids) return res.json([]);
    try {
        return res.json(await Promise.all((await getAlbums(req.query.id.split(',') || req.query.ids.split(','))).map(async a => ({
            ...a,
            tracks: await Promise.all((a.tracks ?? []).map(async t => {
                if (!t.path) {
                    const yt = await getYT();
                    const r = await yt.music.search(t.title);
                    t.path = r?.[0]?.stream ?? null;
                }
                return t;
            }))
        }))));
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res) => {
    if (!req.params.id) return res.json([]);
    try {
        return res.json(await Promise.all((await getAlbums(req.params.id.split(','))).map(async a => ({
            ...a,
            tracks: await Promise.all((a.tracks ?? []).map(async t => {
                if (!t.path) {
                    const yt = await getYT();
                    const r = await yt.music.search(t.title);
                    t.path = r?.[0]?.stream ?? null;
                }
                return t;
            }))
        }))));
    } catch (err) { next(err); }
});

module.exports = router;