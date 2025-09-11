import express from "express";
import {
  addNewAuctionItem,
  getAllItems,
  getAuctionDetails,
  getMyAuctionItems,
  removeFromAuction,
  republishItem,
} from "../controllers/auctionItemController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { trackCommissionStatus } from "../middlewares/trackCommissionStatus.js";

const router = express.Router();

// ✅ Create Auction
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioneer", "Super Admin"),
  trackCommissionStatus,
  addNewAuctionItem
);

// ✅ Get All Auctions
router.get("/allitems", getAllItems);

// ✅ Get Auction by Id
router.get("/auction/:id", isAuthenticated, getAuctionDetails);

// ✅ Get My Auctions
router.get("/myitems", isAuthenticated, isAuthorized("Auctioneer", "Super Admin"), getMyAuctionItems);

// ✅ Delete Auction
router.delete("/delete/:id", isAuthenticated, isAuthorized("Auctioneer", "Super Admin"), removeFromAuction);

// ✅ Republish Auction
router.put("/item/republish/:id", isAuthenticated, isAuthorized("Auctioneer", "Super Admin"), republishItem);

export default router;
