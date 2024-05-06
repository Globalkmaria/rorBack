import express from "express";
import {
  addNewItem,
  addNewStock,
  getUserStocks,
  saveUserStocks,
} from "../../../middleware/user/stocks.js";
import {
  deleteUserItem,
  deleteUserStock,
  editUserItem,
  editUserStock,
  editUserStockPrices,
} from "../../../controller/user/stocks.js";
import { keysToCamelCase } from "../../../utils/keysToCamelCase.js";

const router = express.Router();

router.get("/", getUserStocks, (req, res) => {
  res.status(200).json(keysToCamelCase(req.stocks));
});

router.patch("/", saveUserStocks, (req, res) => res.status(200).send());

router.post("/", addNewStock, (req, res) => {
  res.status(201).json(keysToCamelCase(req.stocks));
});

router.patch("/prices", editUserStockPrices);

router.patch("/:stockId", editUserStock);

router.delete("/:stockId", deleteUserStock);

router.post("/:stockId/items", addNewItem, (req, res) => {
  res.status(201).json(keysToCamelCase(req.stocks));
});

router.patch("/:stockId/items/:itemId", editUserItem);

router.delete("/:stockId/items/:itemId", deleteUserItem);

export default router;
