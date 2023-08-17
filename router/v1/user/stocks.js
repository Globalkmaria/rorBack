import express from "express";
import {
  addNewStock,
  getUserStocks,
  saveUserStocks,
} from "../../../middleware/user/stocks.js";
import {
  deleteUserItem,
  deleteUserStock,
} from "../../../controller/user/stocks.js";
import { keysToCamelCase } from "../../../utils/toCamelCase.js";

const router = express.Router();

router.get("/", getUserStocks, (req, res) => {
  res.status(200).json(keysToCamelCase(req.stocks));
});

router.patch("/", saveUserStocks, (req, res) => res.status(200).send());

router.post("/", addNewStock, (req, res) => {
  res.status(201).json(keysToCamelCase(req.stocks));
});

router.delete("/:stockId", deleteUserStock);

router.delete("/:stockId/items/:itemId", deleteUserItem);

export default router;
