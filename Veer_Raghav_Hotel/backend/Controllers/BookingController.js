import Booking from "../Models/Booking.js";
import Room from "../Models/Room.js";
import User from "../Models/userModel.js";
import mongoose from "mongoose";
import RoomAvailability from "../Models/RoomAvailable.js";
import {sendBookingConfirmation, sendCancellationConfirmation} from "./auth.js";
// import sendBookingConfirmation from "./auth.js";

export const CreateBooking = async (req, res) => {
  const {
    userId,
    roomId,
    checkInDate,
    checkOutDate,
    noofguests,
    noOfRooms = 1,
    noofchildrens = 1, // Default to 1 if not provided
  } = req.body;

  try {
    // Validate number of guests
    if (!Number.isInteger(noofguests) || noofguests <= 0) {
      return res.status(400).json({ message: "Number of guests must be a positive integer." });
    }

    // Validate check-in and check-out dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn) || isNaN(checkOut)) {
      return res.status(400).json({ message: "Invalid check-in or check-out date." });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: "Check-out date must be after the check-in date." });
    }

    // Fetch room details
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    // Check for conflicting bookings in the requested date range
    const conflictingBookings = await Booking.find({
      room: roomId,
      checkInDate: { $lt: checkOut }, // Overlaps with requested check-out date
      checkOutDate: { $gt: checkIn }, // Overlaps with requested check-in date
    });

    let availableSlots = room.totalSlots; // Start with the total slots of the room

    conflictingBookings.forEach((booking) => {
      availableSlots -= booking.noOfRooms;
    });

    if (availableSlots < noOfRooms) {
      return res.status(400).json({
        message: `Only ${availableSlots} rooms are available for the selected dates.`,
        suggestion: "Please try selecting different dates or reducing the number of rooms.",
      });
    }

    // Calculate booking details
    const numberOfNights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    if (numberOfNights <= 0) {
      return res.status(400).json({ message: "Invalid booking dates." });
    }

    const pricePerRoom = room.DiscountedPrice > 0 ? room.DiscountedPrice : room.pricePerNight;
    const basePrice = pricePerRoom * numberOfNights * noOfRooms;

    const vatAmount = room.taxes?.vat ? (room.taxes.vat / 100) * basePrice : 0;
    const serviceTaxAmount = room.taxes?.serviceTax ? (room.taxes.serviceTax / 100) * basePrice : 0;
    const otherTaxAmount = room.taxes?.other ? (room.taxes.other / 100) * basePrice : 0;

    const totaltax = vatAmount + serviceTaxAmount + otherTaxAmount;
    const totalPrice = basePrice + totaltax;

    // Create booking
    const booking = new Booking({
      user: userId,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      noofguests,
      noOfRooms,
      taxes: {
        vat: vatAmount,
        serviceTax: serviceTaxAmount,
        other: otherTaxAmount,
      },
      totaltax,
      noofchildrens,
    });

    const savedBooking = await booking.save();

    // Update user booking status
    const user = await User.findById(userId);
    if (user) {
      await User.updateOne(
        { _id: userId },
        {
          $set: {
            IsBooking: true,
            currentBooking: savedBooking._id,
          },
        }
      );

      // Send email confirmation
      try {
        await sendBookingConfirmation({
          email: user.email,
          name: user.name,
          bookingId: savedBooking._id,
          service: room.name,
          checkInDate: savedBooking.checkInDate,
          checkOutDate: savedBooking.checkOutDate,
          totalPrice,
        });
      } catch (emailError) {
        console.error("Failed to send booking confirmation email:", emailError.message);
      }
    }

    res.status(201).json({
      message: "Booking created successfully.",
      bookingId: savedBooking._id,
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ message: "Failed to create booking.", error: error.message });
  }
};




