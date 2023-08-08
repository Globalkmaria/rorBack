import mongoose from "mongoose";
import { config } from "../config/index.js";

export const connectDb = () => {
  mongoose.connect(`${config.db.url}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
