import express from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNoteById,
  deleteNoteById,
} from "../controllers/note-controller.js";
import { validate, validateQuery } from "../../../middlewares/validate.js";
import {
  notePayloadSchema,
  noteUpdatePayloadSchema,
  noteQuerySchema,
} from "../../../services/notes/validator/schema.js";


const router = express.Router();

router.post("/notes", validate(notePayloadSchema), createNote);
router.get("/notes", validateQuery(noteQuerySchema), getNotes);
router.get("/notes/:id", getNoteById);
router.put("/notes/:id", validate(notePayloadSchema), updateNoteById);
router.delete("/notes/:id", deleteNoteById);

export default router;
