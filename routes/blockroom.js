import express from "express";
import auth from "../middleware/auth.js";
import { createBlock, deleteBlock, getBlocks } from "../controllers/blockroom.js";

const router = express.Router();

router.get('/',getBlocks);
router.post('/',auth,createBlock);
router.delete('/:id', auth, deleteBlock);
export default router