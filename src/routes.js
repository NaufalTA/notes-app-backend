import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNoteById,
  deleteNoteById,
} from "./controller.js";

const router = express.Router();

router.post("/notes", createNote);
router.get("/notes", getNotes);
router.get("/notes/:id", getNoteById);
router.put("/notes/:id", updateNoteById);
router.delete("/notes/:id", deleteNoteById);

export default router;
