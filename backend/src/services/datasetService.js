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

export class DatasetService {
  // Save a custom dataset
  static async saveDataset(userId, datasetName, description, queryConfig) {
    const query = `
      INSERT INTO user_datasets (user_id, dataset_name, description, query_config)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId,
      datasetName,
      description,
      JSON.stringify(queryConfig)
    ]);

    return result.rows[0];
  }

  // Get user's datasets
  static async getUserDatasets(userId) {
    const query = `
      SELECT id, dataset_name, description, query_config, is_favorite, created_at, updated_at
      FROM user_datasets
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Get specific dataset
  static async getDataset(datasetId, userId) {
    const query = `
      SELECT * FROM user_datasets
      WHERE id = $1 AND user_id = $2
    `;

    const result = await pool.query(query, [datasetId, userId]);
    return result.rows[0];
  }

  // Update dataset
  static async updateDataset(datasetId, userId, updates) {
    const { dataset_name, description, query_config, is_favorite } = updates;

    const query = `
      UPDATE user_datasets
      SET 
        dataset_name = COALESCE($3, dataset_name),
        description = COALESCE($4, description),
        query_config = COALESCE($5, query_config),
        is_favorite = COALESCE($6, is_favorite),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [
      datasetId,
      userId,
      dataset_name || null,
      description || null,
      query_config ? JSON.stringify(query_config) : null,
      is_favorite !== undefined ? is_favorite : null
    ]);

    return result.rows[0];
  }

  // Delete dataset
  static async deleteDataset(datasetId, userId) {
    const query = 'DELETE FROM user_datasets WHERE id = $1 AND user_id = $2';
    await pool.query(query, [datasetId, userId]);
  }

  // Toggle favorite
  static async toggleFavorite(datasetId, userId) {
    const query = `
      UPDATE user_datasets
      SET is_favorite = NOT is_favorite
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [datasetId, userId]);
    return result.rows[0];
  }
}
