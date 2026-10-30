import express from 'express';
import { heartbeat, liveCount } from '../controllers/visitorController.js';

const router = express.Router();
router.post('/heartbeat', heartbeat);
router.get('/live', liveCount);
export default router;
