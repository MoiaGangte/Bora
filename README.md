# BORA

## Run locally

Install dependencies:

```sh
npm install
```

Create a `.env` file in the project root (you can copy `.env.example`) and set
`MONGODB_URI` to your MongoDB connection string. The example connects to a
MongoDB server running locally. For MongoDB Atlas, use the connection string
from your Atlas cluster instead:

```powershell
Copy-Item .env.example .env
# Edit .env and set MONGODB_URI to your MongoDB connection string.
npm start
```

Open <http://localhost:3000>. The server stores submitted names and scores in
the `highscores` collection in the `bora` database. Set `MONGODB_DB` to use a
different database name and `PORT` to use a different port. The server loads
configuration from `.env`; environment variables already set in the shell take
precedence. Keep `.env` private and never put the MongoDB connection string in
`index.html`.
