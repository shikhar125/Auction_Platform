import { User } from "../models/userSchema.js";
import { PaymentProof } from "../models/commissionProofSchema.js";
import { Commission } from "../models/commissionSchema.js";
import cron from "node-cron";
import { sendEmail } from "../utils/sendEmail.js";

export const verifyCommissionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running Verify Commission Cron...");
    const approvedProofs = await PaymentProof.find({ status: "Approved" });
    for (const proof of approvedProofs) {
      try {
        const user = await User.findById(proof.userId);
        let updatedUserData = {};
        if (user) {
          if (user.unpaidCommission >= proof.amount) {
            updatedUserData = await User.findByIdAndUpdate(
              user._id,
              {
                $inc: {
                  unpaidCommission: -proof.amount,
                },
              },
              { new: true }
            );
            await PaymentProof.findByIdAndUpdate(proof._id, {
              status: "Settled",
            });
          } else {
            updatedUserData = await User.findByIdAndUpdate(
              user._id,
              {
                unpaidCommission: 0,
              },
              { new: true }
            );
            await PaymentProof.findByIdAndUpdate(proof._id, {
              status: "Settled",
            });
          }
          await Commission.create({
            amount: proof.amount,
            user: user._id,
          });
          const settlementDate = new Date(Date.now())
            .toString()
            .substring(0, 15);

          const templateData = {
            userName: user.userName,
            amountSettled: proof.amount,
            unpaidAmount: updatedUserData.unpaidCommission,
            settlementDate: settlementDate,
          };
          const subject = "Commission Payment Confirmation";
          const message = `Dear ${user.userName},

Your commission payment of $${proof.amount} has been processed successfully.

Settlement Details:
- Amount Settled: $${proof.amount}
- Remaining Unpaid Commission: $${updatedUserData.unpaidCommission}
- Settlement Date: ${settlementDate}

Thank you for your payment!

Best regards,
Shikhar Auction Team`;

          try {
            await sendEmail({
              email: user.email,
              subject: subject,
              message: message
            });
            console.log(`Commission confirmation email sent to ${user.email}`);
          } catch (emailError) {
            console.error(`Failed to send commission email to ${user.email}:`, emailError.message);
          }
        }
        console.log(`User ${proof.userId} paid commission of ${proof.amount}`);
      } catch (error) {
        console.error(
          `Error processing commission proof for user ${proof.userId}: ${error.message}`
        );
      }
    }
  });
};