export const UpdateBooking = async (req, res) => {
  const { id } = req.params;
  const { checkInDate, checkOutDate, roomId, noofguests ,noofchildrens} = req.body;

  try {
    // Validate and find existing booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Find the current room
    let room = await Room.findById(booking.room);
    if (!room) {
      return res.status(404).json({ message: "Current room not found" });
    }

    // Handle room change if requested
    if (roomId && roomId !== booking.room.toString()) {
      // Validate and find the new room
      const newRoom = await Room.findById(roomId);
      if (!newRoom) {
        return res.status(404).json({ message: "New room not found" });
      }
      if (!newRoom.isAvailable || newRoom.availableSlots < 1) {
        return res.status(400).json({ message: "New room is not available" });
      }

      // Update the availability of rooms
      // Handle room availability updates
      await Room.updateOne(
        { _id: booking.room },
        {
          $set: {
            isAvailable: room.availableSlots + 1 > 0, // Check availability before incrementing slots
          },
          $inc: { availableSlots: 1, bookedSlots: -1 },
        }
      );

      await Room.updateOne(
        { _id: roomId },
        {
          $set: {
            isAvailable: room.availableSlots - 1 > 0, // Check availability after decrementing slots
          },
          $inc: { availableSlots: -1, bookedSlots: 1 },
        }
      );

      room = newRoom;
      booking.room = roomId;
    }

    // Handle date changes if requested
    if (checkInDate || checkOutDate) {
      const startDate = new Date(checkInDate || booking.checkInDate);
      const endDate = new Date(checkOutDate || booking.checkOutDate);

      // Validate dates
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      if (startDate >= endDate) {
        return res
          .status(400)
          .json({ message: "Check-out date must be after check-in date" });
      }

      // Check for room availability on new dates
      const overlappingBooking = await Booking.findOne({
        room: roomId || booking.room,
        _id: { $ne: id }, // Exclude current booking from the check
        $or: [
          { checkInDate: { $lt: endDate }, checkOutDate: { $gt: startDate } },
        ],
      });

      if (overlappingBooking) {
        return res.status(400).json({
          message: "The room is not available for the selected dates",
          conflictingBooking: {
            checkIn: overlappingBooking.checkInDate,
            checkOut: overlappingBooking.checkOutDate,
          },
        });
      }

      // Calculate new price
      const numberOfNights = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      );
      const pricePerNight =
        room.DiscountedPrice > 0 ? room.DiscountedPrice : room.pricePerNight;
      const basePrice = pricePerNight * numberOfNights;

      // Calculate taxes
      const vatAmount = room.taxes?.vat
        ? (room.taxes.vat / 100) * basePrice
        : 0;
      const serviceTaxAmount = room.taxes?.serviceTax
        ? (room.taxes.serviceTax / 100) * basePrice
        : 0;
      const otherTaxAmount = room.taxes?.other
        ? (room.taxes.other / 100) * basePrice
        : 0;
      const totaltax = vatAmount + serviceTaxAmount + otherTaxAmount;

      // Update booking dates and price
      booking.checkInDate = startDate;
      booking.checkOutDate = endDate;
      booking.totalPrice = basePrice + totaltax;
      booking.taxes = {
        vat: vatAmount,
        serviceTax: serviceTaxAmount,
        other: otherTaxAmount,
      };
      booking.totaltax = totaltax;
      booking.noofchildrens=noofchildrens;
    }

    // Update guest numbers if requested
    if (noofguests !== undefined) {
      if (!Number.isInteger(noofguests) || noofguests <= 0) {
        return res
          .status(400)
          .json({ message: "Number of guests must be a positive integer" });
      }

      // Check if the number of guests exceeds the room's max occupancy
      if (noofguests > room.maxOccupancy) {
        return res
          .status(400)
          .json({ message: "Number of guests exceeds room's max occupancy" });
      }

      booking.noofguests = noofguests;
    }

    // Save updated booking
    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res
      .status(500)
      .json({ message: "Failed to update booking", error: error.message });
  }
};
export const GetRoomAvailability = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Validate roomId
    if (!id) {
      return res.status(400).json({ 
        message: "Room ID is required." 
      });
    }

    // Fetch room details
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ 
        message: "Room not found." 
      });
    }

 // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get date 6 months from now
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    sixMonthsFromNow.setHours(23, 59, 59, 999);

    // Get all bookings for this room in the next 6 months
    const bookings = await Booking.find({
      room: id,
      checkOutDate: { $gte: today },
      checkInDate: { $lte: sixMonthsFromNow }
    }).sort({ checkInDate: 1 });

    // Create array of dates for next 6 months
    const datesArray = [];
    const currentDate = new Date(today);
    
    while (currentDate <= sixMonthsFromNow) {
      datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate availability for each date
    const availability = datesArray.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      let bookedRooms = 0;

      // Count bookings for this specific date
      bookings.forEach(booking => {
        const bookingStart = new Date(booking.checkInDate);
        const bookingEnd = new Date(booking.checkOutDate);
        
        if (date >= bookingStart && date < bookingEnd) {
          bookedRooms += booking.noOfRooms;
        }
      });

      const availableSlots = room.totalSlots - bookedRooms;

      return {
        date: dateStr,
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        totalSlots: room.totalSlots,
        bookedSlots: bookedRooms,
        availableSlots: availableSlots,
        isAvailable: availableSlots > 0,
        priceForDay: getPriceForDay(room, date) // Helper function defined below
      };
    });

    // Calculate availability statistics
    const stats = {
      totalDays: availability.length,
      availableDays: availability.filter(day => day.isAvailable).length,
      fullyBookedDays: availability.filter(day => day.availableSlots === 0).length,
      averageAvailability: Math.round(
        availability.reduce((sum, day) => sum + day.availableSlots, 0) / availability.length
      )
    };

    res.status(200).json({
      message: "Room availability retrieved successfully",
      roomDetails: {
        name: room.name,
        totalSlots: room.totalSlots,
        basePrice: room.pricePerNight,
        discountedPrice: room.DiscountedPrice
      },
      stats,
      availability
    });

  } catch (error) {
    console.error("Error fetching room availability:", error.message);
    res.status(500).json({ 
      message: "Failed to fetch room availability.", 
      error: error.message 
    });
  }
};

