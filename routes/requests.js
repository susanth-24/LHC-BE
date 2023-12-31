import express from "express";
import auth from "../middleware/auth.js";
import { WithdrawRequest, acceptRequest_1, acceptRequest_2, acceptRequest_3, attended, createRequest, getRequest, getRequests, rejectRequest_1, rejectRequest_2, rejectRequest_3 } from "../controllers/requests.js";

const router = express.Router();

router.get('/',getRequests);
router.get('/:id',getRequest);
router.post('/',auth,createRequest);
router.patch("/:id/attend",auth, attended);
router.patch("/:id/accept_1",auth, acceptRequest_1);
router.patch("/:id/accept_2",auth, acceptRequest_2);
router.patch("/:id/accept_3",auth, acceptRequest_3);
router.patch("/:id/reject_1",auth, rejectRequest_1);
router.patch("/:id/reject_2",auth, rejectRequest_2);
router.patch("/:id/reject_3",auth, rejectRequest_3);
router.patch("/:id/withdraw",auth,WithdrawRequest);

export default router