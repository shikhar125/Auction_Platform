import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { Bid } from "../models/bidSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import { calculateCommission } from "../controllers/commissionController.js";

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    console.log("🔄 Cron for ended auction running at:", now.toISOString());
    const endedAuctions = await Auction.find({
      endTime: { $lt: new Date() },
      commissionCalculated: false,
    });
    console.log(`📊 Found ${endedAuctions.length} ended auctions to process`);

    for (const auction of endedAuctions) {
      console.log(`🏁 Processing auction: ${auction.title} (ID: ${auction._id})`);
      try {
        const commissionAmount = await calculateCommission(auction._id);
        console.log(`💰 Commission calculated: ${commissionAmount} for auction ${auction.title}`);
        auction.commissionCalculated = true;

        const highestBidder = await Bid.findOne({
          auctionItem: auction._id,
          amount: auction.currentBid,
        });

        if (highestBidder) {
          console.log(`👤 Highest bidder found: ${highestBidder.bidder.userName} (ID: ${highestBidder.bidder.id}) with bid: ${highestBidder.amount}`);
          const auctioneer = await User.findById(auction.createdBy);
          console.log(`🎯 Auctioneer: ${auctioneer.userName} (Email: ${auctioneer.email})`);

          auction.highestBidder = highestBidder.bidder.id;
          await auction.save();
          console.log(`✅ Auction updated with highest bidder`);

          const bidder = await User.findById(highestBidder.bidder.id);
          console.log(`📧 Bidder details: ${bidder.userName} (Email: ${bidder.email})`);

          await User.findByIdAndUpdate(
            bidder._id,
            {
              $inc: {
                moneySpent: highestBidder.amount,
                auctionsWon: 1,
              },
            },
            { new: true }
          );
          console.log(`📈 Bidder stats updated: moneySpent +${highestBidder.amount}, auctionsWon +1`);

          await User.findByIdAndUpdate(
            auctioneer._id,
            {
              $inc: {
                unpaidCommission: commissionAmount,
              },
            },
            { new: true }
          );
          console.log(`💼 Auctioneer commission updated: unpaidCommission +${commissionAmount}`);

          const subject = `Congratulations! You won the auction for ${auction.title}`;
          const message = `Dear ${bidder.userName}, \n\nCongratulations! You have won the auction for ${auction.title}. \n\nBefore proceeding for payment contact your auctioneer via your auctioneer email: ${auctioneer.email} \n\nPlease complete your payment using one of the following methods:\n\n1. **Bank Transfer**: \n- Account Name: ${auctioneer.paymentMethods?.bankTransfer?.bankAccountName || 'Not provided'} \n- Account Number: ${auctioneer.paymentMethods?.bankTransfer?.bankAccountNumber || 'Not provided'} \n- Bank: ${auctioneer.paymentMethods?.bankTransfer?.bankName || 'Not provided'}\n\n2. **Easypaise**:\n- You can send payment via Easypaise: ${auctioneer.paymentMethods?.easypaisa?.easypaisaAccountNumber || 'Not provided'}\n\n3. **PayPal**:\n- Send payment to: ${auctioneer.paymentMethods?.paypal?.paypalEmail || 'Not provided'}\n\n4. **Cash on Delivery (COD)**:\n- If you prefer COD, you must pay 20% of the total amount upfront before delivery.\n- To pay the 20% upfront, use any of the above methods.\n- The remaining 80% will be paid upon delivery.\n- If you want to see the condition of your auction item then send your email on this: ${auctioneer.email}\n\nPlease ensure your payment is completed by [Payment Due Date]. Once we confirm the payment, the item will be shipped to you.\n\nThank you for participating!\n\nBest regards,\nShikhar Auction Team`;

          console.log("📤 SENDING EMAIL TO HIGHEST BIDDER...");
          console.log(`📧 To: ${bidder.email}`);
          console.log(`📧 Subject: ${subject}`);

          try {
            await sendEmail({ email: bidder.email, subject, message });
            console.log("✅ SUCCESSFULLY SENT EMAIL TO HIGHEST BIDDER");
          } catch (emailError) {
            console.error("❌ FAILED TO SEND EMAIL TO HIGHEST BIDDER:", emailError.message);
            console.error("❌ Bidder email:", bidder.email);
            console.error("❌ Email subject:", subject);
            console.error("❌ Email message preview:", message.substring(0, 200) + "...");
          }
        } else {
          console.log(`⚠️ No highest bidder found for auction: ${auction.title} (currentBid: ${auction.currentBid})`);
          await auction.save();
        }
      } catch (error) {
        console.error(`💥 Error processing auction ${auction.title}:`, error.message);
        console.error("Stack trace:", error.stack);
      }
    }

    if (endedAuctions.length === 0) {
      console.log("ℹ️ No ended auctions to process at this time");
    }
  });
};