// Helper function to get price for specific day
const getPriceForDay = (room, date) => {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday or Saturday

  let basePrice = room.DiscountedPrice > 0 ? room.DiscountedPrice : room.pricePerNight;
  
  // Apply weekend pricing if applicable
  if (isWeekend && room.weekendPricing) {
    basePrice = room.weekendPricing;
  }

  return basePrice;
};
export const UpdateBookingForAdmin = async (req, res) => {
  const { id } = req.params;
  const { checkInDate, checkOutDate, status, roomId, noofguests ,noofchildrens} = req.body;

  try {
    // Validate and find existing booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You do not have permission to update the booking" });
    }

    // Handle status update if provided
    if (status) {
      const validStatuses = ["Confirmed", "Cancelled", "Pending"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid booking status" });
      }
      booking.status = status;
    }

    // Find the current room
    let room = await Room.findById(booking.room);
    if (!room) {
      return res.status(404).json({ message: "Current room not found" });
    }

    // Handle room change if requested
    if (roomId && roomId !== booking.room.toString()) {
      // Validate and find new room
      const newRoom = await Room.findById(roomId);
      if (!newRoom) {
        return res.status(404).json({ message: "New room not found" });
      }
      if (!newRoom.isAvailable || newRoom.availableSlots < 1) {
        return res.status(400).json({ message: "New room is not available" });
      }

      // Update the availability of rooms
      // Handle room availability updates
      await Room.updateOne(
        { _id: booking.room },
        {
          $set: {
            isAvailable: room.availableSlots + 1 > 0, // Check availability before incrementing slots
          },
          $inc: { availableSlots: 1, bookedSlots: -1 },
        }
      );

      await Room.updateOne(
        { _id: roomId },
        {
          $set: {
            isAvailable: room.availableSlots - 1 > 0, // Check availability after decrementing slots
          },
          $inc: { availableSlots: -1, bookedSlots: 1 },
        }
      );

      room = newRoom;
      booking.room = roomId;
    }

    // Handle date changes if requested
    if (checkInDate || checkOutDate) {
      const startDate = new Date(checkInDate || booking.checkInDate);
      const endDate = new Date(checkOutDate || booking.checkOutDate);

      // Validate dates
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      if (startDate >= endDate) {
        return res
          .status(400)
          .json({ message: "Check-out date must be after check-in date" });
      }

      // Check for room availability on new dates
      const overlappingBooking = await Booking.findOne({
        room: roomId || booking.room,
        _id: { $ne: id }, // Exclude current booking from the check
        $or: [
          { checkInDate: { $lt: endDate }, checkOutDate: { $gt: startDate } },
        ],
      });

      if (overlappingBooking) {
        return res.status(400).json({
          message: "The room is not available for the selected dates",
          conflictingBooking: {
            checkIn: overlappingBooking.checkInDate,
            checkOut: overlappingBooking.checkOutDate,
          },
        });
      }

      // Calculate new price
      const numberOfNights = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      );
      const pricePerNight =
        room.DiscountedPrice > 0 ? room.DiscountedPrice : room.pricePerNight;
      const basePrice = pricePerNight * numberOfNights;

      // Calculate taxes
      const vatAmount = room.taxes?.vat
        ? (room.taxes.vat / 100) * basePrice
        : 0;
      const serviceTaxAmount = room.taxes?.serviceTax
        ? (room.taxes.serviceTax / 100) * basePrice
        : 0;
      const otherTaxAmount = room.taxes?.other
        ? (room.taxes.other / 100) * basePrice
        : 0;
      const totaltax = vatAmount + serviceTaxAmount + otherTaxAmount;

      // Update booking dates and price
      booking.checkInDate = startDate;
      booking.checkOutDate = endDate;
      booking.totalPrice = basePrice + totaltax;
      booking.taxes = {
        vat: vatAmount,
        serviceTax: serviceTaxAmount,
        other: otherTaxAmount,
      };
      booking.totaltax = totaltax;
      booking.noofchildrens=noofchildrens
    }

    // Update guest numbers if requested
    if (noofguests !== undefined) {
      if (!Number.isInteger(noofguests) || noofguests <= 0) {
        return res
          .status(400)
          .json({ message: "Number of guests must be a positive integer" });
      }

      // Check if the number of guests exceeds the room's max occupancy
      if (noofguests > room.maxOccupancy) {
        return res
          .status(400)
          .json({ message: "Number of guests exceeds room's max occupancy" });
      }

      booking.noofguests = noofguests;
    }

    // Save updated booking
    const updatedBooking = await booking.save();

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res
      .status(500)
      .json({ message: "Failed to update booking", error: error.message });
  }
};

