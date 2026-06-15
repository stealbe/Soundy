var express = require('express');
const router = express.Router();

var db = require('../config/db');

const { getPlaylists } = require('../repositories/playlists.repo');

router.get('/', async (req, res) => {
    if (!req.query.id || !req.query.ids) return res.json([]);
    try {
        return res.json(await Promise.all((await getPlaylists(req.query.id.split(',') || req.query.ids.split(','))).map(async p => ({
            ...p,
            tracks: await Promise.all((p.tracks ?? []).map(async t => {
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
    if (!req.params.id) return res.json([])
    try {
        return res.json(await Promise.all((await getPlaylists(req.params.id.split(','))).map(async p => ({
            ...p,
            tracks: await Promise.all((p.tracks ?? []).map(async t => {
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