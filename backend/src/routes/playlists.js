var express = require('express');
const router = express.Router();

var db = require('../config/db');

const { getPlaylists } = require('../repositories/playlists.repo');

router.get('/', async (req, res) => {
    if (!req.query.id || !req.query.ids) return res.json([]);
    try {
        return res.json(await getPlaylists(req.query.id.split(',') || req.query.ids.split(',')));
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res) => {
    if (!req.params.id) return res.json([])
    try {
        return res.json(await getPlaylists(req.params.id.split(',')));
    } catch (err) { next(err); }
});

module.exports = router;