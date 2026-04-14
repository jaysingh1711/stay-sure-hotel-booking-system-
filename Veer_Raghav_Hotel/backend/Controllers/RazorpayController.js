import Razorpay from "razorpay";
import crypto from "crypto";  // to verify payment signature
import Booking from "../Models/Booking.js";
import Room from "../Models/Room.js";

// Initialize Razorpay instance with your API key and secret
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,    // Your Razorpay key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay key secret
});

// Create payment order
export const CreatePaymentOrder = async (req, res) => {
  const { userId, roomId, checkInDate, checkOutDate } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const numberOfNights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    if (numberOfNights <= 0) return res.status(400).json({ message: "Invalid booking dates" });
    const totalPrice = room.pricePerNight * numberOfNights;

    // Create Razorpay order
    const options = {
      amount: totalPrice * 100, // Amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
      payment_capture: 1,  // Automatically capture the payment
    };

    razorpayInstance.orders.create(options, async (err, order) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to create Razorpay order", error: err });
      }

      const booking = new Booking({
        user: userId,
        room: roomId,
        checkInDate,
        checkOutDate,
        totalPrice,
        paymentStatus: "Pending", // Set payment status to pending initially
        razorpayOrderId: order.id,
      });

      const savedBooking = await booking.save();
      res.status(201).json({
        message: "Booking created successfully. Proceed with payment.",
        order: order,
        booking: savedBooking,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
};

// Handle payment verification (callback)
export const VerifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  try {
    const booking = await Booking.findOne({ razorpayOrderId });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Verify payment signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update booking and room availability
    booking.paymentStatus = "Completed";
    await booking.save();

    const room = await Room.findById(booking.room);
    room.isAvailable = false; // Mark room as unavailable after successful payment
    await room.save();

    res.status(200).json({ message: "Payment successful, booking confirmed", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify payment", error: error.message });
  }
};
