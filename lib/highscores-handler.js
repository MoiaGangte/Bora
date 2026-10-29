import { getHighScoresCollection } from './mongodb.js';

export default async function handleHighScores(request, response) {
    if (request.method === 'GET') {
        try {
            const highScores = await (await getHighScoresCollection())
                .find({}, { projection: { _id: 0, name: 1, score: 1 } })
                .sort({ score: -1, createdAt: 1 })
                .limit(3)
                .toArray();
            return response.status(200).json({ highScores });
        } catch (error) {
            console.error('Failed to fetch high scores:', error.message);
            return response.status(500).json({ error: 'Unable to load high scores' });
        }
    }

    if (request.method === 'POST') {
        const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
        const score = request.body?.score;
        if (!name || name.length > 16 || !Number.isSafeInteger(score) || score < 0) {
            return response.status(400).json({ error: 'Enter a name (1-16 characters) and a valid score' });
        }

        try {
            await (await getHighScoresCollection()).insertOne({
                name,
                score,
                createdAt: new Date(),
            });
            return response.status(201).json({ name, score });
        } catch (error) {
            console.error('Failed to save high score:', error.message);
            return response.status(500).json({ error: 'Unable to save high score' });
        }
    }

    response.setHeader('Allow', 'GET, POST');
    return response.status(405).json({ error: 'Method not allowed' });
}
