-- ============================================================
-- MULTI-TENANT SECURITY MIGRATION
-- ============================================================

-- Add user_id columns if not exists
ALTER TABLE user_datasets ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS user_id UUID;

-- Create user-specific tables
CREATE TABLE IF NOT EXISTS user_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_name VARCHAR(255),
    product_name VARCHAR(255),
    amount DECIMAL(10,2),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    total_purchases DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE user_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS user_datasets_isolation ON user_datasets;
DROP POLICY IF EXISTS user_preferences_isolation ON user_preferences;
DROP POLICY IF EXISTS chat_history_isolation ON chat_history;
DROP POLICY IF EXISTS user_sales_isolation ON user_sales;
DROP POLICY IF EXISTS user_customers_isolation ON user_customers;

-- Create RLS Policies
CREATE POLICY user_datasets_isolation ON user_datasets
    USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY user_preferences_isolation ON user_preferences
    USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY chat_history_isolation ON chat_history
    USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY user_sales_isolation ON user_sales
    USING (user_id::text = current_setting('app.current_user_id', true));

CREATE POLICY user_customers_isolation ON user_customers
    USING (user_id::text = current_setting('app.current_user_id', true));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_datasets_user_id ON user_datasets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sales_user_id ON user_sales(user_id);
CREATE INDEX IF NOT EXISTS idx_user_customers_user_id ON user_customers(user_id);

-- Verify setup
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('user_datasets', 'user_preferences', 'chat_history', 'user_sales', 'user_customers');
