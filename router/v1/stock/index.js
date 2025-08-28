import express from "express";

import pricesRouter from "./prices.js";

const router = express.Router();

router.use("/prices", pricesRouter);

export default router;
