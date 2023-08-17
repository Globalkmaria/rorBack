import express from "express";
import {
  addNewStock,
  getUserStocks,
  saveUserStocks,
} from "../../../middleware/user/stocks.js";

const router = express.Router();

router.get("/", getUserStocks, (req, res) => {
  res.status(200).json(req.stocks);
});

router.patch("/", saveUserStocks, (req, res) => res.status(200).send());

router.post("/", addNewStock, (req, res) => {
  res.status(201).json(req.stocks);
});

export default router;
