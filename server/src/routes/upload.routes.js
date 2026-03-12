import { Router } from 'express';
import { uploadImages, deleteImage } from '../controllers/upload.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/', authenticate, authorize('admin'), upload.array('images', 5), uploadImages);
router.delete('/', authenticate, authorize('admin'), deleteImage);

export default router;
