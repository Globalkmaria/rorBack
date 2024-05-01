import express from "express";
import {
  getUserGroups,
  saveUserGroups,
} from "../../../middleware/user/groups.js";
import {
  addPurchasedItemToGroup,
  addUserNewGroup,
  deletePurchasedItemFromGroup,
  deleteUserGroup,
} from "../../../controller/user/groups.js";

const router = express.Router();

router.get("/", getUserGroups, async (req, res) => {
  res.status(200).json(req.groups);
});

router.patch("/", saveUserGroups, async (req, res) => {
  res.status(200).send();
});

router.post("/", addUserNewGroup);

router.delete("/:groupId", deleteUserGroup);

router.post("/:groupId/:stockId/:itemId", addPurchasedItemToGroup);
router.delete("/:groupId/:stockId/:itemId", deletePurchasedItemFromGroup);

export default router;
