const {
    getDbContext,
    closeDbContext,
    getSongFromDatabase,
    putSongInDatabase,
    incrementAccessCount
} = require('../SongDataService');

let db = null;

beforeEach(async () => {
    db = await getDbContext();
})

afterEach(() => {
    if (db) db.close();
    db = null;
})

test('getSongFromDatabase', async () => {
    const gameData = await getSongFromDatabase(db, 'Test-song');
    expect(gameData.name).toBe('Test-song');
    expect(gameData.link).toBe('https://google.com');
    expect(gameData.title).toBe('title');
    expect(gameData.lyrics).toBe('lyrics');
})