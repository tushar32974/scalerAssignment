import express from "express";
import { getAllBookings,createBooking,deleteBooking,editBooking} from "../controllers/bookings.js";

const router = express.Router();

/* READ */
router.get("/bookings", getAllBookings);


/* CREATE */
router.post("/booking/add",createBooking);

/* DELETE */
router.delete("/booking/delete/:bookingId", deleteBooking);


/* UPDATE */
router.put("/booking/edit/:bookingId", editBooking);

export default router;
