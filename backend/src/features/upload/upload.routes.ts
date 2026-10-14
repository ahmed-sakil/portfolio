import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../../core/config';
import { authenticateAdmin } from '../../core/auth.middleware';

const router = Router();

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Configure memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// POST /api/upload (Admin only)
router.post('/', authenticateAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file uploaded' });
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'portfolio',
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error);
          res.status(500).json({ message: 'Upload to Cloudinary failed', error });
          return;
        }

        res.json({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'File upload failed' });
  }
});

export const uploadRoutes = router;
