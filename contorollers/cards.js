const mongoose = require("mongoose");
const Card = require("../models/card");
const Joi = require("joi");

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    next(error);
  }
};

exports.createCard = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().uri().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      const validationError = new Error();
      validationError.name = "cardWrongData";
      return next(validationError);
    }

    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = new Card({ name, link, owner: ownerId });
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    next(error);
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      const error = new Error();
      error.name = "cardWrongData";
      return next(error);
    }
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      const error = new Error();
      error.name = "cardWrongId";
      return next(error);
    }
    if (req.user._id !== deletedCard.owner.toString()) {
      const error = new Error();
      error.name = "cardAccessError";
      return next(error);
    }
    res.status(200).json(deletedCard);
  } catch (error) {
    next(error);
  }
};

exports.likeCard = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      const error = new Error();
      error.name = "cardWrongData";
      return next(error);
    }
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedCard) {
      const error = new Error();
      error.name = "cardWrongId";
      return next(error);
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

exports.dislikeCard = async (req, res, next) => {
  try {
    const cardId = req.params.cardId;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      const error = new Error();
      error.name = "cardWrongData";
      return next(error);
    }
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedCard) {
      const error = new Error();
      error.name = "cardWrongId";
      return next(error);
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    next(error);
  }
};
