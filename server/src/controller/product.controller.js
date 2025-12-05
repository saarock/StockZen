import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const saveProduct = asyncHandler(async (req, res, next) => {
    const { name, description, price, expiryDate, stock, category, userId } = req.body;



    const newUser = await User.findById(userId);
    if (!newUser) {
        return res.status(404).json({ message: "User not found" });
    }




    // Check if the user is an admin
    if (newUser.role !== "admin") {

        return res.status(403).json({ message: "You are not authorized to add products" });
    }




    // Validate the product data
    if (!name || !description || !price) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if there's an image uploaded
    let imageUrl = null;
    if (req.file) {



        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);


        if (cloudinaryResponse) {
            imageUrl = cloudinaryResponse.secure_url; // Get the URL of the uploaded image
        } else {
            return res.status(500).json({ message: "Image upload failed" });
        }

        // Optionally, remove the local file after uploading
        fs.unlinkSync(req.file.path);



    }

    // Create a new product object
    const newProduct = {
        name,
        description,
        price,
        imageUrl, // Save the image URL from Cloudinary
        expiryDate,
        stock,
        category,
        admin: newUser, // Assuming you have the admin ID from the JWT token
    };

    const product = new Product(newProduct);
    // Save the product to the database
    await product.save();
    res.status(201).json(new ApiResponse(200, "Product Added Successfull", product));
});



