class UserWrongDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserWrongData";
    this.statusCode = 400;
  }
}
module.exports = UserWrongDataError;
