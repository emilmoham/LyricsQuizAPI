const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();
const { rateLimit } = require('express-rate-limit')

const getGameData = require('./getGameData');

const port = process.env.PORT ?? 8011;

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const allowedOrigns = [
  'https://lyricsquiz.emilmoham.io',
  'http://localhost:3000'
]

const app = express();
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigns.includes(origin) || origin === undefined)
      callback(null, true);
    else
      callback(new Error('Not allowed by CORS'));
  }
}));

app.get('/', async function(req, res) {
  res.json('v1')
});

app.get('/getGameData/:title', async function (req, res, next) {
    const title = req.params.title;

    const gameData = await getGameData(title, process.env.PROXY_API_KEY);

    res.json(gameData);
  })

app.listen(port, function () {
    console.log(`CORS-enabled web server listening on port ${port}`)
  });