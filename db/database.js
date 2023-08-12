import mongoose from "mongoose";
import { config } from "../config/index.js";

export const constConnection = mongoose.createConnection(config.db.constDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const userConnection = mongoose.createConnection(config.db.userDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
