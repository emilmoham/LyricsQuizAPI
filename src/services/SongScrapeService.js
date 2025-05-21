/* eslint-disable no-console */

// const requestPromise = require('request-promise');
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
require('dotenv').config();

function extractTitle(fullHTML) {
  const $ = cheerio.load(fullHTML);
  return $('title').text().split('|')[0].trim();
}

function extractLyrics(fullHTML) {
  const $ = cheerio.load(fullHTML);

  let lyrics = $('div.lyrics').text();

  /* genius.org serves two DOMs for its lyrics pages, the below
     scrapes the second style (that does not contain a lyrics div) */

  if (!lyrics) {
    $('[class^=Lyrics__Container]').each((i, el) => {
      // prune any children which have information we dont need
      if (
        el.children.length > 0 &&
        el.children[0]?.attribs?.class.includes('LyricsHeader')
      ) {
        el.children.splice(0, 1);
      }
      const html = $(el).html();
      const lined = html.replace(/<br\s*[/]?>/gi, '\n');
      const stripped = lined.replace(/<[^>]+>/gi, '');
      const trimmed = stripped.trim();
      const final = `${trimmed}\n`;
      lyrics += final;
    });
  }
  if (!lyrics || fullHTML.includes('Lyrics for this song have yet to be')) {
    console.log('Failed to capture lyrics or none present');

    if (fullHTML.includes('Burrr!')) {
      console.log('could not find url');
    }

    return null;
  }
  return lyrics;
}

function getProxySettings() {
  return {
    host: process.env.PROXY_HOST,
    port: process.env.PROXY_PORT,
    auth: {
      username: process.env.PROXY_USER,
      password: process.env.PROXY_PASS
    }
  };
}

function getHttpsAgent() {
  // Required to handle bright data proxy certificate :|
  return new https.Agent({
    rejectUnauthorized: false
  });
}

function getAxiosOptions() {
  const axiosOptions = {
    timeout: 8000
  };

  if (process.env.ENABLE_PROXY === '1') {
    axiosOptions.proxy = getProxySettings();
  }

  if (process.env.IGNORE_CERT === '1') {
    axiosOptions.httpsAgent = getHttpsAgent();
  }

  return axiosOptions;
}

async function getSongFromWebpage(title) {
  const scrapelink = `https://genius.com/${title}`;

  if (process.env.DEBUG) console.log(scrapelink);

  const gameData = {};
  gameData.link = `https://genius.com/${title}`;
  gameData.title = 'Error Dowloading Lyrics Data';
  gameData.lyrics = '';

  try {
    const response = await axios.get(scrapelink, getAxiosOptions());

    const fullHTML = response.data;
    gameData.title = extractTitle(fullHTML);
    gameData.lyrics = extractLyrics(fullHTML);
  } catch (e) {
    console.error(`${scrapelink}-- ${e.message}`);
  }

  return gameData;
}

module.exports = {
  extractTitle,
  extractLyrics,
  getSongFromWebpage
};
