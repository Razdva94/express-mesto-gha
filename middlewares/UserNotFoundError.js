class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFound";
    this.statusCode = 401;
  }
}

module.exports = UserNotFoundError;
