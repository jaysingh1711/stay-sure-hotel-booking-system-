import express from "express";
import cors from "cors";
import router from "./Routes/AllRoutes.js";
import connectDB from "./Config/bd.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import router2 from "./Routes/UserRoutes.js";
import Hotel from "./Models/HotelModel.js";
import Room from "./Models/Room.js";

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
dotenv.config();
const app = express();
app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }
));
app.use(express.json());
app.use(bodyParser.json());
// Example route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running! Please use the frontend URL to access the application.");
});
 
// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 
// Connect to the database
await connectDB();

// Seed the database if empty
const hotelCount = await Hotel.countDocuments();
if (hotelCount === 0) {
  console.log("Seeding default hotel data...");
  await Hotel.create({
    name: "Veer Raghav Hotel",
    address: "123 Heritage Street, Ayodhya",
    contactNumbers: ["+91 9876543210"],
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    Email: "contact@veerraghav.com"
  });
}

const roomCount = await Room.countDocuments();
if (roomCount === 0) {
  console.log("Seeding default room data...");
  await Room.create({
    name: "Premium",
    pricePerNight: 5000,
    DiscountedPrice: 4500,
    amenities: [
      {
        category: "Basic Facilities",
        items: [{ name: "King Size Bed", quantity: 1 }, { name: "Free Wi-Fi", quantity: 1 }],
        description: "Excellent basic facilities"
      }
    ],
    description: "A premium luxury room with all facilities.",
    maxOccupancy: 2,
    totalSlots: 5,
    availableSlots: 5,
    bookedSlots: 0,
    isAvailable: true
  });
}
 
 
// Middleware to parse cookies
app.use(cookieParser());



// Middleware to parse cookies
app.use(cookieParser());
// Routes
app.use("/api/v3/", router);
app.use('/api/v3',router2)
 
// Start the server
const PORT = process.env.PORT||5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});