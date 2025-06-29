import express from "express";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";

import { config, corsOption, getSessions } from "./config/index.js";
import v1 from "./router/v1/index.js";
import { errorHandler, notFound } from "./middleware/errorHandlers.js";

import "./config/passport.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOption));
app.use(morgan("tiny"));

app.use(session(getSessions()));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", v1);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
