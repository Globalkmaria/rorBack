import yahooFinance from "yahoo-finance2";
import dayjs from "dayjs";
import { formatDate } from "../../../utils/date.js";

import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchQuotes = async (symbols, searchDate, cachedQuotes) => {
  const cleanSymbols = trimSymbols(symbols);

  const newSymbols = [];

  for (const symbol of cleanSymbols) {
    const quote = cachedQuotes.get(symbol);
    if (quote?.regularMarketTime === searchDate) {
      continue;
    }
    newSymbols.push(symbol);
  }

  const quotes = await yahooFinance.quote(newSymbols, {
    fields: [
      "regularMarketPreviousClose",
      "regularMarketTime",
      "displayName",
      "symbol",
      "longName",
    ],
  });

  for (const quote of quotes) {
    cachedQuotes.set(quote.symbol, {
      ...quote,
      regularMarketTime: formatDate(quote.regularMarketTime),
    });
  }

  return cleanSymbols;
};

export const getResponseData = (symbols, cachedQuotes) => {
  const data = [];
  const successSymbols = [];
  const failedSymbols = [];

  for (const symbol of symbols) {
    const quote = cachedQuotes.get(symbol);
    if (quote?.regularMarketPreviousClose) {
      successSymbols.push(symbol);
      data.push(quote);
    } else {
      failedSymbols.push(symbol);
    }
  }

  const formattedQuotes = formatQuotes(data);

  return {
    quotes: formattedQuotes,
    successSymbols,
    failedSymbols,
  };
};

export const getSearchDate = () => {
  const currentDate = dayjs().tz("America/New_York");

  const searchDate = formatDate(
    dayjs(currentDate).hour() < 20
      ? dayjs(currentDate).subtract(1, "day")
      : dayjs(currentDate)
  );

  return searchDate;
};

export const validateSymbols = (symbols) => {
  if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
    return {
      message:
        "Invalid input. Please provide an array of stock symbols. example: { symbols: ['AAPL', 'GOOGL', 'MSFT'] }",
      success: false,
    };
  }

  const invalidSymbols = symbols.filter(
    (symbol) => !/^[A-Z0-9]+$/.test(symbol) || symbol.trim().length > 10
  );

  if (invalidSymbols.length > 0) {
    return {
      message:
        "Invalid symbol format. Please check the symbols. example: { symbols: ['AAPL', 'GOOGL', 'MSFT'] }",
      success: false,
    };
  }

  return { success: true };
};

export const trimSymbols = (symbols) => {
  return symbols.map((symbol) => symbol.trim().toUpperCase());
};

export const formatQuotes = (quotes) => {
  const stockPrices = quotes.map((quote) => ({
    symbol: quote.symbol,
    name: quote.longName,
    displayName: quote.displayName,
    previousClosePrice: quote.regularMarketPreviousClose,
  }));

  return stockPrices;
};
