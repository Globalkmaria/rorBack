import express from "express";

import {
  addUserGroupSample,
  getUserGroups,
  replaceUserGroups,
  saveUserGroups,
} from "../../../middleware/user/groups.js";
import {
  addUserStockSample,
  getUserStocks,
  replaceUserStocks,
  saveUserStocks,
} from "../../../middleware/user/stocks.js";

const router = express.Router();

router.get("/", getUserStocks, getUserGroups, (req, res) => {
  res.status(200).json({ stocks: req.stocks, groups: req.groups });
});

router.patch("/", saveUserStocks, saveUserGroups, async (req, res) => {
  res.status(200).send({ success: true });
});

router.put("/", replaceUserStocks, replaceUserGroups, async (req, res) => {
  try {
    await req.stocks.save();
    await req.groups.save();
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

router.post("/sample", addUserStockSample, addUserGroupSample, (req, res) => {
  return res.status(200).send();
});

export default router;
