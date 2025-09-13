import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies?.token;

  // Agar cookie me token nahi hai → header se uthao
  if (!token && req.headers.authorization) {
    if (req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  }

  if (!token) {
    return next(new ErrorHandler("User not authenticated.", 401));
  }

  // ✅ Secret check
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token.", 401));
  }

  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  next();
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};
