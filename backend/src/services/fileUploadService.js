import path from 'path';
import fs from 'fs/promises';
import { createReadStream, existsSync } from 'fs';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecom_dash',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Makhas037@123*',
  max: 20,
});

export class FileUploadService {
  // Parse CSV file
  static async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }

  // Parse Excel file
  static async parseExcel(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json(worksheet);
    } catch (error) {
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
  }

  // Parse JSON file
  static async parseJSON(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON file: ${error.message}`);
    }
  }

  // Main parse function
  static async parseFile(filePath, filename) {
    const ext = path.extname(filename).toLowerCase();
    let data;

    switch (ext) {
      case '.csv':
        data = await this.parseCSV(filePath);
        break;
      case '.xlsx':
      case '.xls':
        data = await this.parseExcel(filePath);
        break;
      case '.json':
        data = await this.parseJSON(filePath);
        break;
      default:
        throw new Error('Unsupported file type');
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('File is empty or invalid format');
    }

    const columns = Object.keys(data[0]);
    const sampleData = data.slice(0, 10);

    return {
      data,
      columns,
      rowCount: data.length,
      columnCount: columns.length,
      sample: sampleData
    };
  }

  // Save dataset to database
  static async saveDataset(userId, file, parsedData) {
    const query = `
      INSERT INTO user_datasets (
        user_id, 
        dataset_name, 
        file_name, 
        file_type, 
        file_size,
        query_config,
        data_snapshot,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `;

    const queryConfig = {
      columns: parsedData.columns,
      rowCount: parsedData.rowCount,
      columnCount: parsedData.columnCount
    };

    const values = [
      userId,
      file.originalname,
      file.filename,
      file.mimetype,
      file.size,
      JSON.stringify(queryConfig),
      JSON.stringify(parsedData.data)
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Database save error:', error);
      throw new Error(`Failed to save dataset: ${error.message}`);
    }
  }

  // Get dataset with data
  static async getDatasetData(datasetId, userId) {
    const query = `
      SELECT * FROM user_datasets 
      WHERE id = $1 AND user_id = $2
    `;

    try {
      const result = await pool.query(query, [datasetId, userId]);
      
      if (result.rows.length === 0) {
        throw new Error('Dataset not found or access denied');
      }

      const dataset = result.rows[0];
      return {
        id: dataset.id,
        dataset_name: dataset.dataset_name,
        row_count: dataset.query_config?.rowCount || 0,
        column_count: dataset.query_config?.columnCount || 0,
        query_config: dataset.query_config,
        data: dataset.data_snapshot || [],
        preview: (dataset.data_snapshot || []).slice(0, 10)
      };
    } catch (error) {
      console.error('Get dataset error:', error);
      throw error;
    }
  }

  // Apply dataset
  static async applyDataset(datasetId, userId) {
    try {
      // First, unapply all other datasets for this user
      await pool.query(
        'UPDATE user_datasets SET is_applied = false WHERE user_id = $1',
        [userId]
      );

      // Then apply this dataset
      const result = await pool.query(
        `UPDATE user_datasets 
         SET is_applied = true, updated_at = NOW() 
         WHERE id = $1 AND user_id = $2 
         RETURNING *`,
        [datasetId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Dataset not found or access denied');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Apply dataset error:', error);
      throw error;
    }
  }

  // Delete dataset
  static async deleteDataset(datasetId, userId) {
    try {
      const result = await pool.query(
        'DELETE FROM user_datasets WHERE id = $1 AND user_id = $2 RETURNING *',
        [datasetId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Dataset not found or access denied');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Delete dataset error:', error);
      throw error;
    }
  }
}
