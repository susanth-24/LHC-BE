import express from "express";
import { signin, signup,profile, changePassword, notification, clearNotify, fetchNotify, notification_1, getAllUsers, notification_3, notification_4 } from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/profile/:id', profile);
router.patch('/changePassword',changePassword);
router.post('/notifications',notification);
router.post('/notifications3',notification_3);
router.post('/notifications4',notification_4);
router.delete('/clearNotify/:id',clearNotify);
router.get('/fetchNotify/:id',fetchNotify);
router.post('/notification1/:id',notification_1);
router.get('/allusers', getAllUsers);
export default router;