import mongoose from "mongoose";
import { config } from "../config/index.js";

export const connectDb = () => {
  mongoose.connect(
    `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
};
