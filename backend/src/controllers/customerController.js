import { pool } from '../config/db.js';
import logger from '../utils/logger.js';

export const customerController = {
  // Get all customers with pagination
  getAllCustomers: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (page - 1) * limit;

      const query = `
        SELECT 
          c.*,
          COUNT(s.id) as total_orders,
          COALESCE(SUM(s.total_amount), 0) as total_spent,
          MAX(s.created_at) as last_order_date
        FROM customers c
        LEFT JOIN sales s ON c.id = s.customer_id
        WHERE c.name ILIKE $1 OR c.email ILIKE $1
        GROUP BY c.id
        ORDER BY total_spent DESC
        LIMIT $2 OFFSET $3
      `;

      const countQuery = `
        SELECT COUNT(*) FROM customers 
        WHERE name ILIKE $1 OR email ILIKE $1
      `;

      const [customers, count] = await Promise.all([
        pool.query(query, [`%${search}%`, limit, offset]),
        pool.query(countQuery, [`%${search}%`])
      ]);

      res.json({
        customers: customers.rows,
        pagination: {
          total: parseInt(count.rows[0].count),
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count.rows[0].count / limit)
        }
      });
    } catch (error) {
      logger.error('Error fetching customers:', error);
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  },

  // Get customer by ID
  getCustomerById: async (req, res) => {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          c.*,
          COUNT(s.id) as total_orders,
          COALESCE(SUM(s.total_amount), 0) as total_spent,
          COALESCE(AVG(s.total_amount), 0) as avg_order_value,
          MAX(s.created_at) as last_order_date
        FROM customers c
        LEFT JOIN sales s ON c.id = s.customer_id
        WHERE c.id = $1
        GROUP BY c.id
      `;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Get recent orders
      const ordersQuery = `
        SELECT * FROM sales
        WHERE customer_id = $1
        ORDER BY created_at DESC
        LIMIT 10
      `;

      const orders = await pool.query(ordersQuery, [id]);

      res.json({
        customer: result.rows[0],
        recentOrders: orders.rows
      });
    } catch (error) {
      logger.error('Error fetching customer:', error);
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  },

  // Create customer
  createCustomer: async (req, res) => {
    try {
      const { name, email, phone, address, city, country } = req.body;

      const query = `
        INSERT INTO customers (name, email, phone, address, city, country)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const result = await pool.query(query, [name, email, phone, address, city, country]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      logger.error('Error creating customer:', error);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  },

  // Update customer
  updateCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, address, city, country } = req.body;

      const query = `
        UPDATE customers
        SET name = $1, email = $2, phone = $3, address = $4, city = $5, country = $6, updated_at = NOW()
        WHERE id = $7
        RETURNING *
      `;

      const result = await pool.query(query, [name, email, phone, address, city, country, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      logger.error('Error updating customer:', error);
      res.status(500).json({ error: 'Failed to update customer' });
    }
  }
};
