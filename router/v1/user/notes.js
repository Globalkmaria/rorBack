import express from "express";

import {
  addNewNote,
  deleteNote,
  editNote,
} from "../../../controller/user/notes.js";

const router = express.Router();

router.post("/", addNewNote);

router.put("/:note_id", editNote);

router.delete("/:note_id", deleteNote);

export default router;
