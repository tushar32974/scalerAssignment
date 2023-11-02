import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    room: {
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room", // Reference to the Room model
        required: true,
      },
      roomNumber: {
        type: String,
        required: true,
      },
      roomType: {
        type: String,
        required: true,
      },
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    }
    // Add other booking-related properties as needed
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
