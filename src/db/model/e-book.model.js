import mongoose from "mongoose";
import { EbookSchema } from "../schema/e-book.schema.js";

export const EbookModel = mongoose.model("Ebook", EbookSchema, "ebook");