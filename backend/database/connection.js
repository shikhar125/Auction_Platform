import mongoose from "mongoose";

export const connection = async () => {
  const mongoURI = process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!mongoURI) {
    console.error("MongoDB connection URI is not defined in environment variables");
    console.log("Please set either MONGO_URI or DATABASE_URL in your .env file");
    throw new Error("MongoDB URI not defined");
  }

  try {
    await mongoose.connect(mongoURI, {
      // dbName optional if URI already has database
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to database successfully.");
  } catch (err) {
    console.error("❌ Database connection error:", err);
    throw err; // ensure server fails if DB not connected
  }
};
