import mongoose from "mongoose";

const { Schema } = mongoose;

const RoomAvailabilitySchema = new Schema({
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  availableSlots: {
    type: Number,
    required: true,
    min: 0
  },
  // For tracking price variations on specific dates
  specialPrice: {
    type: Number,
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create compound index for efficient querying
RoomAvailabilitySchema.index({ room: 1, date: 1 }, { unique: true });

// Create the model
const RoomAvailability = mongoose.model('RoomAvailability', RoomAvailabilitySchema);

export default RoomAvailability;
