const Card = require("../models/card");

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = new Card({ name, link });
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    card.deleteOne();
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
