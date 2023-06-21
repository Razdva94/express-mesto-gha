const express = require("express");
const { celebrate, Segments, Joi } = require("celebrate");
const router = express.Router();
const card = require("../controllers/cards");

router.get("/cards", card.getCards);

router.post(
  "/cards",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().uri().required(),
    }),
  }),
  card.createCard
);

router.delete(
  "/cards/:cardId",
  celebrate({
    [Segments.PARAMS]: {
      cardId: Joi.string().hex().length(24).required(),
    },
  }),
  card.deleteCard
);

router.put(
  "/cards/:cardId/likes",
  celebrate({
    [Segments.PARAMS]: {
      cardId: Joi.string().hex().length(24).required(),
    },
  }),
  card.likeCard
);

router.delete(
  "/cards/:cardId/likes",
  celebrate({
    [Segments.PARAMS]: {
      cardId: Joi.string().hex().length(24).required(),
    },
  }),
  card.dislikeCard
);

module.exports = router;
