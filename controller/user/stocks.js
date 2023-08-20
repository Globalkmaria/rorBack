import userStocks from "../../models/users/stocks.js";
import { keysToSnakeCase } from "../../utils/keysToSnakeCase.js";

export const editUserStock = async (req, res, next) => {
  try {
    const user_id = req.user;
    const stock_id = req.params.stockId;
    const { name, current_price } = keysToSnakeCase(req.body);

    if (!stock_id || (name === undefined && current_price === undefined)) {
      return res.status(400).send();
    }

    const stock = await userStocks.findOneAndUpdate(
      { user_id, [`stocks.${stock_id}`]: { $exists: true } },
      {
        $set: {
          [`stocks.${stock_id}.info.name`]: name,
          [`stocks.${stock_id}.info.current_price`]: current_price,
        },
      },
      { new: true }
    );

    if (!stock) {
      return res.status(404).send({
        message: "There was no matching stock found for the given user.",
      });
    }

    return res.status(200).send();
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).send({
        message: "There was an error with casting.",
        error: err,
      });
    next(err);
  }
};

export const deleteUserStock = async (req, res, next) => {
  try {
    const user_id = req.user;
    const stock_id = req.params.stockId;

    if (stock_id === undefined) {
      return res.status(400).send();
    }

    const result = await userStocks.findOneAndUpdate(
      { user_id, [`stocks.${stock_id}`]: { $exists: true } },
      { $unset: { [`stocks.${stock_id}`]: "" } }
    );

    if (!result) {
      return res.status(404).send();
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const editUserItem = async (req, res, next) => {
  try {
    const user_id = req.user;
    const stock_id = req.params.stockId;

    const item_id = req.params.itemId;
    const { buy_date, buy_time, quantity, buy_price } = keysToSnakeCase(
      req.body
    );

    if (
      !stock_id ||
      !item_id ||
      (buy_date === undefined &&
        buy_time === undefined &&
        quantity === undefined &&
        buy_price === undefined)
    ) {
      return res.status(400).send();
    }

    const stock = await userStocks.findOneAndUpdate(
      {
        user_id,
        [`stocks.${stock_id}`]: { $exists: true },
        [`stocks.${stock_id}.items.${item_id}`]: { $exists: true },
      },
      {
        $set: {
          [`stocks.${stock_id}.items.${item_id}.buy_date`]: buy_date,
          [`stocks.${stock_id}.items.${item_id}.buy_time`]: buy_time,
          [`stocks.${stock_id}.items.${item_id}.quantity`]: quantity,
          [`stocks.${stock_id}.items.${item_id}.buy_price`]: buy_price,
        },
      },
      { new: true }
    );

    if (!stock) {
      return res.status(404).send({
        message: "There was no matching item found for the given user.",
      });
    }

    return res.status(200).send();
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({
        message: "There was an error with casting.",
        error: err,
      });
    next(err);
  }
};

export const deleteUserItem = async (req, res) => {
  const user_id = req.user;
  const stock_id = req.params.stockId;
  const item_id = req.params.itemId;

  if (stock_id === undefined || item_id === undefined) {
    return res.status(400).send();
  }

  await userStocks.findOneAndUpdate(
    { user_id },
    { $unset: { [`stocks.${stock_id}.items.${item_id}`]: "" } }
  );

  res.status(204).send();
};
