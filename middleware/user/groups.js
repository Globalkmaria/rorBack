import userGroups from "../../models/users/groups.js";
import { keysToCamelCase } from "../../utils/toCamelCase.js";
import { keysToSnakeCase } from "../../utils/toSnakeCase.js";
import { filterUserGroupsProps, getNewGroupsData } from "./utils.js";

const getGroups = async (user_id) => {
  let groups = await userGroups.findOne({ user_id });

  if (!groups) {
    groups = await userGroups.create({
      user_id,
      next_group_id: 0,
      groups: new Map(),
    });
  }

  return groups;
};

export const getUserGroups = async (req, res, next) => {
  const user_id = req.user;
  const groups = await getGroups(user_id);
  req.groups = keysToCamelCase(filterUserGroupsProps(groups.toJSON()));

  next();
};

export const saveUserGroups = async (req, res, next) => {
  const new_groups = keysToSnakeCase(req.body.groups);
  if (!new_groups) next();

  const user_id = req.user;
  const original_groups = await getGroups(user_id);
  const { newGroups, next_group_id } = getNewGroupsData(
    new_groups,
    original_groups
  );

  await userGroups.findOneAndUpdate(
    { user_id },
    { $set: { ...newGroups, next_group_id } },
    { new: true, upsert: false }
  );

  next();
};
