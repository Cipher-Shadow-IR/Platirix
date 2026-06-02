function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;

  if (status >= 500) {
    console.error("Unhandled error:", err);
  }

  const message = err.expose ? err.message : "Internal server error";

  res.status(status).json({
    success: false,
    error: { message },
  });
}

module.exports = { errorHandler };
