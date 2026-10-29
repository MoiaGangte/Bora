import 'dotenv/config';
import express from 'express';
import handleHighScores from './lib/highscores-handler.js';

const app = express();
const port = Number(process.env.PORT) || 9000;

app.use(express.json({ limit: '1kb' }));
app.all('/api/highscores', handleHighScores);

app.listen(port, '127.0.0.1', () => {
    console.log(`BORA API listening on http://127.0.0.1:${port}`);
});
