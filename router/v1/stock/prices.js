import express from "express";
import {
  fetchQuotes,
  getResponseData,
  getSearchDate,
  validateSymbols,
} from "./helper.js";

const router = express.Router();

/**
 cachedQuotes: {
  symbol: {
    regularMarketTime: string,
    regularMarketPreviousClose: number,
    regularMarketPrice: number,
  }
 }

 example:
 {
  "AAPL": {
    "regularMarketTime": "2025-08-27",
    "regularMarketPreviousClose": 229.31,
  }
 }
*/

const cachedQuotes = new Map();

router.post("/", async (req, res, next) => {
  try {
    const { symbols } = req.body;

    const { success, message } = validateSymbols(symbols);

    if (!success) {
      return res.status(400).json({
        message,
      });
    }

    const searchDate = getSearchDate();

    const fetchedQuotesResult = await fetchQuotes(
      symbols,
      searchDate,
      cachedQuotes
    );

    if (!fetchedQuotesResult.success) {
      return res.status(400).json({
        message: fetchedQuotesResult.message,
      });
    }

    const { quotes, successSymbols, failedSymbols } = getResponseData(
      fetchedQuotesResult.symbols,
      cachedQuotes
    );

    const response = {
      data: {
        quotes,
        date: searchDate,
      },
      successSymbols,
      failedSymbols,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting stock quotes:", error);

    return res.status(400).json({
      message: "Something went wrong while getting stock quotes",
    });
  }
});

export default router;
