import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Premium', 'Super Deluxe', 'Deluxe'],
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  DiscountedPrice: {
    type: Number,
    required: false, // Make it optional
    default: 0, // Optional fallback to 0
  },
  amenities: [{
    category: {
      type: String,
      required: true,
      enum: [
        'No of Bed',
        'No of Washroom',
        'Popular Amenities',
        'Basic Facilities',
        'Transfers',
        'Safety and Security',
        'Health and Wellness',
        'Common Area'
      ],
    },
    items: [{
      name: {
        type: String,
        required: true, // Name of the amenity (e.g., "King Size Bed", "Free Wi-Fi")
      },
      quantity: {
        type: Number,
        default: 1, // The quantity of the amenity (e.g., 1 for a King Size Bed)
      },
    }],
    description: {
      type: String,
      default: '', // Any additional description for the category
    },
  }],
  description: {
    type: String,
    default: 'No description available',
  },
  maxOccupancy: {
    type: Number,
    required: true,
  },
  images: {
    type: [String], // Array to store image paths
    default: [],
  },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
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
  totaltax:{
    type:Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true, // Default value is true, indicating the room is available
  },
  totalSlots: {
    type: Number,
    required: true,
    default: 10, // Default number of total slots available for booking (can be any number)
  },
  bookedSlots: {
    type: Number,
    required: true,
    default: 0, // Default to 0 booked slots, as no bookings are made initially
  },
  availableSlots: {
    type: Number,
    required: true,
    default: 10, // This is initially set to the same as totalSlots
  },
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