export const UpdateForAdmin = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Fetch the booking by ID
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You do not have permission to update the booking" });
    }

    // Validate and update the status
    if (status) {
      const validStatuses = ["Confirmed", "Cancelled", "Pending"]; // Add other statuses as needed
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid booking status" });
      }
      booking.status = status; // Update the status
    } else {
      return res.status(400).json({ message: "Status is required" });
    }

    // Save the updated booking
    const updatedBooking = await booking.save();
    res
      .status(200)
      .json({
        message: "Booking status updated successfully",
        booking: updatedBooking,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update booking", error: error.message });
  }
};

// Get all bookings
export const GetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({ path: "user", select: "-password" })
      .populate("room");
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// Get a booking by ID
export const GetBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: "user", select: "-password" })
      .populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch booking", error: error.message });
  }
};
export const GetUserBookingsById = async (req, res) => {
  try {
    const userId = req.params.id; // Extract userId from the request parameters

    // Fetch bookings for the user, populate related fields, and exclude sensitive data
    const bookings = await Booking.find({ user: userId })
      .populate({ path: "user", select: "-password" }) // Exclude password when populating user
      .populate("room"); // Populate room details

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User bookings fetched successfully.",
      bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings. Please try again later.",
      error: error.message,
    });
  }
};

// export const GetUserBookingsById = async (req, res) => {
//   try {
//     const userId = req.params.id; // Extract userId from the request parameters
//     const bookings = await Booking.find({ user: userId }).populate("user").populate("room");
//     if (bookings.length === 0) {
//       return res.status(404).json({ message: "No bookings found for this user" });
//     }
//     res.status(200).json(bookings); // Return all bookings for the user
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
//   }
// };

