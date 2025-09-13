export const generateToken = (user, message, statusCode, res) => {
  // Ensure environment variable exists
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
  }

  const token = user.generateJsonWebToken();

  // Default cookie expire if not provided
  const cookieExpireDays = process.env.COOKIE_EXPIRE || 7;

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure cookie in production
      sameSite: "strict",
    })
    .json({
      success: true,
      message,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
      token,
    });
};
