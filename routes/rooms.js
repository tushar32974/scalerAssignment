import express from "express";
import {
  getAllRooms,
  toggleRoomState,
  getAvailableRoomsByType
} from "../controllers/rooms.js";


const router = express.Router();

/* READ */
router.get("/rooms", getAllRooms);
router.get("/rooms/filter", getAvailableRoomsByType);

/* UPDATE */
router.put("/rooms/:roomId/toggle-state", toggleRoomState);

export default router;
