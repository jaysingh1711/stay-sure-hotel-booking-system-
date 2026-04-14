import mongoose from "mongoose";
import { type } from "os";

const bookingSchema = new mongoose.Schema({

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
  totaltax:{
    type:Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  noofguests: {
    type: Number,
    required: true,
    min: 1, // Minimum one guest required
  },
  noofchildrens: {
    type: Number,
    default: 0, // Default to 0 if not provided
    min: 0, // No negative values
  },
  noOfRooms:{
    type:Number,
    },
    taxes: {
      vat: {
        type: Number, // VAT percentage
        default: 0,
      },
      serviceTax: {
        type: Number, // Service tax percentage
        default: 0,
      },
      other: {
        type: Number, // Any other tax
        default: 0,
      },
    },
}, 
{
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

  // const Booking= mongoose.model('Booking', bookingSchema);
  // export default Booking;
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
