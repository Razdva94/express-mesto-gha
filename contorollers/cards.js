const mongoose = require("mongoose");
const Card = require("../models/card");

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};

exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = new Card({ name, link });
    const validationError = card.validateSync();
    if (validationError) {
      return res.status(400).json({
        message: "Переданы некорректные данные при создании карточки.",
      });
    }
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    // eslint-disable-next-line prefer-destructuring
    const cardId = req.params.cardId;
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({
        message: "Переданы некорректные данные при удалении карточки.",
      });
    }
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (!deletedCard) {
      return res
        .status(404)
        .json({ message: "Карточка с указанным _id не найдена." });
    }
    res.status(200).json(deletedCard);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};

exports.likeCard = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      return res.status(400).json({
        message: "Переданы некорректные данные при постановке лайка.",
      });
    }
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedCard) {
      return res
        .status(404)
        .json({ message: "Передан несуществующий _id карточки." });
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};

exports.dislikeCard = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
      return res.status(400).json({
        message: "Переданы некорректные данные при удалении лайка.",
      });
    }
    const { cardId } = req.params;
    res.json(cardId);
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedCard) {
      return res
        .status(404)
        .json({ message: "Передан несуществующий _id карточки." });
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};
