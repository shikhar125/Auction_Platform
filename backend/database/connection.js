import mongoose from "mongoose";

export const connection = () => {
  const mongoURI = process.env.MONGO_URI || process.env.DATABASE_URL;
  
  if (!mongoURI) {
    console.error("MongoDB connection URI is not defined in environment variables");
    console.log("Please set either MONGO_URI or DATABASE_URL in your .env file");
    return;
  }

  mongoose
    .connect(mongoURI, {
      dbName: "MERN_AUCTION_PLATFORM",
    })
    .then(() => {
      console.log("Connected to database successfully.");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
      console.log("Please check your MongoDB connection and environment variables.");
    });
};
