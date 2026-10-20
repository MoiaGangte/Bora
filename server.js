require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('node:path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || 'bora';
const publicAssets = new Set(['bg.wav', 'crashing.mp3', 'mmm.mp3']);

if (!mongoUri) {
    throw new Error('MONGODB_URI is missing. Copy .env.example to .env and set its MongoDB connection string.');
}

app.use(express.json({ limit: '1kb' }));

app.get('/', (_request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/:asset', (request, response, next) => {
    if (!publicAssets.has(request.params.asset)) {
        return next();
    }
    response.sendFile(path.join(__dirname, request.params.asset), error => {
        if (error) next(error);
    });
});

const client = new MongoClient(mongoUri);

async function start() {
    await client.connect();
    const database = client.db(databaseName);
    const highScores = database.collection('highscores');
    await highScores.createIndex({ score: -1, createdAt: 1 });

    app.get('/api/highscores', async (_request, response) => {
        try {
            const entries = await highScores
                .find({}, { projection: { _id: 0, name: 1, score: 1 } })
                .sort({ score: -1, createdAt: 1 })
                .limit(3)
                .toArray();
            response.json({ highScores: entries });
        } catch (error) {
            console.error('Failed to fetch high scores:', error);
            response.status(500).json({ error: 'Unable to load high scores' });
        }
    });

    app.post('/api/highscores', async (request, response) => {
        const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
        const score = request.body?.score;
        if (!name || name.length > 16 || !Number.isSafeInteger(score) || score < 0) {
            return response.status(400).json({ error: 'Enter a name (1-16 characters) and a valid score' });
        }

        try {
            await highScores.insertOne({ name, score, createdAt: new Date() });
            response.status(201).json({ name, score });
        } catch (error) {
            console.error('Failed to save high score:', error);
            response.status(500).json({ error: 'Unable to save high score' });
        }
    });

    app.listen(port, () => {
        console.log(`BORA is listening on http://localhost:${port}`);
    });
}

start().catch(async error => {
    console.error('Unable to start BORA:', error);
    await client.close();
    process.exitCode = 1;
});
