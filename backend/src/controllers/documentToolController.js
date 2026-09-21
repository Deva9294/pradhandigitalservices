import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const { mkdir, unlink } = fs;

export const jpgToPdf = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);
  
  // Validate file type
  if (!req.file.mimetype.startsWith('image/')) {
    throw new AppError('Only image files are supported', 400);
  }

  // Create temp directory
  const tempDir = path.join(os.tmpdir(), `pds-doc-tools-${Date.now()}`);
  await mkdir(tempDir, { recursive: true });

  const inputPath = req.file.path;
  const outputPath = path.join(tempDir, 'output.pdf');

  try {
    // Using ImageMagick for conversion (install separately)
    // For production, consider using Sharp or browser-based libraries
    await new Promise((resolve, reject) => {
      exec(`convert "${inputPath}" "${outputPath}"`, (error) => {
        if (error) reject(error);
        resolve(outputPath);
      });
    });

    // Read the PDF file
    const pdfBuffer = await fs.readFile(outputPath);

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
    res.send(pdfBuffer);

  } finally {
    // Cleanup temp files
    try {
      await unlink(inputPath);
      await unlink(outputPath);
      await fs.rmdir(tempDir);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
});

export const pdfMerge = catchAsync(async (req, res) => {
  if (!req.files || req.files.length < 2) {
    throw new AppError('At least 2 PDF files are required', 400);
  }

  // Validate all files are PDFs
  for (const file of req.files) {
    if (file.mimetype !== 'application/pdf') {
      throw new AppError('Only PDF files are supported', 400);
    }
  }

  const tempDir = path.join(os.tmpdir(), `pds-doc-tools-${Date.now()}`);
  await mkdir(tempDir, { recursive: true });

  const outputPath = path.join(tempDir, 'merged.pdf');

  try {
    // Using Ghostscript or PDFtk for merging
    // For production, consider using PDF-lib or browser-based libraries
    const inputPaths = req.files.map(f => f.path).join(' ');
    
    await new Promise((resolve, reject) => {
      exec(`pdftk ${inputPaths} cat output "${outputPath}"`, (error) => {
        if (error) reject(error);
        resolve(outputPath);
      });
    });

    const pdfBuffer = await fs.readFile(outputPath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
    res.send(pdfBuffer);

  } finally {
    // Cleanup
    try {
      for (const file of req.files) {
        await unlink(file.path);
      }
      await unlink(outputPath);
      await fs.rmdir(tempDir);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
});

export const pdfSplit = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);
  if (req.file.mimetype !== 'application/pdf') {
    throw new AppError('Only PDF files are supported', 400);
  }

  const { pages } = req.body;
  if (!pages) throw new AppError('Pages parameter is required', 400);

  const tempDir = path.join(os.tmpdir(), `pds-doc-tools-${Date.now()}`);
  await mkdir(tempDir, { recursive: true });

  try {
    // Implementation would use PDFtk split
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'PDF split functionality requires PDFtk installation',
      note: 'This is a placeholder. In production, install PDFtk and implement actual splitting logic.'
    });
  } finally {
    await unlink(req.file.path);
    await fs.rmdir(tempDir);
  }
});

export const compressPdf = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);
  if (req.file.mimetype !== 'application/pdf') {
    throw new AppError('Only PDF files are supported', 400);
  }

  const { quality = 'medium' } = req.body;

  try {
    // Implementation would use Ghostscript
    res.json({
      success: true,
      message: 'PDF compression requires Ghostscript installation',
      note: 'This is a placeholder. In production, install Ghostscript and implement actual compression logic.'
    });
  } finally {
    await unlink(req.file.path);
  }
});

export const resizePhoto = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);
  if (!req.file.mimetype.startsWith('image/')) {
    throw new AppError('Only image files are supported', 400);
  }

  const { width, height, type = 'passport' } = req.body;

  const tempDir = path.join(os.tmpdir(), `pds-doc-tools-${Date.now()}`);
  await mkdir(tempDir, { recursive: true });

  const outputPath = path.join(tempDir, `resized_${type}.jpg`);

  try {
    // Standard dimensions
    const dimensions = {
      passport: { width: 350, height: 450 },
      aadhaar: { width: 200, height: 200 },
      signature: { width: 200, height: 100 }
    };

    const dims = dimensions[type] || dimensions.passport;
    const targetWidth = width || dims.width;
    const targetHeight = height || dims.height;

    await new Promise((resolve, reject) => {
      exec(`convert "${req.file.path}" -resize ${targetWidth}x${targetHeight}! "${outputPath}"`, (error) => {
        if (error) reject(error);
        resolve(outputPath);
      });
    });

    const imageBuffer = await fs.readFile(outputPath);

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="resized_${type}.jpg"`);
    res.send(imageBuffer);

  } finally {
    await unlink(req.file.path);
    await unlink(outputPath);
    await fs.rmdir(tempDir);
  }
});

export const removeBackground = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);
  if (!req.file.mimetype.startsWith('image/')) {
    throw new AppError('Only image files are supported', 400);
  }

  try {
    // Background removal requires AI services like remove.bg or similar
    // For now, return a placeholder
    res.json({
      success: true,
      message: 'Background removal requires AI service integration',
      note: 'This is a placeholder. In production, integrate remove.bg or similar service.'
    });
  } finally {
    await unlink(req.file.path);
  }
});

export const cropSignature = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);
  if (!req.file.mimetype.startsWith('image/')) {
    throw new AppError('Only image files are supported', 400);
  }

  const { width = 200, height = 100 } = req.body;

  const tempDir = path.join(os.tmpdir(), `pds-doc-tools-${Date.now()}`);
  await mkdir(tempDir, { recursive: true });

  const outputPath = path.join(tempDir, 'signature_cropped.jpg');

  try {
    await new Promise((resolve, reject) => {
      exec(`convert "${req.file.path}" -gravity center -crop ${width}x${height}+0+0 "${outputPath}"`, (error) => {
        if (error) reject(error);
        resolve(outputPath);
      });
    });

    const imageBuffer = await fs.readFile(outputPath);

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition: 'attachment; filename="signature_cropped.jpg"');
    res.send(imageBuffer);

  } finally {
    await unlink(req.file.path);
    await unlink(outputPath);
    await fs.rmdir(tempDir);
  }
});

export const compressImage = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);
  if (!req.file.mimetype.startsWith('image/')) {
    throw new AppError('Only image files are supported', 400);
  }

  const { quality = 80 } = req.body;

  const tempDir = path.join(os.tmpdir(), `pds-doc-tools-${Date.now()}`);
  await mkdir(tempDir, { recursive: true });

  const outputPath = path.join(tempDir, 'compressed.jpg');

  try {
    await new Promise((resolve, reject) => {
      exec(`convert "${req.file.path}" -quality ${quality} "${outputPath}"`, (error) => {
        if (error) reject(error);
        resolve(outputPath);
      });
    });

    const imageBuffer = await fs.readFile(outputPath);

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="compressed.jpg"');
    res.send(imageBuffer);

  } finally {
    await unlink(req.file.path);
    await unlink(outputPath);
    await fs.rmdir(tempDir);
  }
});