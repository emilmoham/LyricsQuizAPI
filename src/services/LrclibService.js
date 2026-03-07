const axios = require('axios');

const lrclibClient = axios.create({
  baseURL: 'https://lrclib.net',
  headers: {
    'User-Agent':
      'LyricsQuizAPI v2.0.0 https://github.com/emilmoham/LyricsQuizAPI'
  }
});

async function getSongById(id) {
  try {
    return (await lrclibClient.get(`/api/get/${id}`)).data;
  } catch (error) {
    if (error.response.status === 404) return null;
    throw error;
  }
}

async function searchByAllFields(query) {
  return lrclibClient.get(`/api/search?q=${query}`);
}

async function searchByArtist(query) {
  return lrclibClient.get(`/api/search?artist_name=${query}`);
}

module.exports = {
  getSongById,
  searchByAllFields,
  searchByArtist
};
