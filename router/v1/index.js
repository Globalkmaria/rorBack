import express from "express";
import authRouter from "./auth.js";
import stocksRouter from "./stocks.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/stocks", stocksRouter);

export default router;
