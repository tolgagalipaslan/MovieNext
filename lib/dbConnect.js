import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

async function dbConnect() {
  try {
    await mongoose.connect(MONGODB_URI);
    mongoose.set("strictQuery", false);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error.message);
  }
}

export default dbConnect;
