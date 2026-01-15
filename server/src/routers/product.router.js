import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  BuyProduct,
  ChangeProdutAvailableSatus,
  cancelOrderByUser,
  changeStatusOfTheBookeditems,
  deleteProducts,
  editTheProducts,
  generateBill,
  getAllProducts,
  getPurchaseStats,
  manageBookedProduct,
  saveProduct,
  getAdminStats,
  initiateEsewaPayment,
  verifyEsewaPayment,
} from "../controller/product.controller.js";
import CryptoJS from "crypto-js";

const router = Router();

router.post(
  "/saveProduct",
  verifyJWT,
  upload.single("product_image"),
  saveProduct
);
router.get("/getProducts", verifyJWT, getAllProducts);

router.post("/buy-products", verifyJWT, BuyProduct);
router.get("/manage-booked-product", verifyJWT, manageBookedProduct);
router.get("/generate-bill", verifyJWT, generateBill)
router.post("/change-status-of-booked-items", verifyJWT, changeStatusOfTheBookeditems);
router.post("/cancel-order", verifyJWT, cancelOrderByUser);
router.delete("/change-available", verifyJWT, ChangeProdutAvailableSatus);
router.put("/edit-product", verifyJWT, editTheProducts);
router.delete("/deleteProduct", verifyJWT, deleteProducts);
router.get("/admin-stats", verifyJWT, getAdminStats);


router.get("/get-purchaseStats", verifyJWT, getPurchaseStats);

// eSewa Routes
router.post("/initiate-esewa", verifyJWT, initiateEsewaPayment);
router.get("/verify-esewa", verifyEsewaPayment); // verifyEsewaPayment doesn't strictly need JWT if validation is purely via data, but usually callback comes from user browser which can have JWT? No, verify is a generic callback often. But here we might call it from frontend after redirect.
// Wait, my plan said "New page to handle redirection... calls /verify-esewa". Then it can be JWT protected or not.
// Let's keep it open or check implementation.
// Logic: eSewa redirects to Frontend -> Frontend calls Backend with `data` query param. 
// So Frontend can send JWT.
// But just to be safe, I'll remove verifyJWT for now to avoid issues if token is lost, relying on payload signature verification effectively. 
// Actually, `verifyEsewaPayment` relies on `data` payload. Verification is safe.

// Removed old /create-esewa-payment






export default router;


