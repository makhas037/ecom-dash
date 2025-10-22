import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecom_dash',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Makhas037@123*',
  max: 20,
});

export class ChatHistoryService {
  // Save chat message to database
  static async saveMessage(userId, message, response, messageType = 'general', metadata = null) {
    const query = `
      INSERT INTO chat_history (user_id, message, response, message_type, metadata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at
    `;
    
    const result = await pool.query(query, [
      userId,
      message,
      response,
      messageType,
      metadata ? JSON.stringify(metadata) : null
    ]);
    
    return result.rows[0];
  }

  // Get user's chat history
  static async getUserHistory(userId, limit = 50) {
    const query = `
      SELECT id, message, response, message_type, metadata, created_at
      FROM chat_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  // Get recent context for AI
  static async getRecentContext(userId, count = 3) {
    const query = `
      SELECT message, response
      FROM chat_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [userId, count]);
    return result.rows.reverse(); // Return in chronological order
  }

  // Search chat history
  static async searchHistory(userId, searchTerm) {
    const query = `
      SELECT id, message, response, message_type, created_at
      FROM chat_history
      WHERE user_id = $1 
        AND (message ILIKE $2 OR response ILIKE $2)
      ORDER BY created_at DESC
      LIMIT 20
    `;
    
    const result = await pool.query(query, [userId, `%${searchTerm}%`]);
    return result.rows;
  }

  // Delete user's chat history
  static async clearHistory(userId) {
    const query = 'DELETE FROM chat_history WHERE user_id = $1';
    await pool.query(query, [userId]);
  }
}
