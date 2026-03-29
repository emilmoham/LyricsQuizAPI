const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const schema = require('./schema');
require('dotenv').config();

const dbName = process.env.SONG_DB ? process.env.SONG_DB : 'Songs.db';

let db = null;

function getSongDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initialize() first.');
  }

  return db;
}

async function initializeSongDb() {
  db = await open({ filename: dbName, driver: sqlite3.Database });

  for (let i = 0; i < schema.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await db.exec(schema[i]);
  }
  return db;
}

module.exports = { initializeSongDb, getSongDb };
