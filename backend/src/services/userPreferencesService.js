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

export class UserPreferencesService {
  // Get user preferences (create if doesn't exist)
  static async getPreferences(userId) {
    let query = 'SELECT * FROM user_preferences WHERE user_id = $1';
    let result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      // Create default preferences
      query = `
        INSERT INTO user_preferences (user_id, theme, default_chart_type, ai_response_style)
        VALUES ($1, 'light', 'line', 'detailed')
        RETURNING *
      `;
      result = await pool.query(query, [userId]);
    }
    
    return result.rows[0];
  }

  // Update user preferences
  static async updatePreferences(userId, updates) {
    const {
      theme,
      default_chart_type,
      dashboard_layout,
      ai_response_style
    } = updates;

    const query = `
      UPDATE user_preferences
      SET 
        theme = COALESCE($2, theme),
        default_chart_type = COALESCE($3, default_chart_type),
        dashboard_layout = COALESCE($4, dashboard_layout),
        ai_response_style = COALESCE($5, ai_response_style),
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId,
      theme || null,
      default_chart_type || null,
      dashboard_layout ? JSON.stringify(dashboard_layout) : null,
      ai_response_style || null
    ]);

    return result.rows[0];
  }

  // Reset to defaults
  static async resetPreferences(userId) {
    const query = `
      UPDATE user_preferences
      SET 
        theme = 'light',
        default_chart_type = 'line',
        dashboard_layout = NULL,
        ai_response_style = 'detailed',
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}
