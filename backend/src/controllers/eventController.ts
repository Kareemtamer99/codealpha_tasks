import { Request, Response } from 'express';
import Event from '../models/eventModel.js';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response) => {
  const events = await Event.find({}).populate('organizer', 'name email');
  res.json(events);
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email');

  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req: AuthRequest, res: Response) => {
  const { title, description, date, location, capacity } = req.body;

  const event = new Event({
    title,
    description,
    date,
    location,
    capacity,
    organizer: req.user._id,
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req: Request, res: Response) => {
  const { title, description, date, location, capacity } = req.body;

  const event = await Event.findById(req.params.id);

  if (event) {
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.capacity = capacity || event.capacity;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};
