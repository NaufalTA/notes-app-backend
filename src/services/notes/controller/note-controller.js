import response from "../../../utils/response.js";
import NoteRepositories from "../repositories/note-repository.js";
import {
  InvariantError,
  NotFoundError,
  AuthorizationError,
} from "../../../exceptions/index.js";

export const createNote = async (req, res, next) => {
  const { title, tags, body } = req.validated;
  const { id: owner } = req.user;
  const note = await NoteRepositories.createNote({
    title,
    tags,
    body,
    owner,
  });

  if (!note) {
    return next(new InvariantError("Catatan gagal ditambahkan"));
  }
  return response(res, 201, "Catatan berhasil ditambahkan", note);
};

export const getNotes = async (req, res) => {
  const { id: owner } = req.user;
  const notes = await NoteRepositories.getNotes(owner);
  return response(res, 200, "Catatan sukses ditampilkan", { notes });
};

export const getNoteById = async (req, res, next) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const isAllowed = await NoteRepositories.verifyNoteAccess(id, owner);

  if (!isAllowed) {
    return next(
      new AuthorizationError("Anda tidak berhak mengakses resource ini"),
    );
  }

  const note = await NoteRepositories.getNoteById(id);

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }
  return response(res, 200, "Catatan sukses ditampilkan", { note });
};

export const updateNoteById = async (req, res, next) => {
  const { id } = req.params;
  const { title, body, tags } = req.validated;
  const { id: owner } = req.user;

  const isAllowed = await NoteRepositories.verifyNoteAccess(id, owner);

  if (!isAllowed) {
    return next(
      new AuthorizationError("Anda tidak berhak mengakses resource ini"),
    );
  }

  const note = await NoteRepositories.editNote({ id, title, body, tags });

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }
  return response(res, 200, "Catatan berhasil diperbarui", { note });
};

export const deleteNoteById = async (req, res, next) => {
  const { id } = req.params;
  const { id: owner } = req.user;

  const isOwner = await NoteRepositories.verifyNoteOwner(id, owner);

  if (!isOwner) {
    return next(
      new AuthorizationError("Anda tidak berhak mengakses resource ini"),
    );
  }

  const note = await NoteRepositories.deleteNote(id);

  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }
  return response(res, 200, "Catatan berhasil dihapus", { note });
};
