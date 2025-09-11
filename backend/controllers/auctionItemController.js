import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { Bid } from "../models/bidSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// ✅ Add New Auction Item
export const addNewAuctionItem = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return next(new ErrorHandler("Auction item image is required.", 400));
  }

  const { image } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler("Image format not supported.", 400));
  }

  const { title, description, category, condition, startingBid, startTime, endTime } = req.body;

  if (!title || !description || !category || !condition || !startingBid || !startTime || !endTime) {
    return next(new ErrorHandler("All auction details are required.", 400));
  }

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (startDate < Date.now()) return next(new ErrorHandler("Start time must be in the future.", 400));
  if (startDate >= endDate) return next(new ErrorHandler("End time must be after start time.", 400));

  const activeAuctions = await Auction.find({ createdBy: req.user._id, endTime: { $gt: new Date() } });
  if (activeAuctions.length > 0) return next(new ErrorHandler("You already have one active auction.", 400));

  let cloudResponse;
  try {
    cloudResponse = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "MERN_AUCTION_PLATFORM_AUCTIONS",
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return next(new ErrorHandler("Failed to upload auction image.", 500));
  }

  const auctionItem = await Auction.create({
    title,
    description,
    category,
    condition,
    startingBid,
    startTime: startDate,
    endTime: endDate,
    image: {
      public_id: cloudResponse.public_id,
      url: cloudResponse.secure_url,
    },
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: `Auction item created and will be active on ${startTime}`,
    auctionItem,
  });
});

// ✅ Get All Auction Items
export const getAllItems = catchAsyncErrors(async (req, res) => {
  const items = await Auction.find();
  res.status(200).json({ success: true, items });
});

// ✅ Get Auction Details
export const getAuctionDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid Id.", 400));

  const auctionItem = await Auction.findById(id);
  if (!auctionItem) return next(new ErrorHandler("Auction not found.", 404));

  const bidders = auctionItem.bids.sort((a, b) => b.amount - a.amount);
  res.status(200).json({ success: true, auctionItem, bidders });
});

// ✅ Get My Auctions
export const getMyAuctionItems = catchAsyncErrors(async (req, res) => {
  const items = await Auction.find({ createdBy: req.user._id });
  res.status(200).json({ success: true, items });
});

// ✅ Delete Auction
export const removeFromAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid Id.", 400));

  const auctionItem = await Auction.findById(id);
  if (!auctionItem) return next(new ErrorHandler("Auction not found.", 404));

  await auctionItem.deleteOne();
  res.status(200).json({ success: true, message: "Auction item deleted successfully." });
});

// ✅ Republish Auction
export const republishItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return next(new ErrorHandler("Invalid Id.", 400));

  const auctionItem = await Auction.findById(id);
  if (!auctionItem) return next(new ErrorHandler("Auction not found.", 404));

  const { startTime, endTime } = req.body;
  if (!startTime || !endTime) return next(new ErrorHandler("StartTime and EndTime are required.", 400));

  const republishStart = new Date(startTime);
  const republishEnd = new Date(endTime);

  if (republishStart < Date.now()) return next(new ErrorHandler("Start time must be in future.", 400));
  if (republishStart >= republishEnd) return next(new ErrorHandler("End time must be after start time.", 400));

  await Auction.findByIdAndUpdate(id, {
    startTime: republishStart,
    endTime: republishEnd,
    bids: [],
    commissionCalculated: false,
    currentBid: 0,
    highestBidder: null,
  });

  await Bid.deleteMany({ auctionItem: auctionItem._id });
  res.status(200).json({ success: true, message: `Auction republished and will be active on ${startTime}` });
});
