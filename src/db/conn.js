import mongoose from "mongoose";
import { MONGO_URL } from "../config.js";

export const connectMongoDB = () => {
    mongoose.connect(MONGO_URL).then(() => {
        console.log(">>> Connected to MongoDB");
    })
    .catch((err) => {
        console.error(">>> Failed to connect to MongoDB", err);
    });
};