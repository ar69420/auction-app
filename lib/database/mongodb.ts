import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const options = {};

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI is missing in .env.local!");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

// Prevent multiple instances in development mode
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export default clientPromise;
