import { getNotes } from "../../middleware/user/utils.js";
import userNotes from "../../models/users/notes.js";
import { keysToSnakeCase } from "../../utils/keysToSnakeCase.js";

export const addNewNote = async (req, res, next) => {
  try {
    const user_id = req.user;
    const note = keysToSnakeCase(req.body.note);
    const original_notes = await getNotes(user_id);

    const next_id = original_notes.next_id.toString();
    const new_note = {
      id: next_id,
      ...note,
    };
    original_notes.entries.set(next_id, new_note);
    original_notes.next_id++;

    const result = await original_notes.save();
    if (result) {
      const { createdAt, updatedAt, id } = result.get("entries").get(next_id);
      return res.status(201).json({ createdAt, updatedAt, id });
    }

    return res.status(400).json({ message: "Error saving note" });
  } catch (error) {
    if (error.name.includes("ValidationError"))
      return res.status(400).json({ message: error.message });

    next(error);
  }
};

export const editNote = async (req, res, next) => {
  try {
    const user_id = req.user;
    const note_id = req.params.note_id;

    const serve_notes = await userNotes.findOne(
      {
        user_id,
        [`entries.${note_id}`]: { $exists: true },
      },
      {
        [`entries.${note_id}`]: 1,
      }
    );

    const serve_note = serve_notes.entries.get(note_id);

    if (!serve_note)
      return res.status(404).json({
        message: "Note not found.",
      });

    const client_note = keysToSnakeCase(req.body.note);
    if (!client_note)
      return res.status(400).json({
        message: "Note content is required.",
      });

    const new_note = {
      ...serve_note,
      ...client_note,
    };

    const saved_note = await userNotes.findOneAndUpdate(
      { user_id, [`entries.${note_id}`]: { $exists: true } },
      {
        $set: {
          [`entries.${note_id}.title`]: new_note.title,
          [`entries.${note_id}.text`]: new_note.text,
          [`entries.${note_id}.stock_id`]: new_note.stock_id,
          [`entries.${note_id}.stock_name`]: new_note.stock_name,
          [`entries.${note_id}.purchased_id`]: new_note.purchased_id,
          [`entries.${note_id}.sold_id`]: new_note.sold_id,
          [`entries.${note_id}.tag`]: new_note.tag,
          [`entries.${note_id}.updatedAt`]: new Date().toISOString(),
        },
      },
      {
        new: true,
        upsert: false,
      }
    );

    if (!saved_note)
      return res.status(404).json({
        message: "Note not found.",
      });

    return res.status(200).json({
      updatedAt: saved_note.entries.get(note_id).updatedAt,
    });
  } catch (error) {
    if (err.name === "CastError")
      return res.status(400).json({
        message: "There was an error with casting.",
        error: err,
      });
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const user_id = req.user;
    const note_id = req.params.note_id;

    if (note_id === undefined || note_id === "")
      return res.status(400).json({
        message: "Note Id is required.",
      });

    const result = await userNotes.findOneAndUpdate(
      {
        user_id,
      },
      { $unset: { [`entries.${note_id}`]: "" } }
    );
    if (!result) return res.status(404).send();

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
