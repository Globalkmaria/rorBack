import mongoose from "mongoose";
import { userConnection } from "../../db/database.js";

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    stock_id: {
      type: String,
    },
    stock_name: {
      type: String,
    },
    purchased_id: {
      type: String,
    },
    sold_id: {
      type: String,
    },
    tag: {
      type: String,
    },
  },
  { timestamps: true }
);

const userNoteSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    entries: {
      type: Map,
      of: noteSchema,
      required: true,
    },
    next_id: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const userNotes = userConnection.model("Note", userNoteSchema);

export default userNotes;
