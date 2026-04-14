import mongoose from 'mongoose';

const CancelledBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'Cancelled',
  },
  cancellationDate: {
    type: Date,
    default: Date.now,
  },
  noOfRooms: {
    type: Number,
    required: true,
  },
  noOfGuests: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    default: null, // Optional: you can include a cancellation reason field
  },
});

const CancelledBooking = mongoose.model('CancelledBooking', CancelledBookingSchema);

export default CancelledBooking;
