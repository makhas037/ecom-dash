-- Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'general', -- general, chart, analytics, troubleshooting
    metadata JSONB, -- Store chart data, preferences, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light', -- light, dark
    default_chart_type VARCHAR(20) DEFAULT 'line', -- line, bar, pie
    dashboard_layout JSONB, -- Custom dashboard settings
    ai_response_style VARCHAR(20) DEFAULT 'detailed', -- concise, detailed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Datasets (Custom saved queries/datasets)
CREATE TABLE IF NOT EXISTS user_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dataset_name VARCHAR(255) NOT NULL,
    description TEXT,
    query_config JSONB NOT NULL, -- Store query parameters
    data_snapshot JSONB, -- Cached data if needed
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_chat_history_user ON chat_history(user_id, created_at DESC);
CREATE INDEX idx_chat_history_type ON chat_history(message_type);
CREATE INDEX idx_user_datasets_user ON user_datasets(user_id);
