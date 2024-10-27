import mongoose from "mongoose";

export async function dbConnect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mayajs");
    console.log("db connected");
  } catch (err) {
    console.log("db connection failed");
  }
}
