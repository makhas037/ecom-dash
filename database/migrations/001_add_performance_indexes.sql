-- Performance Indexes for E-Commerce Dashboard

-- Sales table indexes
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_product_id ON sales(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sales_date_customer ON sales(sale_date, customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_date_product ON sales(sale_date, product_id);

-- Customer table indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_last_purchase ON customers(last_purchase);

-- Product table indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Analyze tables for query optimization
ANALYZE sales;
ANALYZE customers;
ANALYZE products;
