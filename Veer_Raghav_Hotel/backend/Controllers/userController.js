// Update User Function
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import DeletedUser from "../Models/UserDelete.js";
import Booking from "../Models/Booking.js";
export const updateUser = async (req, res) => {
  const { name, email, phoneno, gender, age, address } = req.body;
  const userId = req.params.id; // The ID of the user to update, passed via URL parameter

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    // console.log(userId)
    // console.log(req.user.userId)
    // Ensure the logged-in user is the one requesting the update (if required)
    if (userId !== req.user.userId) {
      // Assuming req.userId comes from JWT authentication
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this account.",
      });
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneno) user.phoneno = phoneno;
    if (gender) user.gender = gender;
    if (age) user.age = age;
    if (address) user.address = address;

    // If password is provided, hash it
    // Save the updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: {
        name: user.name,
        email: user.email,
        phoneno: user.phoneno,
        gender: user.gender,
        age: user.age,
        address: user.address,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id; // The ID of the user to delete
  const loggedInUserId = req.user.userId; // The ID from the JWT token (authenticated user)
  const loggedInUserRole = req.user.role; // The role from the JWT token (e.g., user or admin)

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Authorization check: only the user themselves or an admin can delete an account
    if (userId !== loggedInUserId && loggedInUserRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this account.',
      });
    }

    // Store the deleted user information in the DeletedUser model
    const deletedUser = new DeletedUser({
      name: user.name,
      email: user.email,
      password: user.password, // If you are storing hashed passwords, ensure this is secure.
      age: user.age,
      IsBooking: user.IsBooking,
      gender: user.gender,
      role: user.role,
      phoneno: user.phoneno,
      address: user.address,
      reasonForDeletion: req.body.reasonForDeletion || 'No reason provided', // Optionally include reason from request
    });

    await deletedUser.save();

    // Delete the user from the User collection
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully and archived.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};
  export const GetAllUsers = async (req, res) => {
    try {
      const bookings = await User.find().select("-password");
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    }
  };
  export const getUserDetails = async (req, res) => {
    const userId = req.user.userId; // The ID of the user whose details are to be fetched
  // console.log(req.user)
  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Authorization check: Only allow users to access their own data or admins to access any user's data
    if (userId !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this account.",
      });
    }

    // Respond with the user's details
    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      user: {
        name: user.name,
        email: user.email,
        phoneno: user.phoneno,
        gender: user.gender,
        age: user.age,
        address: user.address,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const profile = async (req, res) => {
  const userId = req.user.userId;
  try {
    // Exclude the password field using the select method
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId; // Authenticated user ID from JWT token

  try {
    // Validate inputs
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both oldPassword and newPassword are required.",
      });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if the password exists
    if (!user.password) {
      return res.status(500).json({
        success: false,
        message: "Password is not set for this user.",
      });
    }

    // Verify the old password
    const isPasswordMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};


import moment from 'moment'; // Assuming the User model is defined and imported correctly

export const GetUserChange = async (req, res) => {
  try {
    // Get the current date and calculate the first and last date of the current month
    const currentDate = moment();
    const firstDayOfCurrentMonth = currentDate.startOf('month').toDate();
    const lastDayOfCurrentMonth = currentDate.endOf('month').toDate();

    // Get the first and last date of the previous month
    const firstDayOfLastMonth = currentDate
      .subtract(1, 'month')
      .startOf('month')
      .toDate();
    const lastDayOfLastMonth = currentDate
      // .subtract(1, 'month')
      .endOf('month')
      .toDate();

    // Fetch the number of users created in the current month
    const currentMonthUsersCount = await User.countDocuments({
      createdAt: { $gte: firstDayOfCurrentMonth, $lte: lastDayOfCurrentMonth },
    });

    // Fetch the number of users created in the previous month
    const lastMonthUsersCount = await User.countDocuments({
      createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
    });

    // Calculate the increase or decrease in user count
    const userChange = currentMonthUsersCount - lastMonthUsersCount;

    // Calculate percentage change
    let percentageChange = 0;
    if (lastMonthUsersCount > 0) {
      percentageChange = (userChange / lastMonthUsersCount) * 100;
    }

    // Determine whether it's an increase, decrease, or no change
    let changeStatus = 'No change';
    if (userChange > 0) {
      changeStatus = `Increased by ${userChange} users (${percentageChange.toFixed(2)}%)`;
    } else if (userChange < 0) {
      changeStatus = `Decreased by ${Math.abs(userChange)} users (${Math.abs(percentageChange).toFixed(2)}%)`;
    }

    res.status(200).json({
      success: true,
      message: `User change compared to last month.`,
      currentMonthUsersCount,
      lastMonthUsersCount,
      userChange,
      percentageChange: percentageChange.toFixed(2),
      changeStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while calculating user change.',
      error: error.message,
    });
  }
};

