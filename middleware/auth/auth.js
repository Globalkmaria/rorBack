import { body } from "express-validator";
import passport from "passport";
import mongoose from "mongoose";

import { config } from "../../config/index.js";
import { validate } from "../validator.js";

export const validateCredential = [
  body("username")
    .trim()
    .isEmail()
    .notEmpty()
    .withMessage("Email should be empty"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters"),
  validate,
];

export const connectGoogleOAuth = passport.authenticate("google", {
  scope: ["profile"],
});

export const responseGoogleOAuth = passport.authenticate("google", {
  successRedirect: `${config.frontend.url}/`,
  failureRedirect: `${config.frontend.url}/login`,
});

export const isLoggedIn = (req, res, next) => {
  if (req.user) {
    req.user = new mongoose.Types.ObjectId(req.user);
    return next();
  }
  res.sendStatus(401);
};
