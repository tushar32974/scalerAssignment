import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import { toggleRoomState } from "./rooms.js";

/* READ */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* CREATE */
export const createBooking = async (req, res) => {
  try {
    const { userName, userEmail, roomId, startTime, endTime, totalPrice } = req.body;

    // Find the room by its roomId to get room details
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Create a new booking using the Booking model
    const newBooking = new Booking({
      userName,
      userEmail,
      room: {
        roomId,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        pricePerHour: room.pricePerHour,
        // Add other room-related properties here
      },
      startTime,
      endTime,
      totalPrice,
      // You can add other booking-related properties here
    });

    // Save the new booking to the database
    await newBooking.save();

    // Create an object with the required data for toggleRoomState
    const toggleData = {
      params: { roomId },
      body: { startTime, endTime },
    };

    // Call toggleRoomState to update the room's status
    let temp = await toggleRoomState(toggleData, res);

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/* UPDATE */
export const editBooking = async (req, res) => {
  try {
    const {bookingId}=req.params;
    const {
      userName,
      userEmail,
      roomId,
      roomNumber,
      roomType,
      startTime,
      endTime,
      totalPrice,
    } = req.body;

    // Find the existing booking by its ID
    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Retrieve the room and time slot of the existing booking
    const { room: existingRoom, startTime: existingStartTime, endTime: existingEndTime } = existingBooking;

    // Toggle the state of the room associated with the existing booking
    const toggleDataExisting = {
      params: { roomId: existingRoom.roomId },
      body: { startTime: existingStartTime, endTime: existingEndTime },
    };
    let temp=await toggleRoomState(toggleDataExisting, res);

    // Update the existing booking with the new information
    existingBooking.userName = userName;
    existingBooking.userEmail = userEmail;
    existingBooking.room = {
      roomId,
      roomNumber,
      roomType,
    };
    existingBooking.startTime = startTime;
    existingBooking.endTime = endTime;
    existingBooking.totalPrice = totalPrice;

    // Save the updated booking
    let temp3=await existingBooking.save();

    // Toggle the state of the newly booked room
    const toggleDataNew = {
      params: { roomId },
      body: { startTime, endTime },
    };
    let temp2=await toggleRoomState(toggleDataNew, res);

    res.status(200).json(existingBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



/* DELETE */
export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by its ID and store the room ID and time slot
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const { room, startTime, endTime } = booking;

    // Delete the booking from the database
    await Booking.findByIdAndDelete(bookingId);

    // Create an object with the required data for toggleRoomState
    const toggleData = {
      params: { roomId: room.roomId }, // Use the room's ID
      body: { startTime, endTime },
    };

    // Call toggleRoomState to update the room's status
    let temp=await toggleRoomState(toggleData, res);

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

