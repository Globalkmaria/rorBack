import mongoose from "mongoose";
import { userConnection } from "../../db/database.js";

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
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
    },
  },
  { timestamps: true }
);

const StockSchema = new Schema(
  {
    info: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      current_price: {
        type: Number,
        required: true,
      },
      created_at: {
        type: Date,
      },
      tag: {
        type: String,
        required: true,
      },
    },
    items: {
      type: Map,
      of: ItemSchema,
      required: true,
    },
  },
  { timestamps: true }
);

export const userStocksSchema = new Schema(
  {
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
    tags: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const userStocks = userConnection.model("Stock", userStocksSchema);

export default userStocks;
