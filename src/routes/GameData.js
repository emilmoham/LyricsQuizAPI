const router = require('express').Router();
const {
  getDbContext,
  closeDbContext,
  getSongFromDatabase,
  putSongInDatabase
} = require('../services/SongDataService');
const { getSongFromWebpage } = require('../services/SongScrapeService');

router.get('/:title', async (req, res) => {
  const { title } = req.params;

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

  // We didnt get the song from the DB so try to scrape the data
  const gameData = await getSongFromWebpage(title);
  res.json(gameData);

  // Make sure we got a good response
  if (gameData.title && gameData.link && gameData.lyrics.length > 0) {
    // Add the song to the database
    await putSongInDatabase(
      context,
      title,
      gameData.title,
      gameData.link,
      gameData.lyrics
    );
    await closeDbContext(context);
  }
});

module.exports = router;
