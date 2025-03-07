import app from './server.js';
import mongodb from "mongodb";
import dotenv from 'dotenv';
import MoviesDAO from './dao/moviesDAO.js';
import ReviewsDAO from './dao/reviewsDAO.js';

dotenv.config();

const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI);
const port = process.env.PORT || 8000;

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        await MoviesDAO.injectDB(client)
        await ReviewsDAO.injectDB(client)

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });

    } catch (e) {
        console.error("Error connecting to MongoDB:", e);
        process.exit(1);
    }
}

main();
