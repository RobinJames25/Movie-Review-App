// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("sample_mflix");

// Find a document in a collection.
db.movies.find({ _id: ObjectId("573a1390f29313caabcd6223") }).pretty()
