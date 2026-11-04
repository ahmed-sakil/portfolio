import rateLimit from 'express-rate-limit';

// Rate limiter for admin login endpoint (brute-force defense)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

// Rate limiter for public contact message dispatch (anti-spam defense)
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 message dispatches per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many messages sent from this IP. Please wait a few minutes before trying again.',
  },
});

// Rate limiter for visitor telemetry pings (DDoS / DB bloat defense)
export const analyticsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // Allow up to 120 pings per 15 min per IP (~1 ping every 7.5s)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Telemetry ping rate limit reached.',
  },
});
