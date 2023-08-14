import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from "mongoose-findorcreate";
import { userConnection } from "../../db/database.js";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  username: String,
  secret: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = userConnection.model("User", userSchema);

export default User;
