import React, { useState, useEffect } from "react";
import axios from "axios";

function BookingsComponent() {
  const [bookings, setBookings] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/bookingRoutes/bookings"
      );
      setBookings(response.data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/bookingRoutes/booking/delete/${bookingId}`
      );
      // Update the bookings array by removing the deleted booking
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div>
      <button onClick={fetchBookings}>Show Bookings</button>
      {showTable && (
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>User Email</th>
              <th>Room ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.userName}</td>
                <td>{booking.userEmail}</td>
                <td>{booking.room.roomId}</td>
                <td>{booking.startTime}</td>
                <td>{booking.endTime}</td>
                <td>
                  <button onClick={() => handleDeleteBooking(booking._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BookingsComponent;
