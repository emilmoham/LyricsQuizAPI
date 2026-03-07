const { getSongDb } = require('../database/songDb');
require('dotenv').config();

async function incrementAccessCount(row) {
  const context = getSongDb();
  if (row.access_count && row.name)
    await context.run(`UPDATE Song SET access_count=(?) WHERE name=(?)`, [
      row.access_count + 1,
      row.name
    ]);
}

async function getSongFromDatabase(lrclibId) {
  const context = getSongDb();
  const row = await context.get(
    `SELECT lrclib_id, title, artist, lyrics, access_count FROM Song WHERE lrclib_id=(?)`,
    [lrclibId]
  );
  if (row) await incrementAccessCount(row);
  return row;
}

async function putSongInDatabase(lrclibId, title, artist, lyrics) {
  const context = getSongDb();
  if (await getSongFromDatabase(lrclibId)) return;
  await context.run(
    `INSERT INTO Song (lrclib_id, title, artist, lyrics, access_count) VALUES (?, ?, ?, ?, ?)`,
    [lrclibId, title, artist, lyrics, 1]
  );
}

module.exports = {
  getSongFromDatabase,
  putSongInDatabase,
  incrementAccessCount
};
