const { AsyncDatabase } = require('promised-sqlite3');
const dotenv = require('dotenv');
dotenv.config();

async function getSongFromDatabase(title) {
    const db = await AsyncDatabase.open(process.env.SONG_DB);
    const row =  await db.get(`SELECT link, title, lyrics FROM Song WHERE name=(?)`, [title]);
    await db.close();
    return row;
}

async function putSongInDatabase(name, title, link, lyrics) {
    const db = await AsyncDatabase.open(process.env.SONG_DB);
    const createSongResult = await db.exec(`INSERT INTO SONG (name, title, link, lyrics) VALUES (?, ?, ?, ?)`, [name, title, link, lyrics]);
    await db.exec(`INSERT INTO Metrics (songId) VALUES (?)`, [createSongResult.lastId]);
    await db.close();
}

module.exports = {
    getSongFromDatabase
}