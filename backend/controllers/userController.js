import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

// ✅ Register user
export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Image is required.", 400));
  }

  const { profileImage } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("Profile image format not supported.", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    easypaisaAccountNumber,
    paypalEmail,
  } = req.body;

  if (!userName || !email || !phone || !password || !address || !role) {
    return next(new ErrorHandler("Please fill all required fields.", 400));
  }

  if (role === "Auctioneer") {
    if (!bankAccountName || !bankAccountNumber || !bankName || !easypaisaAccountNumber || !paypalEmail) {
      return next(new ErrorHandler("Please provide full bank and payment details for Auctioneer.", 400));
    }
  }

  const existingUser = await User.findOne({ email }).select("+password");
  if (existingUser) {
    return next(new ErrorHandler("User already registered with this email.", 400));
  }

  let cloudResponse;
  try {
    cloudResponse = await cloudinary.uploader.upload(profileImage.tempFilePath, {
      folder: "MERN_AUCTION_PLATFORM_USERS",
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return next(new ErrorHandler("Failed to upload profile image.", 500));
  }

  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: {
      public_id: cloudResponse.public_id,
      url: cloudResponse.secure_url,
    },
    paymentMethods: {
      bankTransfer: { bankAccountNumber, bankAccountName, bankName },
      easypaisa: { easypaisaAccountNumber },
      paypal: { paypalEmail },
    },
  });

  // ✅ Generate token for frontend
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    user: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      token,
    },
  });
});

// ✅ Login user
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }

  // ✅ G
