const sqlite3 = require('sqlite3');
const { open } = require('sqlite')
const path = require('path');
require('dotenv').config();

async function getDbContext() {
    const db = await open({
        filename: process.env.SONG_DB,
        driver: sqlite3.Database
    })
    return db;
}

async function closeDbContext(context) {
    return await context.close();
}

async function getSongFromDatabase(context, title) {
    const row =  await context.get(`SELECT name, link, title, lyrics, access_count FROM Song WHERE name=(?)`, [title]);
    if (row) await incrementAccessCount(context, row)
    return row;
}

async function putSongInDatabase(context, name, title, link, lyrics) {
    const createSongResult = await context.exec(`INSERT INTO SONG (name, title, link, lyrics) VALUES (?, ?, ?, ?)`, [name, title, link, lyrics]);
}

async function incrementAccessCount(context, row) {
    if (row.access_count && row.name)
        await context.run(`UPDATE Song SET access_count=(?) WHERE name=(?)`, [row.access_count + 1, row.name]);
}

module.exports = {
    getDbContext,
    closeDbContext,
    getSongFromDatabase,
    putSongInDatabase,
    incrementAccessCount
}