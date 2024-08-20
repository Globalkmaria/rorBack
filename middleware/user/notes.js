import userNotes from "../../models/users/notes.js";
import { keysToCamelCase } from "../../utils/keysToCamelCase.js";
import { keysToSnakeCase } from "../../utils/keysToSnakeCase.js";
import { filterNoteListProps, getNewNotesData, getNotes } from "./utils.js";

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

export const saveUserNotes = async (req, res, next) => {
  try {
    const client_notes = keysToSnakeCase(req.body.notes);
    if (!client_notes) next();

    const user_id = req.user;
    const notes = await getNotes(user_id);

    const { new_notes, new_next_id } = getNewNotesData(
      client_notes,
      notes.next_id
    );

    await userNotes.findOneAndUpdate(
      { user_id },
      { $set: { ...new_notes, next_id: new_next_id } },
      { new: true, upsert: false }
    );

    next();
  } catch (error) {
    next(error);
  }
};

export const replaceUserNotes = async (req, res, next) => {
  try {
    const { notes, next_id } = keysToSnakeCase(req.body.notes);
    if (!notes) next();

    const user_id = req.user;
    const original_notes = await getNotes(user_id);

    original_notes.entries.clear();

    Object.keys(notes).forEach((note_id) => {
      original_notes.set(`entries.${note_id}`, notes[note_id]);
    });
    original_notes.set("next_id", next_id);
    await original_notes.validate();

    req.notes = original_notes;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
