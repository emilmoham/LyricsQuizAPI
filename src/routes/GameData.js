const router = require('express').Router();
const { 
    getDbContext,
    closeDbContext,
    getSongFromDatabase,
    putSongInDatabase
} = require('../services/SongDataService');
const {
    getSongFromWebpage
} = require('../services/SongScrapeService');

router.get('/:title', async (req, res) => {


    const title = req.params.title;
    
    // First try to load the song from the DB
    const context = await getDbContext();
    const row = await getSongFromDatabase(context, title);
    if (row) {
        res.json({
            link: row.link,
            title: row.title,
            lyrics: row.lyrics
        });
        await closeDbContext(context);
        return;
    }
    await closeDbContext(context);

    // We didnt get the song from the DB so try to scrape the data
    let gameData = await getSongFromWebpage(title);
    res.json(gameData);
});

module.exports = router;