import {
  addNewAuctionItem,
  getAllItems,
  getAuctionDetails,
  getMyAuctionItems,
  removeFromAuction,
  republishItem,
} from "../controllers/auctionItemController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import express from "express";
import { trackCommissionStatus } from "../middlewares/trackCommissionStatus.js";

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioneer", "Super Admin"),
  trackCommissionStatus,
  addNewAuctionItem
);

router.get("/allitems", getAllItems);

router.get("/auction/:id", isAuthenticated, getAuctionDetails);

router.get(
  "/myitems",
  isAuthenticated,
  isAuthorized("Auctioneer", "Super Admin"),
  getMyAuctionItems
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Auctioneer", "Super Admin"),
  removeFromAuction
);

router.put(
  "/item/republish/:id",
  isAuthenticated,
  isAuthorized("Auctioneer", "Super Admin"),
  republishItem
);

export default router;
