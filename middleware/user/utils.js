import { INIT_SOLDS_DATA } from "../../data/solds.js";
import userGroups from "../../models/users/groups.js";
import userSolds from "../../models/users/solds.js";
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

export const getNewStocksData = (new_stocks, original_stocks) => {
  let next_stock_id = original_stocks.next_stock_id;
  let next_item_id = original_stocks.next_item_id;

  const oldAndNewIdMap = {
    stocks: {},
    items: {},
  };

  const newStocks = {};

  for (const stockId of Object.keys(new_stocks.stocks)) {
    const stock = new_stocks.stocks[stockId];

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

  const new_tags = [...new Set([...original_stocks.tags, ...new_stocks.tags])];

  return {
    newStocks,
    next_stock_id,
    next_item_id,
    oldAndNewIdMap,
    tags: new_tags,
  };
};

const NOT_USED_USER_SOLDS_PROPERTY = ["__v", "user_id"];
export const filterUserSoldsProps = (userSolds) => {
  return removeProperties(userSolds, NOT_USED_USER_SOLDS_PROPERTY);
};

export const getNewSoldsData = (new_solds, next_id) => {
  let new_next_id = next_id;
  const new_sold_items = Object.keys(new_solds?.solds).reduce((acc, key) => {
    acc[`solds.${new_next_id}`] = {
      ...new_solds.solds[key],
      id: new_next_id++,
    };
    return acc;
  }, {});

  return {
    new_sold_items,
    new_next_id,
  };
};

export const getPurchasedItemsToDelete = (new_solds) => {
  const items = {};

  for (const sold of new_solds) {
    const { stock_id, purchased_id } = sold;
    items[`stocks.${stock_id}.items.${purchased_id}`] = "";
  }

  return items;
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
      tag: "",
      current_price: 0,
      created_at: new Date(),
    },
    items: {
      [next_item_id]: getNewItem(next_item_id, date, time),
    },
  };
};

export const getNewSold = (soldInfo, date = new Date(), time = "00:00", id) => {
  return {
    id,
    stock_name: soldInfo.stock_name,
    stock_id: soldInfo.stock_id,
    purchased_id: soldInfo.purchased_id,
    purchased_quantity: soldInfo.purchased_quantity,
    purchased_date: soldInfo.purchased_date,
    purchased_time: soldInfo.purchased_time,
    purchased_price: soldInfo.purchased_price,
    sold_date: date,
    sold_time: time,
    sold_price: soldInfo.sold_price,
    tag: soldInfo.tag,
    created_at: new Date(),
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
      tags: [],
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

export const getSolds = async (user_id) => {
  let solds = await userSolds.findOne({ user_id });

  if (!solds) {
    solds = await userSolds.create({
      user_id,
      ...INIT_SOLDS_DATA,
    });
  }

  return solds;
};
