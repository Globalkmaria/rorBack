import { filterNoteListProps, getNotes } from "../../middleware/user/utils.js";
import { keysToCamelCase } from "../../utils/keysToCamelCase.js";
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

export const getUserNotes = async (req, res, next) => {
  try {
    const user_id = req.user;

    const notes = await getNotes(user_id);
    const noteList = filterNoteListProps(notes.entries);

    res
      .status(200)
      .json({ nextId: notes.next_id, notes: keysToCamelCase(noteList) });
  } catch (error) {
    next(error);
  }
};
