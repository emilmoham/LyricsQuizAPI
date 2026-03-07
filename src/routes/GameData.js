const router = require('express').Router();
const {
  getSongFromDatabase,
  putSongInDatabase
} = require('../services/SongDataService');
const ApiResponse = require('../models/ApiResponse');
const { getSongFromApi } = require('../services/LrclibService');

router.get('/:id', async (req, res) => {
  const lrclibId = parseInt(req.params.id, 10);

  if (Number.isNaN(lrclibId)) {
    res.status(400).json(ApiResponse.Fail(-1, 'Unable to parse song id'));
    return;
  }

  // First try to load the song from the DB
  const row = await getSongFromDatabase(lrclibId);
  if (row) {
    res.status(200).json(
      ApiResponse.Ok({
        lrclibId: row.lrclib_id,
        title: row.title,
        artist: row.artist,
        lyrics: row.lyrics,
        accessCount: row.accessCount
      })
    );
    return;
  }

  // We didnt get the song from the local DB so query the API
  let gameData;
  try {
    gameData = await getSongFromApi(lrclibId);
  } catch (error) {
    res.status(500).json(ApiResponse.Fail(-3, 'Failed to reach Lrclib API'));
    return;
  }

  if (!gameData) {
    res
      .status(404)
      .json(ApiResponse.Fail(-2, 'Song not found in Lrclib Database'));
    return;
  }

  // Make sure we got a good response
  if (
    gameData.id &&
    gameData.name &&
    gameData.artistName &&
    gameData.plainLyrics.length > 0
  ) {
    // Add the song to the database
    await putSongInDatabase(
      gameData.id,
      gameData.name,
      gameData.artistName,
      gameData.plainLyrics
    );
  }

  res.status(200).json(
    ApiResponse.Ok({
      lrclibId: gameData.id,
      title: gameData.name,
      artist: gameData.artistName,
      lyrics: gameData.plainLyrics,
      accessCount: 1
    })
  );
});

module.exports = router;
