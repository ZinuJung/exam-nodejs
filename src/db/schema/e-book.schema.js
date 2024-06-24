import mongoose from "mongoose";

export const EbookSchema = new mongoose.Schema({
    name: {
        type: String
    },
    imageUrl: {
        type: String
    },
    authorName: {
        type: String
    },
    desc: {
        type: String
    },
    numPages: {
        type: Number
    },
    releaseDate: {
        type: String
    },
    price: {
        type: Number
    }
});