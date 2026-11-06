import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    const extension = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
    if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(extension)) {
      return cb(null, true);
    }
    cb(new Error('Only JPG, PNG, PDF, DOC and DOCX files are allowed.'));
  }
});

function requireCloudinary(res) {
  if (!cloudinaryConfigured) {
    res.status(503).json({
      success: false,
      message: 'Secure document storage is not configured. Please contact support; no file was stored.'
    });
    return false;
  }
  return true;
}

function storeInCloudinary(file) {
  return new Promise((resolve, reject) => {
    const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';
    const stream = cloudinary.v2.uploader.upload_stream({
      folder: 'pradhan-digital-services/documents',
      resource_type: resourceType,
      use_filename: false,
      unique_filename: true
    }, (error, result) => {
      if (error) return reject(error);
      if (!result?.secure_url) return reject(new Error('Cloud storage did not return a secure file URL.'));
      resolve({
        fileUrl: result.secure_url,
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        storageId: result.public_id
      });
    });
    stream.end(file.buffer);
  });
}

// All uploads require an authenticated account and durable cloud storage.
router.post('/', protect, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  if (!requireCloudinary(res)) return;
  const stored = await storeInCloudinary(req.file);
  res.status(201).json({ success: true, message: 'File uploaded securely.', ...stored });
}));

router.post('/multiple', protect, upload.array('files', 5), asyncHandler(async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ success: false, message: 'No files uploaded.' });
  if (!requireCloudinary(res)) return;
  const storedFiles = await Promise.all(req.files.map(storeInCloudinary));
  res.status(201).json({
    success: true,
    message: 'Files uploaded securely.',
    files: storedFiles,
    fileUrls: storedFiles.map(file => file.fileUrl),
    count: storedFiles.length
  });
}));

export default router;
