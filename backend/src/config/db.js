import pg from 'pg';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis Client
export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Redis Connected'));

// Connect Redis
export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
};

// Test Database Connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ PostgreSQL Connected:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL Connection Error:', error.message);
    return false;
  }
};

// Graceful Shutdown
export const closeConnections = async () => {
  await pool.end();
  await redisClient.quit();
  console.log('Database connections closed');
};

export default { pool, redisClient, testConnection, connectRedis, closeConnections };
