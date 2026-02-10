import { Router } from "express";
const router = Router();

import protect from "../middlewares/authMiddleware.js";
// import videoController from "../controllers/videoController.js";
import mediaController from "../controllers/mediaController.js";


router.post('/assign-key', protect, mediaController.assignKey);
router.post('/upload', protect, mediaController.uploadVideo);

router.patch('/', mediaController.transferLocation);

// router.get('/:id', protect, videoController.getVideo);

// router.delete('/:id', protect, videoController.deleteVideo);


export default router;

