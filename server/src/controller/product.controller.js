import BuyProducts from "../models/buyProduct.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const saveProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, expiryDate, stock, category, userId } =
    req.body;

  //  Required field validation
  if (!name || !price || !category || !userId) {
    throw new ApiError(400, "Required fields are missing");
  }

  //  Stock validation
  if (stock && Number(stock) > 100) {
    throw new ApiError(400, "Stock cannot be more than 100");
  }
  if (stock && Number(stock) < 0) {
    throw new ApiError(400, "Stock cannot be negative");
  }

  //  Price validation
  if (isNaN(price) || Number(price) <= 0) {
    throw new ApiError(400, "Price must be a valid positive number");
  }

  //  Expiry date validation
  if (expiryDate) {
    const expDate = new Date(expiryDate);

    if (isNaN(expDate.getTime())) {
      throw new ApiError(400, "Invalid expiry date format");
    }

    if (expDate <= new Date()) {
      throw new ApiError(400, "Expiry date must be in the future");
    }
  }

  //  Prevent duplicate product (no previous data allowed with same name)
  const existingProduct = await Product.findOne({
    name: name.trim(),
    admin: userId,
  });

  if (existingProduct) {
    throw new ApiError(409, "Product with this name already exists");
  }

  const newUser = await User.findById(userId);
  if (!newUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the user is an admin
  if (newUser.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to add products" });
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
    admin: newUser,
  };

  const product = new Product(newProduct);
  // Save the product to the database
  await product.save();
  res
    .status(201)
    .json(new ApiResponse(200, "Product Added Successfull", product));
});

