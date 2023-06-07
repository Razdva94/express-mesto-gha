const express = require("express");

const router = express.Router();
const card = require("../contorollers/cards");

router.get("/cards", card.getCards);

router.post("/cards", card.createCard);

router.delete("/cards/:cardId", card.deleteCard);

module.exports = router;