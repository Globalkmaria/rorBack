import userSolds from "../../models/users/solds.js";
import { keysToSnakeCase } from "../../utils/keysToSnakeCase.js";

export const deleteUserSold = async (req, res, next) => {
  try {
    const user_id = req.user;
    const sold_id = req.params.soldId;

    if (sold_id === undefined) {
      return res.status(400).send();
    }

    const result = await userSolds.findOneAndUpdate(
      { user_id },
      { $unset: { [`solds.${sold_id}`]: "" } }
    );

    if (!result) {
      return res.status(404).send();
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const editUserItem = async (req, res, next) => {
  try {
    const user_id = req.user;
    const sold_id = req.params.soldId;

    const { sold_date, sold_time, sold_price } = keysToSnakeCase(req.body);

    if (
      !sold_id ||
      (sold_date === undefined &&
        sold_time === undefined &&
        sold_price === undefined)
    ) {
      return res.status(400).send();
    }

    const sold = await userSolds.findOneAndUpdate(
      {
        user_id,
        [`solds.${sold_id}`]: { $exists: true },
      },
      {
        $set: {
          [`solds.${sold_id}.sold_date`]: sold_date,
          [`solds.${sold_id}.sold_time`]: sold_time,
          [`solds.${sold_id}.sold_price`]: sold_price,
        },
      },
      { new: true }
    );

    if (!sold) {
      return res.status(404).send({
        message: "There was no matching item found for the given user.",
      });
    }

    return res.status(200).send();
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({
        message: "There was an error with casting.",
        error: err,
      });
    next(err);
  }
};
