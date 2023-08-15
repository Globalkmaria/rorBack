import express from "express";

import {
  getUserGroups,
  saveUserGroups,
} from "../../../middleware/user/groups.js";
import {
  getUserStocks,
  saveUserStocks,
} from "../../../middleware/user/stocks.js";

const router = express.Router();

router.get("/", getUserStocks, getUserGroups, (req, res) => {
  res.status(200).json({ stocks: req.stocks, groups: req.groups });
});

router.patch("/", saveUserStocks, saveUserGroups, async (req, res) => {
  res.status(200).send();
});

export default router;
