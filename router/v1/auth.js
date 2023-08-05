import express from "express";

import * as authController from "../../controller/auth.js";
import * as authMiddleware from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  authMiddleware.validateCredential,
  authController.register
);

router.post("/login", authMiddleware.validateCredential, authController.login);

router.get("/logout", authController.logout);

router.get("/google", authMiddleware.connectGoogleOAuth);

router.get(
  "/google/home",
  authMiddleware.responseGoogleOAuth,
  authController.googleLogin
);

export default router;
