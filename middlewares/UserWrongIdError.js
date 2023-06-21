class UserWrongIdError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserWrongId";
    this.statusCode = 404;
  }
}

module.exports = UserWrongIdError;