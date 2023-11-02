import Room from "../models/Room.js";

/* READ */
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getAvailableRoomsByType = async (req, res) => {
  try {
    const { roomType, startTime, endTime } = req.body;
    console.log("Received");
    console.log(roomType);
    console.log(startTime);
    console.log(endTime);
    // Find all rooms of the specified type
    const rooms = await Room.find({ roomType });
    
    // Filter the rooms that are available or unbooked during the specified time period
    const availableRooms = await Promise.all(
      rooms.map(async (room) => {
        // Check if there are any overlapping bookings
        const overlappingBooking = room.bookedPeriods.find((booking) => {
          const bookingStartTime = booking.startTime;
          const bookingEndTime = booking.endTime;
          const requestStartTime =startTime;
          const requestEndTime = endTime;

          if (!(bookingStartTime>requestEndTime||requestStartTime>bookingEndTime)) {
            return true; // There's an overlapping booking
          }

          return false;
        });

        if (!overlappingBooking) {
          return room; // Room is either available or unbooked
        }

        return null; // Room has an overlapping booking
      })
    );

    // Filter out null values (rooms with overlapping bookings)
    const filteredRooms = availableRooms.filter((room) => room !== null);

    res.status(200).json(filteredRooms);
    console.log(filteredRooms)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* UPDATE */
export const toggleRoomState = async (req, res) => {
  const { roomId } = req.params;
  const { startTime, endTime } = req.body;

  try {
    // Find the room by its ObjectId
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const existingBookingIndex = room.bookedPeriods.findIndex((booking) => {
      return (
        booking.startTime.toString() === startTime &&
        booking.endTime.toString() === endTime
      );
    });

    if (existingBookingIndex !== -1) {
      // Booking already exists, remove it
      room.bookedPeriods.splice(existingBookingIndex, 1);
    } else {
      // Booking doesn't exist, add it
      room.bookedPeriods.push({ startTime, endTime });
    }

    // Save the updated room state
    await room.save();
    
    return { success: true, message: "Room state toggled successfully" };
  } catch (err) {
    return { success: false, message: err.message };
  }
  
};

