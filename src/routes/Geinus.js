/* eslint-disable camelcase */
const router = require('express').Router();
const axios = require('axios');
require('dotenv').config();

const token = process.env.GENIUS_API_TOKEN;

const config = {
  headers: { Authorization: `Bearer ${token}` }
};

router.get('/search', async (req, res) => {
  console.log(req.query.q);

  const response = await axios.get(
    `https://api.genius.com/search?q=${req.query.q}`,
    config
  );

  res.json(response.data);

  // const { status } = response.data.meta;
  // if (status !== 200) {
  //   console.log(status);
  //   return [];
  // }

  // const { hits } = response.data.response;

  // const artists = new Set(
  //   hits.map((hit) => {
  //     return hit.result.primary_artist.name;
  //   })
  // );

  // res.json([...artists]);
});

router.get('/search/artist', async (req, res) => {
  const response = await axios.get(
    `https://genius.com/api/search/artist?q=${req.query.q}`
  );

  res.json(response.data);
});

router.get('/artist/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  let results = [];
  let page = 1;

  while (page !== null) {
    // eslint-disable-next-line no-await-in-loop
    const response = await axios.get(
      `https://api.genius.com/artists/${id}/songs?per_page=50&page=${page}`,
      config
    );

    const { status } = response.data.meta;

    if (status !== 200) {
      res.json(response.data);
      return;
    }

    const { songs, next_page } = response.data.response;

    results = [...results, ...songs];
    page = next_page;
  }

  // Reduce the results set
  results = results.filter((result) => {
    return (
      result.primary_artist.id === id &&
      !result.full_title.toLowerCase().includes('remix') &&
      !result.title.endsWith('*')
    );
  });

  res.json(results);
});

module.exports = router;
