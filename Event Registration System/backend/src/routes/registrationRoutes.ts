import express from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getAllRegistrations,
} from '../controllers/registrationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, registerForEvent).get(protect, admin, getAllRegistrations);
router.route('/me').get(protect, getMyRegistrations);
router.route('/:id/cancel').patch(protect, cancelRegistration);

export default router;
