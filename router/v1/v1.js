import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from v1 get");
});

router.post("/", (req, res) => {
  console.log(req.body);
  res.send("Hello from v1 post");
});

export default router;
