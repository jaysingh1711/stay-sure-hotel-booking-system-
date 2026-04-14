import Hotel from "../Models/HotelModel.js";
import validator from "validator"; // Import the validator library

export const AddHotel = async (req, res) => {
  try {
    const {
      name,
      // address,
      // contactNumbers,
      // checkInTime,
      // checkOutTime,
      // logo,
      // foodAndDining,
      // hostDetails,
      // caretakerDetails,
      // Email,
    } = req.body;

    // // Validate required fields
    // if (!name 
    //   // || !address || !contactNumbers || !checkInTime || !checkOutTime
    // ) {
    //   return res.status(400).json({ message: "Required fields are missing." });
    // }

    // // Ensure contactNumbers is an array
    // if (!Array.isArray(contactNumbers)) {
    //   return res.status(400).json({ message: "Contact numbers must be an array." });
    // }

    // // Validate email if provided
    // if (Email && !validator.isEmail(Email)) {
    //   return res.status(400).json({ message: "Invalid email address." });
    // }

    // Create a new hotel
    const newHotel = new Hotel({
      name,
      // address,
      // contactNumbers,
      // checkInTime,
      // checkOutTime,
      // logo,
      // foodAndDining,
      // hostDetails,
      // caretakerDetails,
      // Email,
    });

    // Save the hotel to the database
    const savedHotel = await newHotel.save();

    return res.status(201).json({
      message: "Hotel added successfully.",
      hotel: savedHotel,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params; // Get the hotel ID from the URL
    const {
      name,
      address,
      contactNumbers,
      checkInTime,
      checkOutTime,
      logo,
      foodAndDining,
      hostDetails,
      caretakerDetails,
      Email,
    } = req.body;

    // Check if any fields are provided for update
    const updateData = {};

    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (contactNumbers) updateData.contactNumbers = contactNumbers;
    if (checkInTime) updateData.checkInTime = checkInTime;
    if (checkOutTime) updateData.checkOutTime = checkOutTime;
    if (logo) updateData.logo = logo;
    if (foodAndDining) updateData.foodAndDining = foodAndDining;
    if (hostDetails) updateData.hostDetails = hostDetails;
    if (caretakerDetails) updateData.caretakerDetails = caretakerDetails;

    // Validate and update email
    if (Email) {
      if (!validator.isEmail(Email)) {
        return res.status(400).json({ message: "Invalid email address." });
      }
      updateData.Email = Email;
    }

    // If no fields to update, send a message
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update." });
    }

    // Find the hotel by ID and update it
    const updatedHotel = await Hotel.findByIdAndUpdate(id, updateData, { new: true });

    // If hotel is not found, send an error message
    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    // Return the updated hotel details
    return res.status(200).json({
      message: "Hotel updated successfully.",
      hotel: updatedHotel,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const UploadHotelLogo = async (req, res) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No logo file uploaded" });
    }

    // Store the correct path
    hotel.logo = `uploads/${req.file.filename}`; // Match your actual upload directory
    // or if you prefer:
    // hotel.logo = req.file.path.replace(/\\/g, '/'); // Handle Windows path separators

    const updatedHotel = await hotel.save();

    return res.status(200).json({ 
      message: "Logo uploaded successfully", 
      hotel: updatedHotel 
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upload logo", error: error.message });
  }
};
export const GetHotel = async (req, res) => {
  try {
    const rooms = await Hotel.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error: error.message });
  }
};
export const GetHotelById = async (req, res) => {
  try {
    const room = await Hotel.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room", error: error.message });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params; // Get the hotel ID from the URL

    // Find the hotel by ID and delete it
    const deletedHotel = await Hotel.findByIdAndDelete(id);

    // If the hotel is not found, send an error message
    if (!deletedHotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    // Return success message
    return res.status(200).json({
      message: "Hotel deleted successfully.",
      hotel: deletedHotel, // Optionally include the deleted hotel's details
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return res.status(500).json({ message: "Server error.", error: error.message });
  }
};
