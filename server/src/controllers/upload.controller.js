import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Upload images to Cloudinary.
 * Accepts single or multiple files via multer.
 */
export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'No images provided');
  }

  const uploadPromises = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'padcare/products',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      stream.end(file.buffer);
    });
  });

  const images = await Promise.all(uploadPromises);
  res.status(200).json(new ApiResponse(200, images, 'Images uploaded'));
});

/**
 * Delete an image from Cloudinary.
 */
export const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw new ApiError(400, 'Public ID is required');

  await cloudinary.uploader.destroy(publicId);
  res.status(200).json(new ApiResponse(200, null, 'Image deleted'));
});
