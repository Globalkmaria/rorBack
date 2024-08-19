import express from "express";

import { addNewNote } from "../../../controller/user/notes.js";

const router = express.Router();

router.post("/", addNewNote);

export default router;
