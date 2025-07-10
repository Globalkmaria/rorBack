import express from "express";

import * as authController from "../../controller/auth.js";
import * as authMiddleware from "../../middleware/auth/auth.js";

const router = express.Router();

router.post(
  "/register",
  authMiddleware.validateCredential,
  authController.register
);

router.get("/me", authController.me);

router.post("/login", authMiddleware.validateCredential, authController.login);

router.get("/logout", authController.logout);

router.delete(
  "/account",
  authMiddleware.isLoggedIn,
  authController.deleteAccount
);

router.delete(
  "/account/complete",
  authMiddleware.isLoggedIn,
  authController.deleteAccountComplete
);

router.get("/google", authMiddleware.connectGoogleOAuth);

router.get(
  "/google/home",
  authMiddleware.responseGoogleOAuth,
  authController.googleLogin
);

export default router;
