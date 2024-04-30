import express from "express";

import { isLoggedIn } from "../../../middleware/auth/auth.js";
import stocksRouter from "./stocks.js";
import groupsRouter from "./groups.js";
import userDataRouter from "./user-data.js";
import soldsRouter from "./solds.js";

const router = express.Router();

router.use(isLoggedIn);

router.use("/stocks", stocksRouter);
router.use("/groups", groupsRouter);
router.use("/user-data", userDataRouter);
router.use("/solds", soldsRouter);

export default router;
