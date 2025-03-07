import mongodb from "mongodb";

const { ObjectId } = mongodb; // Destructure ObjectId properly
let reviews;

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) return;

        try {
            const db = conn.db(process.env.MOVIEREVIEWS_NS);
            reviews = db.collection("reviews");

            // Ensure collection exists by inserting a dummy document if empty
            const count = await reviews.countDocuments();
            if (count === 0) {
                await reviews.insertOne({ message: "Initializing collection" });
                console.log("'reviews' collection created automatically!");
            }
        } catch (e) {
            console.error(`Unable to establish connection in ReviewsDAO: ${e}`);
        }
    }

    static async addReview(movieId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                movie_id: new ObjectId(movieId.trim()),
            };
            return await reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return { error: e };
        }
    }

    static async updateReview(reviewId, userId, review, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, _id: new ObjectId(reviewId) }, // ✅ FIX
                { $set: { review: review, date: date } }
            );
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update review: ${e}`);
            return { error: e };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId),
                user_id: userId,
            });
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e };
        }
    }
}
