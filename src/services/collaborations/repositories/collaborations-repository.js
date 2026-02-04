import { Pool } from "pg";
import { nanoid } from "nanoid";

class CollaborationRepository {
  constructor() {
    this.pool = new Pool();
  }

  async addCollaboration(noteId, userId) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, noteId, userId],
    };

    const result = await this.pool.query(query);
    return result.rows[0].id;
  }

  async deleteCollaboration(noteId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id",
      values: [noteId, userId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async verifyCollaborator(noteId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2",
      values: [noteId, userId],
    };

    const result = await this.pool.query(query);
    return result.rowCount > 0;
  }
}

export default new CollaborationRepository();
