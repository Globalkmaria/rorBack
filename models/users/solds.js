import mongoose from "mongoose";
import { userConnection } from "../../db/database.js";

const Schema = mongoose.Schema;

const soldSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    stock_id: {
      type: String,
      required: true,
    },
    stock_name: {
      type: String,
      required: true,
    },
    purchased_id: {
      type: String,
      required: true,
    },
    purchased_quantity: {
      type: Number,
      required: true,
    },
    purchased_date: {
      type: Date,
      required: true,
    },
    purchased_time: {
      type: String,
      required: true,
    },
    purchased_price: {
      type: Number,
      required: true,
    },
    sold_date: {
      type: Date,
      required: true,
    },
    sold_time: {
      type: String,
      required: true,
    },
    sold_price: {
      type: Number,
      required: true,
    },
    created_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

const userSoldSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    solds: {
      type: Map,
      of: soldSchema,
      required: true,
    },
    next_id: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const userSolds = userConnection.model("Sold", userSoldSchema);

export default userSolds;
