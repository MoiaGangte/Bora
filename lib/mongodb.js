import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB || 'bora';
const client = mongoUri ? new MongoClient(mongoUri) : null;
let highScoresCollectionPromise;

export function getHighScoresCollection() {
    if (!client) {
        throw new Error('MONGODB_URI is not configured');
    }

    if (!highScoresCollectionPromise) {
        highScoresCollectionPromise = client.connect()
            .then(() => {
                const collection = client.db(databaseName).collection('highscores');
                return collection.createIndex({ score: -1, createdAt: 1 }).then(() => collection);
            })
            .catch(error => {
                highScoresCollectionPromise = undefined;
                throw error;
            });
    }

    return highScoresCollectionPromise;
}
