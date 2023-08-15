import express from "express";
import {
  getUserGroups,
  saveUserGroups,
} from "../../../middleware/user/groups.js";

const router = express.Router();

router.get("/", getUserGroups, async (req, res) => {
  res.status(200).json(req.groups);
});

router.patch("/", saveUserGroups, async (req, res) => {
  res.status(200).send();
});

export default router;
