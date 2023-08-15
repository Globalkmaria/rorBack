import { removeProperties } from "../../utils/removeProperties.js";

const NOT_USED_USER_STOCKS_PROPERTY = [
  "__v",
  "next_stock_id",
  "next_item_id",
  "user_id",
];

export const filterUserStocksProps = (userStocks) => {
  return removeProperties(userStocks, NOT_USED_USER_STOCKS_PROPERTY);
};

const NOT_USED_USER_GROUPS_PROPERTY = ["__v", "next_group_id", "user_id"];

export const filterUserGroupsProps = (userStocks) => {
  return removeProperties(userStocks, NOT_USED_USER_GROUPS_PROPERTY);
};

export const getNewStocksData = (new_stocks, original_stocks) => {
  let next_stock_id = original_stocks.next_stock_id;
  let next_item_id = original_stocks.next_item_id;

  const newStocks = {};

  for (const stockId in new_stocks) {
    const stock = new_stocks[stockId];

    for (const itemId in stock.items) {
      stock.items[itemId].id = next_item_id;
      stock.items[next_item_id] = stock.items[itemId];
      delete stock.items[itemId];

      next_item_id++;
    }

    stock.info.id = next_stock_id;
    newStocks[`stocks.${next_stock_id++}`] = stock;
  }
  return { newStocks, next_stock_id, next_item_id };
};

export const getNewGroupsData = (new_groups, original_groups) => {
  let next_group_id = original_groups.next_group_id;
  const newGroups = {};

  for (const groupId in new_groups) {
    new_groups[groupId].id = next_group_id;
    newGroups[`groups.${next_group_id}`] = new_groups[groupId];

    next_group_id++;
  }
  return { newGroups, next_group_id };
};
