import { keysToCamelCase } from "../../utils/keysToCamelCase.js";
import { filterNoteListProps, getNotes } from "./utils.js";

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
