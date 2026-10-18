import { Router } from 'express';
import { submitInquiry } from '../controllers/contactController.js';
import { apiRateLimiter } from '../middleware/security.js';

const router = Router();

router.post('/', apiRateLimiter, submitInquiry);

export default router;
