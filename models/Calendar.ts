import mongoose from 'mongoose';

const CalendarEventSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  countryCode: { type: String, required: true },
});

export const CalendarEvent = mongoose.model(
  'CalendarEvent',
  CalendarEventSchema,
);
