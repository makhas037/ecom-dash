import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DB_CONNECTION_STRING,
});

(async () => {
  try {
    await client.connect();
    console.log('âœ… Database connection successful');
    const res = await client.query('SELECT NOW()');
    console.log('ðŸ•’ Server time:', res.rows[0].now);
  } catch (err) {
    console.error('âŒ Database connection failed:', err.message);
  } finally {
    await client.end();
  }
})();
