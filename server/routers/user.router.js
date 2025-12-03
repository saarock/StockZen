import express from "express";
import { sendMailToTheUser } from "../controller/user.controller";
const router = express.Router();

router.post("/send_mail", sendMailToTheUser);

export default router;
