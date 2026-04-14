import { uploadMultiple } from "../Middleware/Multer.js";
import Room from "../Models/Room.js";


export const AddRoom = async (req, res) => {
  const {
    name,
    pricePerNight,
    DiscountedPrice,
    amenities,
    description,
    maxOccupancy,
    isAvailable,
    totalSlots, // Added totalSlots as part of the request body
    taxes, // Added taxes as part of the request body
  } = req.body;

  try {
    // Validate required fields
    if (!name || !pricePerNight || !DiscountedPrice || !maxOccupancy || !totalSlots) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate amenities structure
    if (!Array.isArray(amenities) || amenities.length === 0) {
      return res.status(400).json({ message: "Amenities must be a non-empty array" });
    }

    amenities.forEach(amenity => {
      if (!amenity.category || !Array.isArray(amenity.items) || amenity.items.length === 0) {
        throw new Error("Each amenity must have a category and a non-empty 'items' array");
      }

      amenity.items.forEach(item => {
        if (!item.name || typeof item.quantity !== 'number') {
          throw new Error("Each item in amenities must have a name and quantity");
        }
      });
    });

    // Validate taxes (if provided)
    if (taxes) {
      if (typeof taxes.vat !== 'number' || typeof taxes.serviceTax !== 'number' || typeof taxes.other !== 'number') {
        return res.status(400).json({ message: "Taxes must be numbers" });
      }
    } else {
      // If taxes are not provided, set them to defaults (0)
      taxes = { vat: 0, serviceTax: 0, other: 0 };
    }

    // Calculate availableSlots based on totalSlots and initially set bookedSlots to 0
    const bookedSlots = 0;  // Initially, no rooms are booked
    const availableSlots = totalSlots - bookedSlots;  // Available slots will be totalSlots - bookedSlots

    // Collect images if any are uploaded
    const images = req.files ? req.files.map(file => file.path) : [];

    // Create the room document
    const room = new Room({
      name,
      pricePerNight,
      DiscountedPrice,
      amenities,
      description,
      maxOccupancy,
      isAvailable,
      totalSlots,        // Set the total slots
      bookedSlots,       // Set the initially booked slots to 0
      availableSlots,    // Calculate available slots
      images,
      taxes,             // Include taxes in the room creation
    });

    // Save the room to the database
    const savedRoom = await room.save();

    return res.status(201).json({
      message: "Room added successfully",
      room: savedRoom,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to add room", error: error.message });
  }
};



// Update room amenities
export const updateRoomAmenities = async (req, res) => {
  const { roomId } = req.params;
  const { amenities } = req.body; // New amenities array

  try {
    // Find the room by ID
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Validate the structure of the amenities array
    if (!Array.isArray(amenities) || amenities.length === 0) {
      return res.status(400).json({ message: 'Amenities must be a non-empty array' });
    }

    // Ensure that each amenity has the necessary fields
    amenities.forEach(amenity => {
      if (!amenity.category || !Array.isArray(amenity.items)) {
        throw new Error('Each amenity must have a category and a non-empty "items" array');
      }
      amenity.items.forEach(item => {
        if (!item.name || typeof item.quantity !== 'number') {
          throw new Error('Each item in amenities must have a name and quantity');
        }
      });
    });

    // Add new amenities to the room's existing amenities array without duplicating
    room.amenities = [
      ...room.amenities,
      ...amenities.filter(newAmenity =>
        !room.amenities.some(existingAmenity =>
          existingAmenity.category === newAmenity.category &&
          existingAmenity.items.every((item, idx) =>
            item.name === newAmenity.items[idx]?.name &&
            item.quantity === newAmenity.items[idx]?.quantity
          )
        )
      ),
    ];

    // Save the updated room
    const updatedRoom = await room.save();

    return res.status(200).json({
      message: 'Room amenities updated successfully',
      room: updatedRoom,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating room amenities', error: error.message });
  }
};

// Get a room with all its amenities
export const getRoomWithAmenities = async (req, res) => {
  const { roomId } = req.params;

  try {
    // Find room by ID with populated amenities array
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    return res.status(200).json({
      message: 'Room fetched successfully',
      room,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

export const AddImagesById = async (req, res) => {
  const { id } = req.params; // Get room ID from the request parameters

  try {
    // Find the room by ID
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Collect images from the uploaded files
    const newImages = req.files ? req.files.map(file => file.path) : [];

    if (newImages.length > 0) {
      // Append the new images to the existing images array
      room.images = [...room.images, ...newImages];
      
      // Save the updated room
      const updatedRoom = await room.save();
      return res.status(200).json({ message: "Images added successfully", room: updatedRoom });
    } else {
      return res.status(400).json({ message: "No images uploaded" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to add images", error: error.message });
  }
};

// Get all rooms
export const GetRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error: error.message });
  }
};

// Get a single room by ID
export const GetRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room", error: error.message });
  }
};

// Update a room by ID
export const UpdateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRoom) return res.status(404).json({ message: "Room not found" });

    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    res.status(400).json({ message: "Failed to update room", error: error.message });
  }
};

// Delete a room by ID
export const DeleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) return res.status(404).json({ message: "Room not found" });

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete room", error: error.message });
  }
};
