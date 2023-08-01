import express from "express";
import morgan from "morgan";
import { config } from "./config.js";
import v1 from "./router/v1/v1.js";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/v1", v1);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
