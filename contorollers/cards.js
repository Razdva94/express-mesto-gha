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
      return res.status(400).json({ message: "Переданы некорректные данные при создании карточки." });
    }
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: "Карточка с указанным _id не найдена." });
    }
    card.deleteOne();
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};

exports.likeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedCard) {
      return res.status(404).json({ message: "Передан несуществующий _id карточки." });
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};

exports.dislikeCard = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!updatedCard) {
      return res.status(404).json({ message: "Передан несуществующий _id карточки." });
    }
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};
