import express from "express";
import {
  getUserStocks,
  saveUserStocks,
} from "../../../middleware/user/stocks.js";

const router = express.Router();

router.get("/", getUserStocks, async (req, res) => {
  res.status(200).json(req.stocks);
});

router.patch("/", saveUserStocks, async (req, res) => {
  res.status(200).send();
});

export default router;
