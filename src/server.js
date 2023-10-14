const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const getGameData = require('./getGameData');

const port = 8001;

const app = express();

app.use(helmet());
app.use(cors());

app.get('/getGameData/:title', async function (req, res, next) {
    const title = req.params.title;

    const gameData = await getGameData(title);

    res.json(gameData);
  })

app.listen(port, function () {
    console.log(`CORS-enabled web server listening on port ${port}`)
  });