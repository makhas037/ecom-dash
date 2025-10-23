-- Migration: Add Row-Level Security for Multi-Tenant Isolation
-- Version: 002
-- Date: 2025-10-23

-- Enable RLS on user_datasets
ALTER TABLE user_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create isolation policies
CREATE POLICY user_datasets_isolation ON user_datasets
    USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY user_preferences_isolation ON user_preferences
    USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY chat_history_isolation ON chat_history
    USING (user_id = current_setting('app.current_user_id', true));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_datasets_user_id ON user_datasets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);

-- Add is_applied column if not exists
ALTER TABLE user_datasets ADD COLUMN IF NOT EXISTS is_applied BOOLEAN DEFAULT false;
