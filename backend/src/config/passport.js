import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { v4 as uuidv4 } from 'uuid';
import pool from './db.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        const result = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [profile.emails[0].value]
        );

        if (result.rows.length > 0) {
          // User exists, update last login
          await pool.query(
            'UPDATE users SET last_login = NOW() WHERE id = $1',
            [result.rows[0].id]
          );
          return done(null, result.rows[0]);
        }

        // Create new user
        const userId = uuidv4();
        const newUser = await pool.query(
          `INSERT INTO users (id, name, email, auth_provider, google_id, created_at, last_login) 
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
           RETURNING *`,
          [userId, profile.displayName, profile.emails[0].value, 'google', profile.id]
        );

        done(null, newUser.rows[0]);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
