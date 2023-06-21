const Card = require("../models/card");
const CardWrongData = require("../middlewares/CardWrongDataError");
const CardWrongId = require("../middlewares/CardWrongIdError");
const CardAccessError = require("../middlewares/CardAccessError");

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
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = new Card({ name, link, owner: ownerId });
    const validationError = card.validateSync();
    if (validationError) {
      next(new CardWrongData("Переданы некорректные данные карточки."));
      return;
    }
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    if (error.statusCode === 400) {
      next(new CardWrongData("Переданы некорректные данные карточки."));
    }
    next(error);
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      next(new CardWrongId("Карточка с указанным _id не найдена."));
      return;
    }
    if (req.user._id !== card.owner.toString()) {
      next(new CardAccessError("Ошибка доступа"));
      return;
    }
    await Card.deleteOne({ _id: cardId });
    res.status(200).json(card);
  } catch (error) {
    if (error.statusCode === 400) {
      next(new CardWrongData("Переданы некорректные данные карточки."));
    } else {
      next(error);
    }
  }
};

exports.likeCard = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!updatedCard) {
      next(new CardWrongId("Карточка с указанным _id не найдена."));
      return;
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    if (error.statusCode === 400) {
      next(new CardWrongData("Переданы некорректные данные карточки."));
    } else {
      next(error);
    }
  }
};

exports.dislikeCard = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!updatedCard) {
      next(new CardWrongId("Карточка с указанным _id не найдена."));
      return;
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    if (error.statusCode === 400) {
      next(new CardWrongData("Переданы некорректные данные карточки."));
    } else {
      next(error);
    }
  }
};