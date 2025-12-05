import express from "express";
import { loginUser, refreshAccessToken, registerUser, sendMailToTheUser, verifyUserMail } from "../controller/user.controller.js";
const router = express.Router();

router.post("/send_mail", sendMailToTheUser);
router.post("/mail_verify", verifyUserMail);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

export default router;
