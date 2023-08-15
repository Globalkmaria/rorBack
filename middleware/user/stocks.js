import userStocks from "../../models/users/stocks.js";
import { keysToCamelCase } from "../../utils/toCamelCase.js";
import { filterUserStocksProps, getNewStocksData } from "./utils.js";
import { keysToSnakeCase } from "../../utils/toSnakeCase.js";

const getStocks = async (user_id) => {
  let stocks = await userStocks.findOne({ user_id });

  if (!stocks) {
    stocks = await userStocks.create({
      user_id,
      next_stock_id: 0,
      next_item_id: 0,
      stocks: new Map(),
    });
  }
  return stocks;
};

export const getUserStocks = async (req, res, next) => {
  const user_id = req.user;
  const stocks = await getStocks(user_id);
  req.stocks = keysToCamelCase(filterUserStocksProps(stocks.toJSON()));

  next();
};

export const saveUserStocks = async (req, res, next) => {
  const new_stocks = keysToSnakeCase(req.body.stocks);
  if (!new_stocks) next();

  const user_id = req.user;
  const original_stocks = await getStocks(user_id);
  const { newStocks, next_stock_id, next_item_id } = getNewStocksData(
    new_stocks,
    original_stocks
  );

  await userStocks.findOneAndUpdate(
    { user_id },
    { $set: { ...newStocks, next_stock_id, next_item_id } },
    { new: true, upsert: false }
  );

  next();
};
