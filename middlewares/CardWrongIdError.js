class CardWrongIdError extends Error {
  constructor(message) {
    super(message);
    this.name = "CardWrongId";
    this.statusCode = 404;
  }
}

module.exports = CardWrongIdError;
