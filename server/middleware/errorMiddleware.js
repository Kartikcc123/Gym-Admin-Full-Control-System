// Catch-all for requests that don't match any of your routes (404 Not Found)
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passes the error to the errorHandler below
};

// Global error handler for all other errors (e.g., MongoDB validation failures, server crashes)
export const errorHandler = (err, req, res, next) => {
  // Sometimes a 200 status code is still set even if there's an error, so we force a 500 if so
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Only show the stack trace if you are in development mode, hide it in production for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};