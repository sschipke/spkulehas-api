import rateLimit from "express-rate-limit";

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hr
  max: 5,
  message: {
    error: "Too many password reset requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 10,
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  // skipSuccessfulRequests: true
});
