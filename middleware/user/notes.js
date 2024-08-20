import userNotes from "../../models/users/notes";
import { keysToCamelCase } from "../../utils/keysToCamelCase";
import { keysToSnakeCase } from "../../utils/keysToSnakeCase";
import { filterNoteListProps, getNotes } from "./utils";

export const getUserNotes = async (req, res, next) => {
  try {
    const user_id = req.user;

    const notes = await getNotes(user_id);
    const noteList = filterNoteListProps(notes.entries);

    req.notes = {
      nextId: notes.next_id,
      notes: keysToCamelCase(noteList),
    };
    next();
  } catch (error) {
    next(error);
  }
};

export const editNote = async (req, res, next) => {
  try {
    const user_id = req.user;
    const note_id = req.params.note_id;

    const serve_note = await userNotes.findOne({
      user_id,
      [`entires.${note_id}`]: { $exists: true },
    });
    console.log("serve_note", serve_note);

    const note = keysToSnakeCase(req.body.note);
    if (!note)
      return res.status(400).json({
        message: "Note content is required.",
      });

    const saved_note = await userNotes.findOneAndUpdate(
      { user_id, note_id },
      { $set: { note } },
      { new: true }
    );

    if (!saved_note)
      return res.status(404).json({
        message: "Note not found.",
      });

    return res.status(200).send();
  } catch (error) {
    if (err.name === "CastError")
      return res.status(400).json({
        message: "There was an error with casting.",
        error: err,
      });
    next(error);
  }
};
