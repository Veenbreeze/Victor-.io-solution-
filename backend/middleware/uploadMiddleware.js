import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, 'uploads/'),
  filename: (_req, file, callback) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${unique}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(new Error('Only image uploads are allowed'));
    }
    return callback(null, true);
  }
});
