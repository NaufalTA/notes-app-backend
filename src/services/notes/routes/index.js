import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNoteById,
  deleteNoteById,
} from "../controller/note-controller.js";
import { validate } from "../../../middlewares/validate.js";
import { notePayloadSchema } from "../../../services/notes/validator/schema.js";
import authenticateToken from "../../../middlewares/auth.js";

const router = express.Router();

router.post("/notes", authenticateToken, validate(notePayloadSchema), createNote);
router.get("/notes", authenticateToken, getNotes);
router.get("/notes/:id", authenticateToken, getNoteById);
router.put("/notes/:id", authenticateToken, validate(notePayloadSchema), updateNoteById);
router.delete("/notes/:id", authenticateToken, deleteNoteById);

export default router;
