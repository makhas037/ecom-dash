import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import csv from 'csv-parser';
import XLSX from 'xlsx';
import { createReadStream } from 'fs';
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.xlsx', '.xls', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, Excel, and JSON files are allowed.'));
    }
  }
});

export class FileUploadService {
  // Parse CSV file
  static async parseCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve({
            data: results,
            rowCount: results.length,
            columnCount: results.length > 0 ? Object.keys(results[0]).length : 0,
            columns: results.length > 0 ? Object.keys(results[0]) : []
          });
        })
        .on('error', reject);
    });
  }

  // Parse Excel file
  static async parseExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return {
      data: data,
      rowCount: data.length,
      columnCount: data.length > 0 ? Object.keys(data[0]).length : 0,
      columns: data.length > 0 ? Object.keys(data[0]) : []
    };
  }

  // Parse JSON file
  static async parseJSON(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    const dataArray = Array.isArray(data) ? data : [data];
    
    return {
      data: dataArray,
      rowCount: dataArray.length,
      columnCount: dataArray.length > 0 ? Object.keys(dataArray[0]).length : 0,
      columns: dataArray.length > 0 ? Object.keys(dataArray[0]) : []
    };
  }

  // Main parse function
  static async parseFile(filePath, fileType) {
    const ext = path.extname(fileType).toLowerCase();
    
    if (ext === '.csv') {
      return await this.parseCSV(filePath);
    } else if (ext === '.xlsx' || ext === '.xls') {
      return await this.parseExcel(filePath);
    } else if (ext === '.json') {
      return await this.parseJSON(filePath);
    }
    
    throw new Error('Unsupported file type');
  }

  // Save dataset to database
  static async saveDataset(userId, file, parsedData) {
    const query = `
      INSERT INTO user_datasets (
        user_id, dataset_name, description, file_name, file_size,
        file_type, file_path, row_count, column_count, query_config, data_snapshot
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      userId,
      file.originalname,
      `Uploaded ${file.originalname}`,
      file.filename,
      file.size,
      file.mimetype,
      file.path,
      parsedData.rowCount,
      parsedData.columnCount,
      JSON.stringify({ columns: parsedData.columns }),
      JSON.stringify(parsedData.data.slice(0, 100)) // Store first 100 rows
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get dataset data
  static async getDatasetData(datasetId, userId) {
    const query = 'SELECT * FROM user_datasets WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [datasetId, userId]);
    
    if (result.rows.length === 0) {
      throw new Error('Dataset not found');
    }

    const dataset = result.rows[0];
    const parsedData = await this.parseFile(dataset.file_path, dataset.file_name);
    
    return {
      ...dataset,
      data: parsedData.data,
      preview: parsedData.data.slice(0, 10)
    };
  }

  // Apply dataset (mark as active)
  static async applyDataset(datasetId, userId) {
    // First, unmark all datasets as applied
    await pool.query('UPDATE user_datasets SET is_applied = false WHERE user_id = $1', [userId]);
    
    // Mark this dataset as applied
    const query = `
      UPDATE user_datasets
      SET is_applied = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [datasetId, userId]);
    return result.rows[0];
  }

  // Delete dataset and file
  static async deleteDataset(datasetId, userId) {
    const dataset = await pool.query(
      'SELECT file_path FROM user_datasets WHERE id = $1 AND user_id = $2',
      [datasetId, userId]
    );

    if (dataset.rows.length > 0) {
      try {
        await fs.unlink(dataset.rows[0].file_path);
      } catch (err) {
        console.error('File deletion error:', err);
      }
    }

    await pool.query('DELETE FROM user_datasets WHERE id = $1 AND user_id = $2', [datasetId, userId]);
  }
}
