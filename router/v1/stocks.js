import express from "express";
import mongoose from "mongoose";
import { constConnection } from "../../db/database.js";

const router = express.Router();

const stockSchema = new mongoose.Schema({
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
  img_url: String,
  invest_url: String,
});

const Stock = constConnection.model("Stock", stockSchema);

router.get("/top-stocks", async (req, res) => {
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
        investUrl: "$invest_url",
      },
    },
  ]);
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(stocks);
});

export default router;
