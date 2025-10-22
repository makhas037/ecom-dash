-- Update user_datasets table for file uploads
ALTER TABLE user_datasets ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
ALTER TABLE user_datasets ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE user_datasets ADD COLUMN IF NOT EXISTS file_type VARCHAR(50);
ALTER TABLE user_datasets ADD COLUMN IF NOT EXISTS file_path TEXT;
ALTER TABLE user_datasets ADD COLUMN IF NOT EXISTS row_count INTEGER;
ALTER TABLE user_datasets ADD COLUMN IF NOT EXISTS column_count INTEGER;
ALTER TABLE user_datasets ADD COLUMN IF NOT EXISTS is_applied BOOLEAN DEFAULT false;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_datasets_applied ON user_datasets(user_id, is_applied);
