const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, "SECRET");
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
