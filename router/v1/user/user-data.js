import express from "express";

import {
  getUserGroups,
  replaceUserGroups,
  saveUserGroups,
} from "../../../middleware/user/groups.js";
import {
  getUserStocks,
  replaceUserStocks,
  saveUserStocks,
} from "../../../middleware/user/stocks.js";
import {
  getUserSolds,
  replaceUserSolds,
  saveUserSolds,
} from "../../../middleware/user/solds.js";

const router = express.Router();

router.get("/", getUserStocks, getUserGroups, getUserSolds, (req, res) => {
  res
    .status(200)
    .json({ stocks: req.stocks, groups: req.groups, solds: req.solds });
});

router.patch(
  "/",
  saveUserStocks,
  saveUserGroups,
  saveUserSolds,
  async (req, res) => {
    res.status(200).send({ success: true });
  }
);

router.put(
  "/",
  replaceUserStocks,
  replaceUserGroups,
  replaceUserSolds,
  async (req, res) => {
    try {
      await req.stocks.save();
      await req.groups.save();
      await req.solds.save();
      return res.status(200).send();
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message });
    }
  }
);

router.post(
  "/samples/current",
  saveUserStocks,
  saveUserGroups,
  async (req, res) => {
    res.status(200).send({ success: true });
  }
);

export default router;
