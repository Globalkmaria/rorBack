import userStocks from "../../models/users/stocks.js";
import { keysToCamelCase } from "../../utils/keysToCamelCase.js";
import {
  filterUserStocksProps,
  getNewItem,
  getNewStock,
  getNewStocksData,
  getStocks,
} from "./utils.js";
import { keysToSnakeCase } from "../../utils/keysToSnakeCase.js";
import { SAMPLE_STOCKS_DATA } from "../../data/stocks.js";

export const getUserStocks = async (req, res, next) => {
  try {
    const user_id = req.user;
    const stocks = await getStocks(user_id);
    req.stocks = keysToCamelCase(filterUserStocksProps(stocks.toJSON()));

    next();
  } catch (err) {
    next(err);
  }
};

export const saveUserStocks = async (req, res, next) => {
  try {
    const new_stocks = keysToSnakeCase(req.body.stocks);
    if (!new_stocks) next();

    const user_id = req.user;
    const original_stocks = await getStocks(user_id);
    const { newStocks, next_stock_id, next_item_id, oldAndNewIdMap } =
      getNewStocksData(
        new_stocks,
        original_stocks.next_stock_id,
        original_stocks.next_item_id
      );

    req.stockOldAndNewIdMap = oldAndNewIdMap;
    await userStocks.findOneAndUpdate(
      { user_id },
      { $set: { ...newStocks, next_stock_id, next_item_id } },
      { new: true, upsert: false }
    );

    next();
  } catch (err) {
    next(err);
  }
};

export const replaceUserStocks = async (req, res, next) => {
  try {
    const { stocks, next_stock_id, next_item_id } = keysToSnakeCase(
      req.body.stocks
    );
    if (!stocks) next();

    const user_id = req.user;
    const original_stocks = await getStocks(user_id);

    original_stocks.stocks.clear();

    for (const stockId in stocks) {
      original_stocks.set(`stocks.${stockId}`, stocks[stockId]);
    }
    original_stocks.set("next_stock_id", next_stock_id);
    original_stocks.set("next_item_id", next_item_id);

    await original_stocks.validate();

    req.stocks = original_stocks;

    return next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const addNewStock = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { date, time } = req.body;
    const original_stocks = await getStocks(user_id);
    const newStock = getNewStock(
      original_stocks.next_stock_id,
      original_stocks.next_item_id,
      date,
      time
    );

    await userStocks.findOneAndUpdate(
      { user_id },
      {
        $set: {
          [`stocks.${original_stocks.next_stock_id}`]: newStock,
          next_stock_id: original_stocks.next_stock_id + 1,
          next_item_id: original_stocks.next_item_id + 1,
        },
      },
      { upsert: false }
    );

    req.stocks = {
      stock_id: original_stocks.next_stock_id,
      item_id: original_stocks.next_item_id,
    };

    next();
  } catch (err) {
    next(err);
  }
};

export const addNewItem = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { date, time } = req.body;
    const stock_id = req.params.stockId;
    const { next_item_id } = await getStocks(user_id);
    const newStock = getNewItem(next_item_id, date, time);

    await userStocks.findOneAndUpdate(
      { user_id },
      {
        $set: {
          [`stocks.${stock_id}.items.${next_item_id}`]: newStock,
          next_item_id: next_item_id + 1,
        },
      },
      { upsert: false }
    );

    req.stocks = {
      stock_id,
      item_id: next_item_id,
    };

    next();
  } catch (err) {
    next(err);
  }
};

export const addUserStockSample = async (req, res, next) => {
  try {
    const user_id = req.user;
    const original_stocks = await getStocks(user_id);

    original_stocks.set("stocks", SAMPLE_STOCKS_DATA.stocks);
    original_stocks.set("next_stock_id", SAMPLE_STOCKS_DATA.next_stock_id);
    original_stocks.set("next_item_id", SAMPLE_STOCKS_DATA.next_item_id);

    await original_stocks.save();
    next();
  } catch (error) {
    next(error);
  }
};
