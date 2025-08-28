export const INIT_SOLDS_DATA = {
  solds: new Map(),
  next_id: 1,
};

const SAMPLE_SOLD_LIST = {
  1: {
    id: "1",
    stock_id: "111",
    stock_name: "Google",
    stock_symbol: "GOOGL",
    purchased_id: "111",
    purchased_quantity: 2,
    purchased_date: "2023-06-05",
    purchased_time: "14:13",
    purchased_price: 2000,
    sold_date: "2023-06-05",
    sold_time: "14:14",
    sold_price: 2200,
    tag: "stock",
  },
  2: {
    id: "2",
    stock_id: "111",
    stock_name: "Google",
    stock_symbol: "GOOGL",
    purchased_id: "112",
    purchased_quantity: 4,
    purchased_date: "2023-06-03",
    purchased_time: "14:13",
    purchased_price: 2000,
    sold_date: "2023-06-03",
    sold_time: "15:13",
    sold_price: 2500,
    tag: "",
  },
  3: {
    id: "3",
    stock_id: "112",
    stock_name: "Apple",
    purchased_quantity: 6,
    stock_symbol: "AAPL",
    purchased_id: "113",
    purchased_date: "2023-06-05",
    purchased_time: "16:12",
    purchased_price: 2000,
    sold_date: "2023-06-05",
    sold_time: "14:13",
    sold_price: 1800,
    tag: "",
  },
};

export const SAMPLE_SOLDS_DATA = {
  solds: new Map(Object.entries(SAMPLE_SOLD_LIST)),
  next_id: 4,
};
