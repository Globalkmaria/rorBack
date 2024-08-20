import express from "express";

import { addNewNote, editNote } from "../../../controller/user/notes.js";

const router = express.Router();

router.post("/", addNewNote);

router.put("/:note_id", editNote);

export default router;
