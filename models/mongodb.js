import mongoose from "mongoose";

const MONGODB_URL = process.env.DB_URL;

if (!MONGODB_URL) {
  throw new Error("Please define the MONGODB_URL environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connect = async () => {
  if (cached.conn) {
    console.log("✅ MongoDB connection reused");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // dbName: "chanane",
      bufferCommands: false,
      connectTimeoutMS: 30000,
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected successfully");
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
};
