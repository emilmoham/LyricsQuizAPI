const router = require('express').Router();
const ApiResponse = require('../models/ApiResponse');
const { searchByAllFields } = require('../services/LrclibService');

router.get('/IsAlive', async (req, res) => {
  res.json({ message: 'Is Alive' });
});

router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (query === undefined || query.length === 0) {
    res.status(400).json(ApiResponse.Fail(-1, 'Invalid query string'));
    return;
  }

  let response;

  try {
    response = await searchByAllFields(query);
  } catch (error) {
    res.status(500).json(ApiResponse.Fail(-2, 'Failed to reach Lrclib API'));
    return;
  }

  res.status(200).json(ApiResponse.Ok(response.data));
});

module.exports = router;
