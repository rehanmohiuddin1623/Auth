import express from "express"
import { register, verifyUser } from "../controllers/user"
const router = express.Router();

router.post("/register", register);
router.get("/verify", verifyUser);

export default router