import mongoose from "mongoose";
import validator from "validator";

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    // required: true,
  },
  contactNumbers: {
    type: [String], // Array of strings
    // required: true,
  },
  checkInTime: {
    type: String, // Time format like "HH:mm"
    // required: true,
  },
  checkOutTime: {
    type: String, // Time format like "HH:mm"
    // required: true,
  },
  logo: {
    type: String,
  },
  foodAndDining: {
    mealOptionsProvided: {
      type: Boolean,
      default: true,
    },
    mealsOffered: {
      type: [String],
      default: ["Breakfast", "Lunch", "Dinner"],
    },
    vegetarianOnly: {
      type: Boolean,
      default: true,
    },
    cuisinesAvailable: {
      type: [String],
      default: ["Local", "South Indian", "North Indian", "Chinese"],
    },
    mealChargesApprox: {
      type: String,
      default: "INR 200 per person per meal",
    },
    outsideFoodAllowed: {
      type: Boolean,
      default: true,
    },
  },
  hostDetails: {
    hostName: {
      type: String,
      default: "Ankur",
    },
    hostingSince: {
      type: String,
      default: "2024",
    },
    speaks: {
      type: [String],
      default: ["English", "Hindi"],
    },
    responseTime: {
      type: String,
      default: "within 24 hours",
    },
    description: {
      type: String,
      default:
        "Ankur is an affable person and loves hosting guests from various corners of the world. Besides hosting, Ankur likes travelling, listening to music, reading, and playing sports.",
    },
  },
  Email: {
    type: String,
    // required: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
      'Please enter a valid email address'
    ],
    validate: {
      validator: validator.isEmail,
      message: 'Please enter a valid email address'
    },
  },
  caretakerDetails: {
    available: {
      type: Boolean,
      default: true,
    },
    responsibilities: {
      type: [String],
      default: [
        "Cleaning kitchen/utensils",
        "Cab bookings",
        "Car/bike rentals",
        "Gardening",
        "Help buying groceries",
        "Restaurant reservations",
        "Pick up and Drop services",
      ],
    },
  },
});

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
