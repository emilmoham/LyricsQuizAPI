const router = require('express').Router();
const { getDbContext, closeDbContext, getSongFromDatabase } = require('../services/SongDataService');

router.get('/:title', async (req, res) => {
    const context = await getDbContext();
    const row = await getSongFromDatabase(context, req.params.title);
    if (row) {
        res.json({
            link: row.link,
            title: row.title,
            lyrics: row.lyrics
        });
        await closeDbContext(context);
    }
});

module.exports = router;