import mongoose from "mongoose";
import { userConnection } from "../../db/database.js";

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  stocks: {
    type: Map,
    of: [String],
    required: true,
  },
});

const userGroupsSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  next_group_id: {
    type: String,
    required: true,
  },
  groups: {
    type: Map,
    of: GroupSchema,
    required: true,
  },
});

const userGroups = userConnection.model("Group", userGroupsSchema);
export default userGroups;
