const path = require('path');
const fs = require('fs');

const {
    extractTitle,
    extractLyrics
} = require('../SongScrapeService');

test('extractTitle', () => {
    fs.readFile(path.resolve(__dirname, './SamplePage.html'), 'utf8', (err, data) => {
        expect(err).toBe(null); 
        expect(data).not.toBe(null);
        let title = extractTitle(data);
        expect(title).toBe('Beyoncé – Hold Up Lyrics')
    });
});

test('extractLyrics', () => {
    fs.readFile(path.resolve(__dirname, './SamplePage.html'), 'utf8', (err, data) => {
        expect(err).toBe(null); 
        expect(data).not.toBe(null);
        let lyrics = extractLyrics(data);
        expect(lyrics.length).toBe(3061);
        expect(lyrics).toContain("[Chorus]\nHold up, they don't love you like I love you\n");
    });
})