function errorHandler(err, _req, res, _next) {
  console.error("Unhandled error:", err);

  const status = err.status || 500;
  const message = err.expose ? err.message : "Internal server error";

  res.status(status).json({
    success: false,
    error: { message },
  });
}

module.exports = { errorHandler };
