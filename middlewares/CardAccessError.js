class CardAccessError extends Error {
  constructor(message) {
    super(message);
    this.name = "CardAccessError";
    this.statusCode = 403;
  }
}

module.exports = CardAccessError;
