import express from "express";
import auth from "../middleware/auth.js";
import {  acceptAvail_1, acceptAvail_2, acceptAvail_3, availableRooms, banRoom, createRoom, getRoom, getRooms, rejectAvail_1, rejectAvail_2, rejectAvail_3, unbanRoom, updateAvailability, updateRoom, withdrawAvail } from "../controllers/room.js";

const router=express.Router();
router.get('/search',availableRooms)
router.get('/',getRooms);
router.post('/',auth,createRoom);
router.get('/:id',getRoom)
router.post('/:id/update',auth,updateAvailability)
router.post('/:id/approved_1',auth,acceptAvail_1);
router.post('/:id/approved_2',auth,acceptAvail_2);
router.post('/:id/approved_3',auth,acceptAvail_3);
router.post('/:id/rejected_1',auth,rejectAvail_1);
router.post('/:id/rejected_2',auth,rejectAvail_2);
router.post('/:id/rejected_3',auth,rejectAvail_3);
router.post('/:id/withdrawed',auth,withdrawAvail);
router.patch('/:id',updateRoom);
router.patch("/:id/ban",auth, banRoom);
router.patch("/:id/unban",auth, unbanRoom);


export default router