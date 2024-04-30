import express from "express";

import {
  deleteUserSold,
  editUserItem,
} from "../../../controller/user/solds.js";
import {
  addNewSolds,
  getUserSolds,
  saveUserSolds,
} from "../../../middleware/user/solds.js";

const router = express.Router();

router.post("/", addNewSolds, (req, res) => {
  res.status(201).send();
});

router.get("/", getUserSolds, (req, res) => {
  res.status(200).json(keysToCamelCase(req.solds));
});

router.patch("/", saveUserSolds, (req, res) => res.status(200).send());

router.patch("/:soldId", editUserItem);

router.delete("/:soldId", deleteUserSold);

export default router;
