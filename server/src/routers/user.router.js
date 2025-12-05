import express from "express";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  sendMailToTheUser,
  verifyUserMail,
} from "../controller/user.controller.js";
// import connectedUsers from "../utils/connectedUsers.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/send_mail", sendMailToTheUser);
router.post("/mail_verify", verifyUserMail);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

// first manage this things and do all the stup
router.post("/verifyToken", verifyJWT, (req, res) => {
  try {
    // const { totalNotifications, _id } = req.user;
    // if (io && parseInt(totalNotifications) > 0) {
    //     const userSocketId = connectedUsers.getUserSocketId(_id);
    //     console.log(userSocketId + " user socket id ")
    //     io.to(userSocketId).emit("notification", { totalNotifications });
    // }
    
    return res.status(201).json(new ApiResponse(200, null, "Verified"));
  } catch (eror) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while login"
    );
  }
});

export default router;
