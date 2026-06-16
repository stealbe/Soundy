var express = require('express');
const router = express.Router();

var db = require('../config/db');

const { getAlbums } = require('../repositories/albums.repo');

router.get('/', async (req, res) => {
    if (!req.query.id || !req.query.ids) return res.json([]);
    try {
        return res.json({ albums: await getAlbums(req.query.id.split(',') || req.query.ids.split(',')) });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res) => {
    if (!req.params.id) return res.json([]);
    try {
        return res.json({ albums: await getAlbums(req.params.id.split(',')) });
    } catch (err) { next(err); }
});

module.exports = router;