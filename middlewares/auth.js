const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UserNotFound('Необходима авторизация'))
    return;
  }
  let payload;
  try {
    payload = jwt.verify(token, "SECRET");
  } catch (err) {
    next(new UserNotFound('Необходима авторизация'))
    return;
  }
  req.user = payload;
  next();
};
