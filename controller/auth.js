import User from "../models/auth/userModel.js";
import passport from "passport";
import mongoose from "mongoose";
import { safeDeleteUserData } from "../utils/userDataDeletion.js";
import { getProtectedUserIds } from "../config/userProtection.js";

/**
 * Helper function to validate user authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object|null} - Returns user ID if authenticated, null if response already sent
 */
const validateUserAuthentication = (req, res) => {
  if (!req.user) {
    return {
      success: false,
      error: "User not authenticated",
      statusCode: 401,
    };
  }
  return {
    success: true,
  };
};

const validateUserProtection = (userId) => {
  const stringUserId = userId.toString();
  const protectedUserIds = getProtectedUserIds();

  if (protectedUserIds.includes(stringUserId)) {
    return {
      success: false,
      error: "User is protected",
      statusCode: 403,
    };
  }
  return {
    success: true,
  };
};

/**
 * Helper function to convert user ID to ObjectId
 * @param {string|Object} userId - User ID to convert
 * @returns {Object} - MongoDB ObjectId
 */
const getUserObjectId = (userId) => {
  return typeof userId === "string"
    ? new mongoose.Types.ObjectId(userId)
    : userId;
};

/**
 * Helper function to delete user authentication record
 * @param {Object} userObjectId - MongoDB ObjectId
 * @returns {Promise<Object|null>} - Deleted user object or null if not found
 */
const deleteUserRecord = async (userObjectId) => {
  try {
    return await User.findByIdAndDelete(userObjectId);
  } catch (error) {
    throw new Error(`Failed to delete user record: ${error.message}`);
  }
};

/**
 * Helper function to handle logout after account deletion
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} responseData - Response data to send
 */
const logoutAndRespond = (req, res, responseData) => {
  clearCookie(req, res);
  req.logout(function (err) {
    if (err) {
      console.error("Error during logout after account deletion:", err);
      // Continue anyway since the user is already deleted
    }
    res.status(200).json(responseData);
  });
};

const cookies = ["connect.sid"];
// clear cookie
const clearCookie = (req, res) => {
  cookies.forEach((cookie) => {
    res.clearCookie(cookie, {
      path: "/",
      httpOnly: true,
    });
  });
};

///---

export const me = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findOne({
        _id: new mongoose.Types.ObjectId(req.user),
      });
      return res.status(200).json({ user: { username: user.username } });
    }

    if (req.isAuthenticated()) {
      return res.status(200).json({ user: { username: req.user.username } });
    }

    return res.status(200).send({ user: null, message: "User not found" });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res
          .status(409)
          .json({ message: `${req.body.username} already exists` });
      } else {
        passport.authenticate("local")(req, res, function () {
          res.status(201).json({ user: { username: user.username } });
        });
      }
    }
  );
};

export const login = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.status(200).json({ user: { username: user.username } });
      });
    }
  });
};

export const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send();
  });
};

export const googleLogin = (req, res) => {
  res.sendStatus(200);
};

export const deleteAccount = async (req, res, next) => {
  try {
    // Validate user authentication
    const validateUserResult = validateUserAuthentication(req, res);
    if (!validateUserResult.success)
      return res
        .status(validateUserResult.statusCode)
        .json({ message: validateUserResult.error });

    // Convert to ObjectId
    const userObjectId = getUserObjectId(req.user);

    // Validate user protection
    const validateUserProtectionResult = validateUserProtection(userObjectId);
    if (!validateUserProtectionResult.success) {
      return res
        .status(validateUserProtectionResult.statusCode)
        .json({ message: validateUserProtectionResult.error });
    }

    // Delete user authentication record
    const deletedUser = await deleteUserRecord(userObjectId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Logout and respond
    const responseData = {
      message: "User authentication record deleted successfully",
    };

    logoutAndRespond(req, res, responseData);
  } catch (err) {
    console.error("Error deleting user authentication record:", err);
    next(err);
  }
};

export const deleteAccountComplete = async (req, res, next) => {
  try {
    // Validate user authentication
    const validateUserResult = validateUserAuthentication(req, res);
    if (!validateUserResult.success)
      return res
        .status(validateUserResult.statusCode)
        .json({ message: validateUserResult.error });

    // Convert to ObjectId
    const userObjectId = getUserObjectId(req.user);

    // Validate user protection
    const validateUserProtectionResult = validateUserProtection(userObjectId);
    if (!validateUserProtectionResult.success) {
      return res
        .status(validateUserProtectionResult.statusCode)
        .json({ message: validateUserProtectionResult.error });
    }

    // First, delete all user data (stocks, groups, solds, notes)
    const userDataDeletionResult = await safeDeleteUserData(userObjectId);

    if (!userDataDeletionResult.success) {
      return res.status(500).json({
        message: "Failed to delete user data",
        error: userDataDeletionResult.error,
      });
    }

    // Then, delete the user authentication record
    const deletedUser = await deleteUserRecord(userObjectId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "User authentication record not found" });
    }

    // Logout and respond
    const responseData = {
      message: "Account completely deleted successfully",
    };

    logoutAndRespond(req, res, responseData);
  } catch (err) {
    console.error("Error deleting account completely:", err);
    next(err);
  }
};
