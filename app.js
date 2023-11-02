import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import roomRoutes from "./routes/rooms.js";
import bookRoutes from "./routes/bookings.js";
//import postRoutes from "./routes/posts.js";
// import { register } from "./controllers/auth.js";
// import { createPost } from "./controllers/posts.js";
// import { verifyToken } from "./middleware/auth.js";
import Room from "./models/Room.js";
import Booking from "./models/Booking.js";
import { roomsData } from "./data/index.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());

/* ROUTES WITH FILES */
// app.post("/auth/register", upload.single("picture"), register);
// app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/api/roomRoutes", roomRoutes);
app.use("/api/bookingRoutes", bookRoutes);
// app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    //User.insertMany(users);
    //  Post.insertMany(posts);
    //Room.insertMany(roomsData);
  })
  .catch((error) => console.log(`${error} did not connect`));
