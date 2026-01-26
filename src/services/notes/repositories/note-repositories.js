import { nanoid } from "nanoid";
import { Pool } from "pg";

class NoteRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async createNote({ title, body, tags }) {
    const id = nanoid(16);
    const ts = new Date().toISOString();

    const query = {
      text: "INSERT INTO notes(id, title, body, tags, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, body, tags, created_at, updated_at",
      values: [id, title, body, tags, ts, ts],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getNotes() {
    const result = await this.pool.query("SELECT * FROM notes");
    return result.rows;
  }

  async getNoteById(id) {
    const query = {
      text: "SELECT * FROM notes WHERE id = $1",
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
    return result.rows[0].id;
  }
}

export default new NoteRepositories();
