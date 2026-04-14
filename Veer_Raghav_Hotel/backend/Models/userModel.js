import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
      default: false
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
      required: false, // Optional, as some users might not provide an address
      trim: true, // Automatically trims spaces before/after the string
    },
    //testtttt
    resetToken: String,
    resetTokenExpiry: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// userSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

const User = mongoose.model('User', userSchema);
export default User;
