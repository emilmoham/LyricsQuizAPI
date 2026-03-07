module.exports = [
  `CREATE TABLE IF NOT EXISTS Song (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lrclib_id INTEGER UNIQUE NOT NULL,
    title TEXT,
    artist TEXT,
    lyrics TEXT,
    access_count INTEGER DEFAULT 0
  )
  `
];
