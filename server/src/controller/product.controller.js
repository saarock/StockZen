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





// Paginated getAllProducts route
export const getAllProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 4, search = '', categoryFilter = '', availabilityFilter = '', disabled = 2 } = req.query; // Default to page 1 and 4 items per page


    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate the skip value for MongoDB (which items to skip)
    const skip = (pageNumber - 1) * limitNumber;

    const filters = {};

    // Search filter
    if (search.trim()) {
        filters.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Category filter (if provided and not "2")
    if (categoryFilter !== '2' && categoryFilter.trim()) {
        filters.category = categoryFilter;
    }

    // Availability filter (if provided and not "2")
    if (availabilityFilter !== '2' && availabilityFilter.trim()) {
        if (availabilityFilter === '1') {
            // Products with stock > 0 (available)
            filters.stock = { $gt: 0 };  // More than 0 stock
        } else if (availabilityFilter === '0') {
            // Products with stock == 0 (out of stock)
            filters.stock = 0;  // Out of stock
        }
    }

    // Disabled filter (if not "2", handle availability status)
    if (disabled !== '2') {
        // "1" means disabled value to here only at other same upper rules
        filters.isAvailable = disabled !== '0';
    }

    console.log(filters);
    

    try {
        const products = await Product.find(filters)
            .skip(skip)  // Skip the items based on pagination
            .limit(limitNumber); // Limit the number of items per page

        const totalProducts = await Product.countDocuments(filters); // Get the total number of products
        const totalPages = Math.ceil(totalProducts / limitNumber); // Calculate total pages

        res.status(200).json(new ApiResponse(200, {
            products,
            currentPage: pageNumber,
            totalPages,
            totalProducts
        }, "Products fetched successfully"));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
