const router = require('express').Router();
const { getSongFromDatabase } = require('../services/SongDataService');

router.get('/:title', async (req, res) => {
    const row = await getSongFromDatabase(req.params.title);
    if (row) res.json(row);
    
});

module.exports = router;