# Lyrics Quiz API

This is the API component that supplies lyrics information and song metadata
for my [Lyrics Quiz](https://lyricsquiz.emilmoham.io) website. See my Lyrics
Quiz [repository](https://github.com/emilmoham/LyricsQuiz) for the website
component of this project.

## Environment Requirements

- Node >= 20.10.0

## Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/emilmoham/LyricsQuiz.git

# 2. Install the project dependencies
npm i

# 3. Start the dev server (nodemon)
npm  start
```

By default, the project will bind to port `8011`, and will attempt to cache
game data responses in `Songs.db`. If you would like to override these defaults
you may specify an env file with any of the following keys:

```ini
PORT=8011
SONGS_DB=Songs.db
```
