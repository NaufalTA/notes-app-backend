import response from "../../../utils/response.js";
import NoteRepositories from "../repositories/note-repositories.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";

export const createNote = async (req, res, next) => {
  const { title, tags, body } = req.validated;
  const note = await NoteRepositories.createNote({
    title,
    tags,
    body,
  });

  if (!note) {
    return next(new InvariantError("Catatan gagal ditambahkan"));
  }
  return response(res, 201, "Catatan berhasil ditambahkan", note);
};

export const getNotes = async (req, res) => {
  const notes = await NoteRepositories.getNotes();
  return response(res, 200, "success", { notes });
};

export const getNoteById = async (req, res, next) => {
  const { id } = req.params;
  const note = await NoteRepositories.getNoteById(id);

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }
  return response(res, 200, "Catatan sukses ditampilkan", { note });
};

export const updateNoteById = async (req, res, next) => {
  const { id } = req.params;
  const { title, body, tags } = req.validated;
  const note = await NoteRepositories.editNote({ id, title, body, tags });

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }
  return response(res, 200, "Catatan berhasil diperbarui", { note });
};

export const deleteNoteById = (req, res, next) => {
  const { id } = req.params;
  const note = NoteRepositories.deleteNote(id);

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }
  return response(res, 200, "Catatan berhasil dihapus", { note });
};
