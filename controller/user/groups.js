import { getGroups } from "../../middleware/user/utils.js";

export const addUserNewGroup = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { group } = req.body;

    const originalGroups = await getGroups(user_id);
    const nextGroupId = originalGroups.next_group_id;
    const newGroup = {
      id: nextGroupId,
      name: group.name,
      stocks: group.stocks,
    };

    originalGroups.groups.set(nextGroupId, newGroup);
    originalGroups.next_group_id++;
    const result = await originalGroups.save();
    if (result) return res.status(201).json({ groupId: nextGroupId });

    return res.status(400).json({ message: "Error saving group" });
  } catch (error) {
    if (error.name.includes("ValidationError")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

export const deleteUserGroup = async (req, res, next) => {
  try {
    const user_id = req.user;
    const { groupId } = req.params;

    const originalGroups = await getGroups(user_id);
    originalGroups.groups.delete(groupId);
    await originalGroups.save();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
