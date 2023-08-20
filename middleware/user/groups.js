import { SAMPLE_GROUPS_DATA } from "../../data/groups.js";
import userGroups from "../../models/users/groups.js";
import { keysToCamelCase } from "../../utils/keysToCamelCase.js";
import { keysToSnakeCase } from "../../utils/keysToSnakeCase.js";
import { filterUserGroupsProps, getGroups, getNewGroupsData } from "./utils.js";

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
  const stockOldAndNewIdMap = req.stockOldAndNewIdMap;

  const { newGroups, next_group_id } = getNewGroupsData(
    new_groups,
    original_groups.next_group_id,
    stockOldAndNewIdMap
  );

  await userGroups.findOneAndUpdate(
    { user_id },
    { $set: { ...newGroups, next_group_id } },
    { new: true, upsert: false }
  );

  next();
};

export const replaceUserGroups = async (req, res, next) => {
  try {
    const { groups, next_group_id } = keysToSnakeCase(req.body.groups);
    if (!groups) next();

    const user_id = req.user;
    const original_groups = await getGroups(user_id);

    for (const groupId in groups) {
      original_groups.set(`groups.${groupId}`, groups[groupId]);
    }
    original_groups.set("next_group_id", next_group_id);

    await original_groups.validate();

    req.groups = original_groups;

    return next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const addUserGroupSample = async (req, res, next) => {
  try {
    const user_id = req.user;
    const original_groups = await getGroups(user_id);

    original_groups.set("groups", SAMPLE_GROUPS_DATA.groups);
    original_groups.set("next_group_id", SAMPLE_GROUPS_DATA.next_group_id);

    await original_groups.save();
    next();
  } catch (error) {
    next(error);
  }
};
