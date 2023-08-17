import userStocks from "../../models/users/stocks.js";

export const deleteUserStock = async (req, res, next) => {
  const user_id = req.user;
  const stock_id = req.params.stockId;

  if (stock_id === undefined) {
    return res.status(400).send();
  }

  await userStocks.findOneAndUpdate(
    { user_id },
    {
      $unset: {
        [`stocks.${stock_id}`]: "",
      },
    }
  );

  res.status(204).send();
};

export const deleteUserItem = async (req, res, next) => {
  const user_id = req.user;
  const stock_id = req.params.stockId;
  const item_id = req.params.itemId;
  console.log(stock_id, item_id);

  if (stock_id === undefined || item_id === undefined) {
    return res.status(400).send();
  }

  await userStocks.findOneAndUpdate(
    { user_id },
    {
      $unset: {
        [`stocks.${stock_id}.items.${item_id}`]: "",
      },
    }
  );

  res.status(204).send();
};
