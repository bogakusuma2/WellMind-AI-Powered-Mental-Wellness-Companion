const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: "Something went wrong on the server.",
    message: err.message,
  });
};

module.exports = errorHandler;