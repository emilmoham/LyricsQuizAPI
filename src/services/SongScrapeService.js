const axios = require('axios');
const requestPromise = require('request-promise');
const cheerio = require('cheerio');
require('dotenv').config();

function extractTitle(fullHTML) {
    const $ = cheerio.load(fullHTML);
    return $('title').text().split('|')[0].trim();
}

function extractLyrics(fullHTML) {
    const $ = cheerio.load(fullHTML);

    let lyrics = $('div.lyrics').text()

        /* genius.org serves two DOMs for its lyrics pages, the below
           scrapes the second style (that does not contain a lyrics div) */

        if(!lyrics){
            $('[class^=Lyrics__Container]').each((i, el) => {
                const html = $(el).html()
                const lined = html.replace(/<br\s*[\/]?>/gi, "\n")
                const stripped = lined.replace(/<[^>]+>/ig, '')
                const trimmed = stripped.trim()
                const final = trimmed + '\n';
                lyrics += final
            })
        }
        if(!lyrics || fullHTML.includes('Lyrics for this song have yet to be')) {
            console.log('Failed to capture lyrics or none present')
            if(fullHTML.includes('Burrr!'))
                console.log('could not find url ', url)
            return null
        }
    return lyrics;
}

async function getSongFromWebpage(title) {
    let scrapelink = `https://genius.com/${title}`;

    if (process.env.DEBUG)
        console.log(scrapelink);

    const gameData = {};
    gameData.link = `https://genius.com/${title}`;
    gameData.title = 'Error Dowloading Lyrics Data';
    gameData.lyrics = '';

    
    const data = await requestPromise({
        url: scrapelink,
        proxy: process.env.PROXY_URL,
        rejectUnauthorized: false,
    });
    
    try {
        gameData.title = extractTitle(data);
        gameData.lyrics = extractLyrics(data);
        
    } catch (e) {
        console.error(e);
    }
    
    return gameData;
}

module.exports = {
    extractTitle,
    extractLyrics,
    getSongFromWebpage
}