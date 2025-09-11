import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";
import contactRouter from "./router/contactRoutes.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";

const app = express();
config({ path: './.env' });

app.use(
  cors({
    origin: ["https://auction-platform-frontend-cx0z.onrender.com", "http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload settings with limits
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
    abortOnLimit: true,
  })
);

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);
app.use("/api/v1/contact", contactRouter);

// Cron jobs
endedAuctionCron();
verifyCommissionCron();

// Database connection
connection();

// Error middleware
app.use(errorMiddleware);

export default app;
