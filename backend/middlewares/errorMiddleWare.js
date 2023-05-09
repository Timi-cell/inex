const errorHandler = (err, res, req, next) => {
  // check if there is a status code , else use 500
  const statusCode = res.statusCode ? res.statusCode : 500;
  // set the response code with the statuscode
  res.status(statusCode);

  // send the error message and stack in the form of json object to the response
  if (statusCode === 500) {
    res.json({
      message: "Please check your network connectivity OR refresh the page.",
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
  } else {
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
  }
};

module.exports = errorHandler;