// Paginated getAllProducts route
export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 4,
    search = "",
    categoryFilter = "",
    availabilityFilter = "",
    disabled = 2,
  } = req.query; // Default to page 1 and 4 items per page

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  // Calculate the skip value for MongoDB (which items to skip)
  const skip = (pageNumber - 1) * limitNumber;

  const filters = {};

  // Search filter
  if (search.trim()) {
    filters.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Category filter (if provided and not "2")
  if (categoryFilter !== "2" && categoryFilter.trim()) {
    filters.category = categoryFilter;
  }

  // Availability filter (if provided and not "2")
  if (availabilityFilter !== "2" && availabilityFilter.trim()) {
    if (availabilityFilter === "1") {
      // Products with stock > 0 (available)
      filters.stock = { $gt: 0 }; // More than 0 stock
    } else if (availabilityFilter === "0") {
      // Products with stock == 0 (out of stock)
      filters.stock = 0; // Out of stock
    }
  }

  // Disabled filter (if not "2", handle availability status)
  if (disabled !== "2") {
    // "1" means disabled value to here only at other same upper rules
    filters.isAvailable = disabled !== "0";
  }

  console.log(filters);

  try {
    const products = await Product.find(filters)
      .skip(skip) // Skip the items based on pagination
      .limit(limitNumber); // Limit the number of items per page

    const totalProducts = await Product.countDocuments(filters); // Get the total number of products
    const totalPages = Math.ceil(totalProducts / limitNumber); // Calculate total pages

    res.status(200).json(
      new ApiResponse(
        200,
        {
          products,
          currentPage: pageNumber,
          totalPages,
          totalProducts,
        },
        "Products fetched successfully"
      )
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




export const BuyProduct = asyncHandler(async (req, res) => {
    try {
        const products = req.body;
        console.log(products);

        if (!products || products.length <= 0) {
            return res.status(404).json({ message: 'Product not found' });
        }




        // Use a for...of loop instead of forEach to handle async/await properly
        for (const product of products) {

            const alreadySavedProduct = await Product.findById(product.productId);
            if (!alreadySavedProduct) {
                throw new Error("No product found while buying Product");
            }

            if (alreadySavedProduct.stock <= 0) {
                return res.status(500).json({ message: "No stock available" });
            }

            // Update product stock
            alreadySavedProduct.stock -= parseInt(product.totalItem);

            // Save the updated product
            await alreadySavedProduct.save();

            // Record the purchase in BuyProducts
            await BuyProducts.create({
                user: product.userId,
                product: product.productId,
                price: parseInt(product.totalPrice),
                totalItems: parseInt(product.totalItem),
                payment_gateway: "Cash",

            });
            // await Notification.create({
            //     user: product.userId,
            //     message: `You have purchase ${product.productName},  ${product.totalItem} items.`
            // });
        }

        return res.status(200).json(new ApiResponse(200, null, "Product bought successfully"));

    } catch (error) {
        console.error("Error during product purchase:", error);
        return res.status(500).json({ message: error.message });
    }
});


// Controller to manage booked products
export const manageBookedProduct = asyncHandler(async (req, res) => {

    // Extract query parameters (with default values)
    const { page = 1, limit = 10, status, search = "", id } = req.query;


    if (!id || id === undefined || id === "undefined") {

        throw new Error("No id available")
    }
    // Find the user by id
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const skip = (page - 1) * limit; // Pagination skip logic


    // Admin logic (fetch all booked products)
    if (user.role === "admin") {
        // Search filter based on the search term (username search)
        const searchFilter = search
            ? { user: await User.findOne({ userName: { $regex: search, $options: "i" } }).select("_id") } // Find user by username
            : {}; // If no search term, no filter is applied


        const bookedProducts = await BuyProducts.find({
            ...searchFilter,
            status: status || { $in: ["pending", "completed", "cancelled"] },

        })
            .populate("user", "userName") // Populate with the username of the user who made the booking
            .populate("product", "name")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 }); // Sort by newest bookings

        // Count the total number of booked products for pagination
        const total = await BuyProducts.countDocuments({
            ...searchFilter,

            status: status || { $in: ["pending", "completed", "cancelled"] },

        });

        return res.status(200).json({
            success: true,
            data: bookedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit), // Calculate total pages
            },
        });
    }

    // User logic (fetch only the logged-in user's booked products)
    else {

        // Search filter based on the search term (username search)
        const searchFilter = search
            ? { product: await Product.findOne({ name: { $regex: search, $options: "i" } }).select("_id") }
            : {}; // If no search term, no filter is applied


        const bookedProducts = await BuyProducts.find({
            user: user._id,
            status: status || { $in: ["pending", "completed", "cancelled"] },
            ...searchFilter,
        })
            .skip(skip)
            .populate("product", "name")
            .limit(Number(limit))
            .sort({ createdAt: -1 }); // Sort by newest bookings

        // Count the total number of bookings for the user
        const total = await BuyProducts.countDocuments({
            user: user._id,
            status: status || { $in: ["pending", "completed", "cancelled"] },
            ...searchFilter,
        });

        return res.status(200).json({
            success: true,
            data: bookedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit), // Calculate total pages
            },
        });
    }
});




// Controller to generate the bill for a user
export const generateBill = asyncHandler(async (req, res) => {
    const { userId, status } = req.query;

    const products = await BuyProducts.find({ user: userId }).populate("product", "name price payment_gateway").populate("user", "userName");

    if (products.length <= 0) {
        throw new Error("No products found");
    }

    let totalPrice = 0;


    const allTheDetails = products.map((product) => {
        totalPrice += Number(product.price);
        if (product.status !== "completed") {
          throw new ApiError(400, "Product is not completed");
        }
        // product.status = status;
      

        
        return {
            name: product.product.name,
            perPPrice: product.product.price,
            totalItems: product.totalItems,
            soTheMultiPrice: product.price,
            status: product.status,
            payment_gateway: product.payment_gateway
        }
    });

    console.log(allTheDetails);
    

    let anotherPrice = totalPrice;


    if (status) {
        await Promise.all(products.map(p => p.save()));
    }
    return res.status(200).json(
        new ApiResponse(200, {
            allTheDetails,
            anotherPrice,
            userName: products[0].user.userName
        })
    )



});
