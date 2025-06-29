import express from "express";
import authRouter from "./auth.js";
import stocksRouter from "./const.js";
import usersRouter from "./user/index.js";
import imgRouter from "./img.js";
import aiRouter from "./ai.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/const", stocksRouter);
router.use("/user", usersRouter);
router.use("/img", imgRouter);
router.use("/ai", aiRouter);

export default router;
