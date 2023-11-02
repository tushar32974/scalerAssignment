import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
//const fetch =require('node-fetch')

const BookingForm =() => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [roomType, setRoomType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);


  const handleRoomTypeChange = (event) => {
    setRoomType(event.target.value);

    // Define the parameters to be sent in the request
    const params = {
      roomType: roomType, // Assuming roomType is a state variable
      startTime: startTime, // Assuming startTime is a state variable
      endTime: endTime, // Assuming endTime is a state variable
    };

    // Make a GET request with the defined parameters
    axios
      .get("http://localhost:3001/roomRoutes/rooms/filter", {
        params: params,
      })
      .then((response) => {
        setAvailableRooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching available rooms:", error);
      });
  };







  const handleBooking = () => {
    // Make a POST request to book the room
    axios
      .post(`http://localhost:3001/bookingRoutes/booking/add`, {
        userName,
        userEmail,
        roomId: roomNumber, // Assuming roomNumber represents roomId
        startTime,
        endTime,
      })
      .then((response) => {
        console.log("Booking successful:", response.data);
      })
      .catch((error) => {
        console.error("Error booking the room:", error);
      });
  };

  return (
    <form>
      <TextField
        label="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <TextField
        label="User Email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      />
      <TextField
        label="Start Time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <TextField
        label="End Time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <FormControl>
        <InputLabel>Room Type</InputLabel>
        <Select value={roomType} onChange={handleRoomTypeChange}>
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="C">C</MenuItem>
          <MenuItem value="D">D</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Room Number</InputLabel>
        <Select
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        >
          {availableRooms.map((room) => (
            <MenuItem key={room._id} value={room.roomNumber}>
              {room.roomNumber}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleBooking}>
        Book
      </Button>
    </form>
  );
};

export default BookingForm;
