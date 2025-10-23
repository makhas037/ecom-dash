import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecom_dash',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function queryWithUser(userId, query, params = []) {
  const client = await pool.connect();
  try {
    await client.query(`SET app.current_user_id = '${userId}'`);
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
}

export default pool;
