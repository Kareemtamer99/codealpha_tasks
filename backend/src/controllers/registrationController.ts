import { Request, Response } from 'express';
import Registration from '../models/registrationModel.js';
import Event from '../models/eventModel.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private
export const registerForEvent = async (req: AuthRequest, res: Response) => {
  const { eventId } = req.body;

  const event = await Event.findById(eventId);

  if (!event) {
    res.status(404).json({ message: 'Event not found' });
    return;
  }

  // Check if already registered
  const alreadyRegistered = await Registration.findOne({
    user: req.user._id,
    event: eventId,
  });

  if (alreadyRegistered) {
    if (alreadyRegistered.status === 'Confirmed') {
      res.status(400).json({ message: 'Already registered for this event' });
      return;
    } else {
      // Re-confirm if it was cancelled
      alreadyRegistered.status = 'Confirmed';
      const updatedRegistration = await alreadyRegistered.save();
      res.json(updatedRegistration);
      return;
    }
  }

  // Check capacity (simplified)
  const count = await Registration.countDocuments({ event: eventId, status: 'Confirmed' });
  if (count >= event.capacity) {
    res.status(400).json({ message: 'Event is full' });
    return;
  }

  const registration = new Registration({
    user: req.user._id,
    event: eventId,
  });

  const createdRegistration = await registration.save();
  res.status(201).json(createdRegistration);
};

// @desc    Get user's registrations
// @route   GET /api/registrations/me
// @access  Private
export const getMyRegistrations = async (req: AuthRequest, res: Response) => {
  const registrations = await Registration.find({ user: req.user._id }).populate('event');
  res.json(registrations);
};

// @desc    Cancel a registration
// @route   PATCH /api/registrations/:id/cancel
// @access  Private
export const cancelRegistration = async (req: AuthRequest, res: Response) => {
  const registration = await Registration.findById(req.params.id);

  if (registration) {
    // Check ownership
    if (registration.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    registration.status = 'Cancelled';
    const updatedRegistration = await registration.save();
    res.json(updatedRegistration);
  } else {
    res.status(404).json({ message: 'Registration not found' });
  }
};

// @desc    Get all registrations (Admin only)
// @route   GET /api/registrations
// @access  Private/Admin
export const getAllRegistrations = async (req: Request, res: Response) => {
  const registrations = await Registration.find({}).populate('user', 'name email').populate('event', 'title date');
  res.json(registrations);
};
