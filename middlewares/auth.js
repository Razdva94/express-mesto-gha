const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    const error = new Error();
    error.name = "userNotFound";
    next(error);
    return;
  }
  let payload;
  try {
    payload = jwt.verify(token, "SECRET");
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
