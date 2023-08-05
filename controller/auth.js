import User from "../models/userModel.js";
import passport from "passport";

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
          res.status(201).json({ user: user.username });
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
        res.status(200).json({ user: user.username });
      });
    }
  });
};

export const logout = (req, res) => {
  req.logout();
  res.sendStatus(200);
};

export const googleLogin = (req, res) => {
  res.sendStatus(200);
};
