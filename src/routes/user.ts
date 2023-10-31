import express from "express"
import { login, register, verifyUser } from "../controllers/user"
const router = express.Router();

router.post("/register", register);
router.get("/verify", verifyUser);
router.post("/login", login);

export default router