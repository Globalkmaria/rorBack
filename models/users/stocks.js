import mongoose from "mongoose";
import { userConnection } from "../../db/database.js";

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  buy_date: {
    type: Date,
    required: true,
  },
  buy_time: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  buy_price: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});

const StockSchema = new Schema({
  info: {
    name: {
      type: String,
      required: true,
    },
    current_price: {
      type: Number,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
    },
  },
  items: {
    type: Map,
    of: ItemSchema,
    required: true,
  },
});

export const userStocksSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  next_stock_id: {
    type: Number,
    required: true,
  },
  next_item_id: {
    type: Number,
    required: true,
  },
  stocks: {
    type: Map,
    of: StockSchema,
    required: true,
  },
});

const userStocks = userConnection.model("Stock", userStocksSchema);

export default userStocks;