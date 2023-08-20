export const INIT_STOCKS_DATA = {
  stocks: {},
  next_stock_id: 0,
  next_item_id: 0,
};

export const SAMPLE_STOCKS_DATA = {
  stocks: {
    1: {
      info: {
        id: "1",
        name: "Google",
        current_price: 3400,
      },
      items: {
        2: {
          id: "2",
          buy_date: "2023-01-01T00:00:00.000+0000",
          buy_time: "09:57",
          quantity: 2,
          buy_price: 1800,
        },
        9: {
          id: "9",
          buy_date: "2023-06-05T00:00:00.000+0000",
          buy_time: "14:13",
          quantity: 2,
          buy_price: 2000,
        },
      },
    },
    2: {
      info: {
        id: "2",
        name: "Apple",
        current_price: 2000,
      },
      items: {
        3: {
          id: "3",
          buy_date: "2023-05-26T00:00:00.000+0000",
          buy_time: "13:01",
          quantity: 1,
          buy_price: 1000,
        },
        4: {
          id: "4",
          buy_date: "2023-04-24T00:00:00.000+0000",
          buy_time: "15:02",
          quantity: 7,
          buy_price: 1000,
        },
      },
    },
    3: {
      info: {
        id: "3",
        name: "Tesla",
        current_price: 100,
      },
      items: {
        6: {
          id: "6",
          buy_date: "2023-06-04T00:00:00.000+0000",
          buy_time: "11:18",
          quantity: 13,
          buy_price: 90,
        },
        13: {
          id: "13",
          buy_date: "2023-06-07T00:00:00.000+0000",
          buy_time: "15:26",
          quantity: 3,
          buy_price: 85,
        },
      },
    },
    4: {
      info: {
        id: "4",
        name: "MS",
        current_price: 4000,
      },
      items: {
        10: {
          id: "10",
          buy_date: "2023-06-05T00:00:00.000+0000",
          buy_time: "14:15",
          quantity: 1,
          buy_price: 3400,
        },
        14: {
          id: "14",
          buy_date: "2023-06-07T00:00:00.000+0000",
          buy_time: "15:26",
          quantity: 2,
          buy_price: 4300,
        },
      },
    },
  },
  next_stock_id: 5,
  next_item_id: 15,
};
