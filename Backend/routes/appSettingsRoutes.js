import express from 'express';
const router = express.Router()

import appSettingsController from '../controllers/appSettingsController.js'
import protect from '../middlewares/authMiddleware.js'

router.get('/', protect, appSettingsController.GetAppData);
router.patch('/', protect, appSettingsController.PostAppData);

export default router