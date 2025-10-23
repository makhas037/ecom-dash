import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getUserUploadDir(userId) {
  const userDir = path.join(__dirname, '..', 'uploads', userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  return userDir;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId || req.user?.id;
    if (!userId) {
      return cb(new Error('User not authenticated'), null);
    }
    const userUploadDir = getUserUploadDir(userId);
    cb(null, userUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv', '.json', '.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, JSON, and XLSX files are allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

export function getUserFilePath(userId, filename) {
  return path.join(__dirname, '..', 'uploads', userId, filename);
}

export function deleteUserFile(userId, filename) {
  try {
    const filePath = getUserFilePath(userId, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Delete file error:', error);
    return false;
  }
}
