// A simple wrapper for our async route handlers
// It catches any errors and passes them to our error handling middleware
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
