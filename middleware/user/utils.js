import userGroups from "../../models/users/groups.js";
import userStocks from "../../models/users/stocks.js";
import { removeProperties } from "../../utils/removeProperties.js";

const NOT_USED_USER_STOCKS_PROPERTY = ["__v", "user_id"];

export const filterUserStocksProps = (userStocks) => {
  return removeProperties(userStocks, NOT_USED_USER_STOCKS_PROPERTY);
};

const NOT_USED_USER_GROUPS_PROPERTY = ["__v", "user_id"];

export const filterUserGroupsProps = (userStocks) => {
  return removeProperties(userStocks, NOT_USED_USER_GROUPS_PROPERTY);
};

export const getNewStocksData = (
  new_stocks,
  original_next_stock_id,
  original_next_item_id
) => {
  let next_stock_id = original_next_stock_id;
  let next_item_id = original_next_item_id;

  const oldAndNewIdMap = {
    stocks: {},
    items: {},
  };

  const newStocks = {};

  for (const stockId in new_stocks) {
    const stock = new_stocks[stockId];

    for (const itemId in stock.items) {
      stock.items[itemId].id = next_item_id;
      stock.items[next_item_id] = stock.items[itemId];
      delete stock.items[itemId];
      oldAndNewIdMap.items[itemId] = next_item_id;
      next_item_id++;
    }

    stock.info.id = next_stock_id;
    oldAndNewIdMap.stocks[stockId] = next_stock_id;
    newStocks[`stocks.${next_stock_id++}`] = stock;
  }
  return { newStocks, next_stock_id, next_item_id, oldAndNewIdMap };
};

export const getNewGroupsData = (
  new_groups,
  original_next_group_id,
  stockOldAndNewIdMap
) => {
  let next_group_id = original_next_group_id;
  const newGroups = {};
  for (const groupId in new_groups) {
    new_groups[groupId].id = next_group_id;
    const newStocks = {};
    for (const stockId in new_groups[groupId].stocks) {
      const newItems = new_groups[groupId].stocks[stockId].map(
        (id) => stockOldAndNewIdMap.items[id]
      );
      newStocks[stockOldAndNewIdMap.stocks[stockId]] = newItems;
    }
    new_groups[groupId].stocks = newStocks;
    newGroups[`groups.${next_group_id}`] = new_groups[groupId];

    next_group_id++;
  }
  return { newGroups, next_group_id };
};

export const getNewItem = (next_item_id, date = new Date(), time = "00:00") => {
  return {
    id: next_item_id,
    buy_date: new Date(date),
    buy_time: time,
    quantity: 0,
    buy_price: 0,
    created_at: new Date(),
  };
};

export const getNewStock = (next_stock_id, next_item_id, date, time) => {
  return {
    info: {
      id: next_stock_id,
      name: "",
      current_price: 0,
      created_at: new Date(),
    },
    items: {
      [next_item_id]: getNewItem(next_item_id, date, time),
    },
  };
};

export const getStocks = async (user_id) => {
  let stocks = await userStocks.findOne({ user_id });
  if (!stocks) {
    stocks = await userStocks.create({
      user_id,
      next_stock_id: 1,
      next_item_id: 1,
      stocks: new Map(),
    });
  }
  return stocks;
};

export const getGroups = async (user_id) => {
  let groups = await userGroups.findOne({ user_id });

  if (!groups) {
    groups = await userGroups.create({
      user_id,
      next_group_id: 2,
      groups: new Map(),
    });
  }

  return groups;
};