// Cancel a booking
export const CancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the booking by bookingId
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Check if the booking belongs to the logged-in user (optional but recommended)
    // if (booking.user.toString() !== req.user.userId) {
    //   return res.status(403).json({ message: "You are not authorized to cancel this booking." });
    // }

    // Save the canceled booking to CancelledBooking collection
    const canceledBooking = new CancelledBooking({
      user: booking.user,
      room: booking.room,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      totalPrice: booking.totalPrice,
      noOfRooms: booking.noOfRooms,
      noOfGuests: booking.noofguests,
      reason: req.body.reason || 'No reason provided', // Optional reason for cancellation
    });

    await canceledBooking.save();

    // Delete the original booking from the Booking collection
    await Booking.deleteOne({ _id: id });

    // Update the availability of the room for the booked dates
    const room = await Room.findById(booking.room);
    if (room) {
      const { checkInDate, checkOutDate, noOfRooms } = booking;

      // Decrease the booked slots
      room.bookedSlots -= noOfRooms;

      // Optionally remove the canceled booking dates from a list of unavailable dates
      const bookedDates = [];
      let currentDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      while (currentDate <= endDate) {
        bookedDates.push(new Date(currentDate).toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Remove unavailable dates
      await Room.updateOne(
        { _id: booking.room },
        { 
          $set: { bookedSlots: room.bookedSlots },
          $pull: { unavailableDates: { $in: bookedDates } }
        }
      );
    }

    // Update user booking status
    const user = await User.findById(booking.user);
    if (user) {
      await User.updateOne(
        { _id: booking.user },
        { $set: { IsBooking: false, currentBooking: null } }
      );
    }

    // Optional: Send cancellation email
    try {
      await sendCancellationConfirmation({
        email: user.email,
        name: user.name,
        bookingId: canceledBooking._id,
        roomName: room.name,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
      });
    } catch (emailError) {
      console.error("Failed to send cancellation email:", emailError.message);
    }

    res.status(200).json({
      message: "Booking cancelled successfully and stored as a canceled booking.",
      canceledBookingId: canceledBooking._id,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error.message);
    res.status(500).json({ message: "Failed to cancel booking.", error: error.message });
  }
};
 

export const Putrating = async (req, res) => {
  try {
    const { id } = req.params; // Room being rated
    const { rating } = req.body; // Rating value
    const currentUserId = req.user._id;

    console.log(id);
    console.log(rating);
    console.log(currentUserId);

    // Use findOneAndUpdate instead of find and save to avoid full validation
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          ratings: {
            userId: currentUserId,
            rating: rating,
          },
        },
      },
      {
        new: true, // Return updated document
        runValidators: false, // Don't run validators for the entire document
      }
    );

    if (!updatedRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    // Check rating range
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5.",
      });
    }

    // // Check for existing rating by this user
    // const hasExistingRating = updatedRoom.ratings.some(
    //   r => String(r.userId) === String(currentUserId)
    // );

    // if (hasExistingRating) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'You have already rated this room.'
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Rating added successfully.",
      room: updatedRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while adding rating",
    });
  }
};

// Get the average rating of a room
export const getavgrating = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("roomId from params:", id); // Debugging line

    const room = await Room.findById(id);

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found." });
    }

    const ratings = room.ratings;
    if (ratings.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No ratings available.", avg: 0 });
    }

    const sum = ratings.reduce((acc, cur) => acc + cur.rating, 0);
    const avg = Math.round(sum / ratings.length);

    res
      .status(200)
      .json({
        success: true,
        message: "Average rating retrieved successfully.",
        avg,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error occurred while retrieving average rating.",
      });
  }
};
export const GetUserBookings = async (req, res) => {
  const userId = req.user.userId;
  console.log(userId);
  // Assuming user ID is available via JWT token in req.user
  try {
    // Find all bookings for the current user
    const bookings = await Booking.find({ user: userId })
      .populate({ path: "user", select: "-password" })
      .populate("room");

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully.",
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching user bookings.",
    });
  }
};

