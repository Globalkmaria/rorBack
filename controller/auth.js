import User from "../models/auth/userModel.js";
import passport from "passport";
import mongoose from "mongoose";

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

    return res.status(404).send({ message: "User not found" });
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
