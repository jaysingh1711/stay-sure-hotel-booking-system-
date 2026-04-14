import mongoose from "mongoose";
import validator from "validator";

const deletedUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: 18,
    },
    IsBooking: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'other'],
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phoneno: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Simple phone number validation
        },
        message: props => `${props.value} is not a valid phone number!`,
      },
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    deletedAt: {
      type: Date,
      required: true,
      default: Date.now, // Automatically set deletion timestamp
    },
    reasonForDeletion: {
      type: String,
      required: false, // Optional field to store reason for deletion
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields for historical tracking
  }
);

const DeletedUser = mongoose.model('DeletedUser', deletedUserSchema);
export default DeletedUser;
