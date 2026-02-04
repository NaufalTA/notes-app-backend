import CollaborationRepository from "../repositories/collaborations-repository.js";
import NoteRepositories from "../../notes/repositories/note-repository.js";
import response from "../../../utils/response.js";
import {
  InvariantError,
  AuthorizationError,
} from "../../../exceptions/index.js";

export const addCollaboration = async (req, res, next) => {
  const { id: credentialId } = req.user;
  const { noteId, userId } = req.validated;

  console.log(userId);

  const isOwner = await NoteRepositories.verifyNoteOwner(noteId, credentialId);
  if (!isOwner) {
    return next(
      new AuthorizationError("Anda tidak berhak mengakses resource ini"),
    );
  }

  const collaboration = await CollaborationRepository.addCollaboration(
    noteId,
    userId,
  );
  if (!collaboration) {
    return next(InvariantError("Kolaborasi gagal ditambahkan"));
  }

  return response(res, 201, "kolaborasi berhasil ditambahkan", {
    collaborationId: collaboration,
  });
};

export const deleteCollaboration = async (req, res, next) => {
  const { id: credentialId } = req.user;
  const { noteId, userId } = req.validated;

  const isOwner = await NoteRepositories.verifyNoteOwner(noteId, credentialId)
  if(!isOwner){
    return next(AuthorizationError("Anda tidak berhak mengakses resource ini"))
  }

  const collaboration = await CollaborationRepository.deleteCollaboration(noteId, userId);
  if (!collaboration) {
    return next(InvariantError("Kolaborasi gagal dihapus"));
  }

  return response(res, 200, "Kolaborasi berhasil dihapus", null)
};