export const All = async (req, res) => {
  try {
    // Total Bookings
    const totalBookings = await Booking.countDocuments();

    // Total Guests
    const totalGuests = await User.countDocuments({ IsBooking: true });

    // Total Users
    const totalUsers = await User.countDocuments({ IsBooking: false });

    const revenue = await Booking.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    // Recent Bookings (sorted by booking date, limited to 5)
    const recentBookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .populate("user") // Sort by booking date descending
      .limit(5);

    res.json({
      totalBookings,
      totalGuests,
      totalUsers,
      revenue: revenue[0]?.totalRevenue || 0,
      recentBookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

import moment from "moment"; // Adjust the path according to your project structure
import CancelledBooking from "../Models/CancelBooking.js";
// import { sendBookingConfirmation } from "./auth.js";

export const GetBookingChange = async (req, res) => {
  try {
    const currentDate = moment();

    // Get the first and last day of the current month
    const firstDayOfCurrentMonth = currentDate.startOf("month").toDate();
    const lastDayOfCurrentMonth = currentDate.endOf("month").toDate();

    // Get the first and last day of the previous month
    const firstDayOfLastMonth = currentDate
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const lastDayOfLastMonth = currentDate.endOf("month").toDate();

    // Fetch bookings for the current and last month
    const currentMonthBookingsCount = await Booking.countDocuments({
      checkInDate: {
        $gte: firstDayOfCurrentMonth,
        $lte: lastDayOfCurrentMonth,
      },
    });

    const lastMonthBookingsCount = await Booking.countDocuments({
      checkInDate: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
    });

    // Calculate booking change
    const bookingChange = currentMonthBookingsCount - lastMonthBookingsCount;

    // Calculate percentage change
    let percentageChange = 0;
    if (lastMonthBookingsCount > 0) {
      percentageChange = (
        (bookingChange / lastMonthBookingsCount) *
        100
      ).toFixed(2);
    } else if (currentMonthBookingsCount > 0) {
      percentageChange = 100; // If last month had no bookings, consider it a 100% increase
    }

    // Determine change status
    let changeStatus = "No change";
    if (percentageChange > 0) {
      changeStatus = `Increased by ${percentageChange}%`;
    } else if (percentageChange < 0) {
      changeStatus = `Decreased by ${Math.abs(percentageChange)}%`;
    }

    res.status(200).json({
      success: true,
      message: "Booking change compared to last month.",
      currentMonthBookingsCount,
      lastMonthBookingsCount,
      bookingChange,
      percentageChange,
      changeStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while calculating booking change.",
      error: error.message,
    });
  }
};
export const GetRevenueChange = async (req, res) => {
  try {
    // Get the current date and calculate the first and last date of the current month
    const currentDate = moment();
    const firstDayOfCurrentMonth = currentDate.startOf("month").toDate();
    const lastDayOfCurrentMonth = currentDate.endOf("month").toDate();

    // Get the first and last date of the previous month
    const firstDayOfLastMonth = currentDate
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const lastDayOfLastMonth = currentDate
      // .subtract(1, 'month')
      .endOf("month")
      .toDate();

    // Fetch the total revenue in the current month
    const currentMonthRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: firstDayOfCurrentMonth,
            $lte: lastDayOfCurrentMonth,
          },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    const currentMonthRevenueAmount =
      currentMonthRevenue.length > 0 ? currentMonthRevenue[0].totalRevenue : 0;

    // Fetch the total revenue in the previous month
    const lastMonthRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    const lastMonthRevenueAmount =
      lastMonthRevenue.length > 0 ? lastMonthRevenue[0].totalRevenue : 0;

    // Calculate the increase or decrease in revenue
    const revenueChange = currentMonthRevenueAmount - lastMonthRevenueAmount;

    // Calculate percentage change
    let percentageChange = 0;
    if (lastMonthRevenueAmount > 0) {
      percentageChange = (revenueChange / lastMonthRevenueAmount) * 100;
    }

    // Determine whether it's an increase, decrease, or no change
    let changeStatus = "No change";
    if (revenueChange > 0) {
      changeStatus = `Increased by $${revenueChange.toFixed(
        2
      )} (${percentageChange.toFixed(2)}%)`;
    } else if (revenueChange < 0) {
      changeStatus = `Decreased by $${Math.abs(revenueChange).toFixed(
        2
      )} (${Math.abs(percentageChange).toFixed(2)}%)`;
    }

    res.status(200).json({
      success: true,
      message: `Revenue change compared to last month.`,
      currentMonthRevenue: currentMonthRevenueAmount.toFixed(2),
      lastMonthRevenue: lastMonthRevenueAmount.toFixed(2),
      revenueChange: revenueChange.toFixed(2),
      percentageChange: percentageChange.toFixed(2),
      changeStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while calculating revenue change.",
      error: error.message,
    });
  }
};
 export const getBookingsByRoom = async (req, res) => {
  try {
    const { id } = req.params; // Extract room ID from request parameters

    // Find all bookings for the given room ID
    const bookings = await Booking.find({ room: id })
      .populate('user', 'name email') // Optionally populate user details (if your Booking model references users)
      .populate('room', 'name availableSlots'); // Optionally populate room details

    // Check if bookings exist
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this room.' });
    }

    // Send the bookings as the response
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving bookings.',
      error: error.message,
    });
  }
};

