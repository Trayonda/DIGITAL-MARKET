import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

// Ensure uploads folder exists for local fallback
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `prod-${uniqueSuffix}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype.toLowerCase();

    if (allowed.test(ext) && (mime.includes('image/') || allowed.test(mime))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, WEBP, AVIF) are allowed'));
    }
  },
});

export const uploadImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'Please select at least one image file' });
      return;
    }

    const uploadedResults = [];

    // Check if Cloudinary is configured
    const useCloudinary = Boolean(env.CLOUDINARY.CLOUD_NAME && env.CLOUDINARY.API_KEY && env.CLOUDINARY.API_SECRET);

    for (const file of files) {
      if (useCloudinary) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'digital_market_products',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          });

          // Clean up local temp file after Cloudinary upload
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }

          uploadedResults.push({
            url: result.secure_url,
            publicId: result.public_id,
            filename: file.originalname,
          });
        } catch (cloudErr) {
          console.error('Cloudinary upload error, using local fallback:', cloudErr);
          uploadedResults.push({
            url: `/uploads/${file.filename}`,
            publicId: null,
            filename: file.originalname,
          });
        }
      } else {
        // Use local served file
        uploadedResults.push({
          url: `/uploads/${file.filename}`,
          publicId: null,
          filename: file.originalname,
        });
      }
    }

    res.json({
      success: true,
      message: `${uploadedResults.length} image(s) uploaded successfully`,
      data: uploadedResults,
    });
  } catch (error) {
    next(error);
  }
};
