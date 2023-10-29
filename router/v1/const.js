import express from "express";
import mongoose from "mongoose";
import { constConnection } from "../../db/database.js";

const router = express.Router();

const topStockSchema = new mongoose.Schema({
  rank: Number,
  name: String,
  symbol: String,
  description: String,
  industry: String,
  sector: String,
  financial: {
    market_cap: String,
    revenue: String,
    gross_profit: String,
    operating_income: String,
  },
  ratios: {
    per: Number,
    pbr: Number,
    roa: Number,
  },
  img: {
    url: String,
    webp: String,
    webp_300: String,
    webp_400: String,
    jpg: String,
  },

  invest_url: String,
});

const Stock = constConnection.model("Stock", topStockSchema);

router.get("/top-stocks", async (req, res, next) => {
  try {
    const stocks = await Stock.aggregate([
      {
        $project: {
          id: "$_id",
          rank: 1,
          name: 1,
          symbol: 1,
          description: 1,
          industry: 1,
          sector: 1,
          financial: {
            marketCap: "$financial.market_cap",
            revenue: 1,
            grossProfit: "$financial.gross_profit",
            operatingIncome: "$financial.operating_income",
          },
          ratios: {
            per: 1,
            pbr: 1,
            roa: 1,
          },
          imgUrl: "$img_url",
          img: {
            url: "$img.url",
            webp: "$img.webp",
            webp300: "$img.webp_300",
            webp400: "$img.webp_400",
            jpg: "$img.jpg",
          },
          investUrl: "$invest_url",
        },
      },
    ]);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(stocks);
  } catch (error) {
    next(error);
  }
});

export default router;
