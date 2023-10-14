const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();
const { rateLimit } = require('express-rate-limit')

const getGameData = require('./getGameData');

const port = process.env.PORT;

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
    if (allowedOrigns.includes(origin))
      callback(null, true);
    else
      callback(new Error('Not allowed by CORS'));
  }
}));

app.get('/getGameData/:title', async function (req, res, next) {
    const title = req.params.title;

    const gameData = await getGameData(title);

    res.json(gameData);
  })

app.listen(port, function () {
    console.log(`CORS-enabled web server listening on port ${port}`)
  });