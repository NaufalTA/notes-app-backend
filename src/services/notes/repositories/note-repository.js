import { nanoid } from "nanoid";
import { Pool } from "pg";
import CollaborationsRepositories from "../../collaborations/repositories/collaborations-repository.js";

class NoteRepositories {
  constructor() {
    this.pool = new Pool();
    this.collaborationsRepositories = CollaborationsRepositories;
  }

  async createNote({ title, body, tags, owner }) {
    const id = nanoid(16);
    const ts = new Date().toISOString();

    const query = {
      text: "INSERT INTO notes(id, title, body, tags, created_at, updated_at, owner) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, body, tags, created_at, updated_at",
      values: [id, title, body, tags, ts, ts, owner],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getNotes(owner) {
    const textQuery = `
    SELECT notes.* FROM NOTES
    LEFT JOIN collaborations ON collaborations.note_id = notes.id
    WHERE notes.owner = $1 OR collaborations.user_id = $1
    GROUP BY notes.id
    `


    const query = {
      text: textQuery,
      values: [owner],
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getNoteById(id) {
    const textQuery = `
    SELECT notes.*, users.username 
    FROM notes
    LEFT JOIN users ON users.id = notes.owner 
    WHERE notes.id = $1
    `
    
    const query = {
      text: textQuery,
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async editNote({ id, title, body, tags }) {
    const ts = new Date().toISOString();

    const query = {
      text: "UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id",
      values: [title, body, tags, ts, id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteNote(id) {
    const query = {
      text: "DELETE FROM notes WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: "SELECT * FROM notes WHERE id = $1",
      values: [id],
    };


    const result = await this.pool.query(query);

    if (!result.rows.length) {
      return null;
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      return null;
    }

    return note;
  }

  async verifyNoteAccess(noteId, userId){
    const ownerResult = await this.verifyNoteOwner(noteId, userId);

    if(ownerResult){
      return ownerResult;
    }

    const result = await this.collaborationsRepositories.verifyCollaborator(noteId, userId);
    return result;
  }
}

export default new NoteRepositories();
