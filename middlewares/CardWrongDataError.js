class CardWrongDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "CardWrongData";
    this.statusCode = 400;
  }
}

module.exports = CardWrongDataError;
