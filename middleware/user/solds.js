import { SAMPLE_SOLDS_DATA } from "../../data/solds.js";
import userSolds from "../../models/users/solds.js";
import userStocks from "../../models/users/stocks.js";
import { keysToCamelCase } from "../../utils/keysToCamelCase.js";
import { keysToSnakeCase } from "../../utils/keysToSnakeCase.js";
import {
  filterUserSoldsProps,
  getNewSold,
  getNewSoldsData,
  getPurchasedItemsToDelete,
  getSolds,
  getStocks,
} from "./utils.js";

export const getUserSolds = async (req, res, next) => {
  try {
    const user_id = req.user;
    const solds = await getSolds(user_id);
    req.solds = keysToCamelCase(filterUserSoldsProps(solds.toJSON()));

    next();
  } catch (err) {
    next(err);
  }
};

export const saveUserSolds = async (req, res, next) => {
  try {
    const new_solds = keysToSnakeCase(req.body.solds);
    if (!new_solds) next();

    const user_id = req.user;
    const solds = await getSolds(user_id);

    const { new_sold_items, new_next_id } = getNewSoldsData(
      new_solds,
      solds.next_id
    );

    await userSolds.findOneAndUpdate(
      { user_id },
      { $set: { ...new_sold_items, next_id: new_next_id } },
      { new: true, upsert: false }
    );

    next();
  } catch (err) {
    next(err);
  }
};

export const replaceUserSolds = async (req, res, next) => {
  try {
    const { solds, next_id } = keysToSnakeCase(req.body.solds);
    if (!solds) next();

    const user_id = req.user;
    const original_solds = await getSolds(user_id);

    original_solds.solds.clear();

    Object.keys(solds).forEach((sold_id) => {
      original_solds.set(`solds.${sold_id}`, solds[sold_id]);
    });
    original_solds.set("next_id", next_id);

    await original_solds.validate();

    req.solds = original_solds;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const addUserSoldsSample = async (req, res, next) => {
  try {
    const user_id = req.user;
    const original_solds = await getSolds(user_id);
    original_solds.set("solds", SAMPLE_SOLDS_DATA.solds);

    await original_solds.save();
    next();
  } catch (error) {
    next(error);
  }
};

export const addNewSolds = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { solds, date, time } = keysToSnakeCase(req.body);
    const { next_id } = await getSolds(user_id);

    const { new_solds, new_next_id } = solds.reduce(
      (acc, sold) => {
        const new_sold = getNewSold(sold, date, time, acc.new_next_id);
        acc.new_solds[`solds.${new_sold.id}`] = new_sold;
        acc.new_next_id++;
        return acc;
      },
      { new_solds: {}, new_next_id: next_id }
    );

    await userSolds.findOneAndUpdate(
      { user_id },
      {
        $set: { ...new_solds, next_id: new_next_id },
      },
      { upsert: false }
    );

    const purchasedItemsToDelete = getPurchasedItemsToDelete(solds);
    await userStocks.findOneAndUpdate(
      { user_id },
      { $unset: { ...purchasedItemsToDelete } }
    );

    const stocks = await getStocks(user_id);

    if (stocks.stocks.get(solds[0].stock_id)?.items.size === 0) {
      const { stock_id } = solds[0];

      await userStocks.findOneAndUpdate(
        { user_id },
        { $unset: { [`stocks.${stock_id}`]: "" } }
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
