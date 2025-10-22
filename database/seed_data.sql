-- Insert sample users
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@salesradar.com', '$2a$10$YourHashedPasswordHere', 'admin'),
('Alex Jerome', 'alex@salesradar.com', '$2a$10$YourHashedPasswordHere', 'user');

-- Insert sample customers
INSERT INTO customers (name, email, phone, address, city, country) VALUES
('Pisang Kepok', 'pisang@example.com', '+1234567890', '123 Main St', 'New York', 'USA'),
('Vanessa Black', 'vanessa@example.com', '+1234567891', '456 Oak Ave', 'Los Angeles', 'USA'),
('Alison Butler', 'alison@example.com', '+1234567892', '789 Pine Rd', 'Chicago', 'USA'),
('Adam Alsop', 'adam@example.com', '+1234567893', '321 Elm St', 'Houston', 'USA');

-- Insert sample products
INSERT INTO products (name, description, category, price, cost, stock_quantity, sku) VALUES
('Premium Widget', 'High-quality widget', 'Electronics', 99.99, 50.00, 100, 'WDG-001'),
('Standard Gadget', 'Standard gadget', 'Electronics', 49.99, 25.00, 200, 'GDG-001'),
('Deluxe Tool', 'Professional tool', 'Tools', 149.99, 75.00, 50, 'TL-001'),
('Basic Supply', 'Essential supply', 'Supplies', 29.99, 15.00, 500, 'SUP-001');

-- Insert sample sales (last 30 days)
INSERT INTO sales (customer_id, total_amount, profit, status, payment_method, country, city, created_at)
SELECT 
    (SELECT id FROM customers ORDER BY RANDOM() LIMIT 1),
    (RANDOM() * 500 + 50)::DECIMAL(10,2),
    (RANDOM() * 200 + 20)::DECIMAL(10,2),
    CASE WHEN RANDOM() < 0.8 THEN 'completed' WHEN RANDOM() < 0.9 THEN 'pending' ELSE 'cancelled' END,
    CASE WHEN RANDOM() < 0.5 THEN 'credit_card' ELSE 'paypal' END,
    CASE WHEN RANDOM() < 0.3 THEN 'USA' WHEN RANDOM() < 0.6 THEN 'Australia' ELSE 'Italy' END,
    'Sample City',
    CURRENT_TIMESTAMP - (RANDOM() * INTERVAL '30 days')
FROM generate_series(1, 100);
