export const updateStocks = (originalStocks, newStocks) => {
  for (const stockId of Object.keys(newStocks)) {
    const stock = newStocks[stockId];
    const originalStock = originalStocks.stocks.get(stockId);

    if (!originalStock) continue;

    if (stock.info) updateStockInfo(originalStock, stock.info);
    if (stock.items) updateStockItems(originalStock, stock.items);

    originalStocks.stocks.set(stockId, originalStock);
  }
};

const updateStockInfo = (originalStock, newInfo) => {
  originalStock.info = { ...originalStock.info, ...newInfo };
};

const updateStockItems = (originalStock, newItems) => {
  const originalItems = originalStock.items;

  for (const purchasedId of Object.keys(newItems)) {
    const purchasedItem = newItems[purchasedId];
    const originalItem = originalItems.get(purchasedId);

    if (purchasedItem && originalItem) {
      originalItems.set(purchasedId, { ...originalItem, ...purchasedItem });
    }
  }
};
