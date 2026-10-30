# BORA

## Run locally

Make sure `.env` contains `MONGODB_URI` and, optionally, `MONGODB_DB` (defaults
to `bora`). Then run:

```powershell
npm install
npm run dev
```

Open <http://localhost:5173>. This starts the Vite game and the local MongoDB
API. Vite forwards `/api/highscores` to the API server on port 9000. The game
stores submitted ranked scores in the `highscores` collection.

## Deploy to Vercel

Deploy the BORA repository root (the folder containing `package.json` and
`vercel.json`). Vercel is configured to install development dependencies, run
`npm run build`, and publish `dist`. In the Vercel project's Environment
Variables settings, add `MONGODB_URI` and optionally `MONGODB_DB`.
Do not add the MongoDB URI with a `VITE_` prefix; it must stay server-side.

The serverless API is available at `/api/highscores`. Allow the Vercel
deployment to connect to your MongoDB Atlas cluster in its Network Access
settings.
