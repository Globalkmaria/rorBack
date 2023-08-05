import { body } from "express-validator";
import passport from "passport";

import { config } from "../config/index.js";
import { validate } from "./validator.js";

export const validateCredential = [
  body("username").trim().notEmpty().withMessage("username should be empty"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("password should be at least 5 characters"),
  validate,
];

export const connectGoogleOAuth = passport.authenticate("google", {
  scope: ["profile"],
});

export const responseGoogleOAuth = passport.authenticate("google", {
  successRedirect: `${config.frontend.url}/`,
  failureRedirect: `${config.frontend.url}/login`,
});
