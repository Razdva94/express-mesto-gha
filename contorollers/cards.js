const mongoose = require("mongoose");
const Card = require("../models/card");
const { body, validationResult } = require("express-validator");

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    next(error);
  }
};

exports.createCard = [
  body("name").notEmpty().isLength({ min: 2 }).isLength({ max: 30 }),
  body("link").notEmpty().isURL(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.name = "cardWrongData";
      return next(error);
    }
    next();
  },

  async (req, res) => {
    try {
      const { name, link } = req.body;
      const ownerId = req.user._id;
      const card = new Card({ name, link, owner: ownerId });
      const validationError = card.validateSync();
      if (validationError) {
        const error = new Error();
        error.name = "cardWrongData";
        next(error);
      }
      const savedCard = await card.save();
      res.status(201).json(savedCard);
    } catch (error) {
      next(error);
    }
  },
];

exports.deleteCard = async (req, res) => {
  try {
    // eslint-disable-next-line prefer-destructuring
    const cardId = req.params.cardId;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      const error = new Error();
      error.name = "cardWrongData";
      next(error);
    }
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      const error = new Error();
      error.name = "cardWrongId";
      next(error);
    }
    if (req.user._id !== deletedCard.owner.toString()) {
      const error = new Error();
      error.name = "cardAccessError";
      next(error);
    }
    res.status(200).json(deletedCard);
  } catch (error) {
    next(error);
  }
};

exports.likeCard = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      const error = new Error();
      error.name = "cardWrongData";
      next(error);
    }
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedCard) {
      const error = new Error();
      error.name = "cardWrongId";
      next(error);
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

exports.dislikeCard = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      const error = new Error();
      error.name = "cardWrongData";
      next(error);
    }
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedCard) {
      const error = new Error();
      error.name = "cardWrongId";
      next(error);
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    next(error);
  }
};
