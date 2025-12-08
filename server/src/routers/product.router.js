import { Router } from "express";

;
import { upload } from "../middlewares/multer.middleware.js";


import { verifyJWT } from "../middlewares/auth.middleware.js";
import {  saveProduct } from "../controller/product.controller.js";

const router = Router();

router.post(
  "/saveProduct",
  verifyJWT,
  upload.single("product_image"),
  saveProduct
);

// router.get("/getProducts", verifyJWT, getAllProducts);

export default router;