export const getBookingDatesByRoom = async (req, res) => {
  try {
    const { id } = req.params; // Extract room ID from request parameters

    // Find all bookings for the given room ID where the booking is not canceled
    const bookings = await Booking.find({ 
      room: id, 
      status: { $ne: 'Cancelled' }  // Exclude canceled bookings
    }).select('checkInDate checkOutDate -_id');

    // Check if bookings exist
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this room.' });
    }

    // Generate all dates within the range of check-in and check-out dates
    const bookedDates = bookings.flatMap(({ checkInDate, checkOutDate }) => {
      const dates = [];
      let currentDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      while (currentDate <= endDate) {
        dates.push(new Date(currentDate).toISOString().split('T')[0]); // Format date as YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1); // Increment day
      }
      return dates;
    });

    // Remove duplicate dates
    const uniqueBookedDates = [...new Set(bookedDates)];

    // Send the dates as the response
    res.status(200).json({
      success: true,
      dates: uniqueBookedDates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving booked dates.',
      error: error.message,
    });
  }
};


export const GetAllChanges = async (req, res) => {
  try {
    const currentDate = moment();
    const firstDayOfCurrentMonth = currentDate.startOf("month").toDate();
    const lastDayOfCurrentMonth = currentDate.endOf("month").toDate();
    const firstDayOfLastMonth = currentDate.subtract(1, "month").startOf("month").toDate();
    const lastDayOfLastMonth = currentDate.endOf("month").toDate();

    // Users change calculation
    const [currentMonthUsers, lastMonthUsers] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: firstDayOfCurrentMonth, $lte: lastDayOfCurrentMonth }
      }),
      User.countDocuments({
        createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth }
      })
    ]);

    const userChange = currentMonthUsers - lastMonthUsers;
    let userPercentageChange = 0;
    if (lastMonthUsers > 0) {
      userPercentageChange = ((userChange / lastMonthUsers) * 100).toFixed(2);
    }

    let userChangeStatus = "No change";
    if (userChange > 0) {
      userChangeStatus = `Increased by ${userPercentageChange}%`;
    } else if (userChange < 0) {
      userChangeStatus = `Decreased by ${Math.abs(userPercentageChange)}%`;
    }

    // Bookings change calculation
    const [currentMonthBookingsCount, lastMonthBookingsCount] = await Promise.all([
      Booking.countDocuments({
        checkInDate: { $gte: firstDayOfCurrentMonth, $lte: lastDayOfCurrentMonth }
      }),
      Booking.countDocuments({
        checkInDate: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth }
      })
    ]);

    const bookingChange = currentMonthBookingsCount - lastMonthBookingsCount;
    let bookingPercentageChange = 0;
    if (lastMonthBookingsCount > 0) {
      bookingPercentageChange = ((bookingChange / lastMonthBookingsCount) * 100).toFixed(2);
    } else if (currentMonthBookingsCount > 0) {
      bookingPercentageChange = 100;
    }

    let bookingChangeStatus = "No change";
    if (bookingPercentageChange > 0) {
      bookingChangeStatus = `Increased by ${bookingPercentageChange}%`;
    } else if (bookingPercentageChange < 0) {
      bookingChangeStatus = `Decreased by ${Math.abs(bookingPercentageChange)}%`;
    }

    // Revenue change calculation
    const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([ 
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: firstDayOfCurrentMonth, $lte: lastDayOfCurrentMonth }
          }
        },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
      ]),
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth }
          }
        },
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
      ])
    ]);

    const currentMonthRevenueAmount = currentMonthRevenue.length > 0 ? currentMonthRevenue[0].totalRevenue : 0;
    const lastMonthRevenueAmount = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].totalRevenue : 0;
    const revenueChange = currentMonthRevenueAmount - lastMonthRevenueAmount;

    let revenuePercentageChange = 0;
    if (lastMonthRevenueAmount > 0) {
      revenuePercentageChange = (revenueChange / lastMonthRevenueAmount) * 100;
    }

    let revenueChangeStatus = "No change";
    if (revenueChange > 0) {
      revenueChangeStatus = `Increased by $${revenueChange.toFixed(2)} (${revenuePercentageChange.toFixed(2)}%)`;
    } else if (revenueChange < 0) {
      revenueChangeStatus = `Decreased by $${Math.abs(revenueChange).toFixed(2)} (${Math.abs(revenuePercentageChange).toFixed(2)}%)`;
    }

    // Guest and Regular Users change calculation
    const [currentMonthGuests, lastMonthGuests] = await Promise.all([
      Booking.distinct('user', {
        checkInDate: { $gte: firstDayOfCurrentMonth, $lte: lastDayOfCurrentMonth }
      }),
      Booking.distinct('user', {
        checkInDate: { $gte: firstDayOfLastMonth, $lte: lastDayOfLastMonth }
      })
    ]);

    const currentMonthGuestCount = currentMonthGuests.length;
    const lastMonthGuestCount = lastMonthGuests.length;
    const guestChange = currentMonthGuestCount - lastMonthGuestCount;
    
    let guestPercentageChange = 0;
    if (lastMonthGuestCount > 0) {
      guestPercentageChange = ((guestChange / lastMonthGuestCount) * 100).toFixed(2);
    } else if (currentMonthGuestCount > 0) {
      guestPercentageChange = 100;
    }

    let guestChangeStatus = "No change";
    if (guestChange > 0) {
      guestChangeStatus = `Increased by ${guestPercentageChange}%`;
    } else if (guestChange < 0) {
      guestChangeStatus = `Decreased by ${Math.abs(guestPercentageChange)}%`;
    }

    // Calculate regular users (those who did not make any bookings)
    const currentMonthRegularUsers = currentMonthUsers - currentMonthGuestCount;
    const lastMonthRegularUsers = lastMonthUsers - lastMonthGuestCount;
    const regularUserChange = currentMonthRegularUsers - lastMonthRegularUsers;

    let regularUserPercentageChange = 0;
    if (lastMonthRegularUsers > 0) {
      regularUserPercentageChange = ((regularUserChange / lastMonthRegularUsers) * 100).toFixed(2);
    }

    let regularUserChangeStatus = "No change";
    if (regularUserChange > 0) {
      regularUserChangeStatus = `Increased by ${regularUserPercentageChange}%`;
    } else if (regularUserChange < 0) {
      regularUserChangeStatus = `Decreased by ${Math.abs(regularUserPercentageChange)}%`;
    }

    res.status(200).json({
      success: true,
      message: "Monthly statistics change report",
      users: {
        current: currentMonthUsers,
        last: lastMonthUsers,
        change: userChange,
        percentageChange: userPercentageChange,
        status: userChangeStatus
      },
      bookings: {
        current: currentMonthBookingsCount,
        last: lastMonthBookingsCount,
        change: bookingChange,
        percentageChange: bookingPercentageChange,
        status: bookingChangeStatus
      },
      revenue: {
        current: currentMonthRevenueAmount.toFixed(2),
        last: lastMonthRevenueAmount.toFixed(2),
        change: revenueChange.toFixed(2),
        percentageChange: revenuePercentageChange.toFixed(2),
        status: revenueChangeStatus
      },
      guests: {
        current: currentMonthGuestCount,
        last: lastMonthGuestCount,
        change: guestChange,
        percentageChange: guestPercentageChange,
        status: guestChangeStatus
      },
      regularUsers: {
        current: currentMonthRegularUsers,
        last: lastMonthRegularUsers,
        change: regularUserChange,
        percentageChange: regularUserPercentageChange,
        status: regularUserChangeStatus
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while calculating statistics.",
      error: error.message
    });
  }
};
