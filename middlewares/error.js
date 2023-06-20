class UserWrongData extends Error {
  constructor(err) {
    super(err);
    this.name = "userWrongData";
    this.statusCode = 400;
    this.message = "Переданы некорректные данные пользователя.";
  }
}

class UserWrongId extends Error {
  constructor(err) {
    super(err);
    this.name = "userWrongId";
    this.statusCode = 404;
    this.message = "Пользователь по указанному _id не найден.";
  }
}

class UserNotFound extends Error {
  constructor(err) {
    super(err);
    this.name = "userNotFound";
    this.statusCode = 401;
    this.message = "Неправильная почта, пароль или ошибка в токене верификации";
  }
}

class SameUserError extends Error {
  constructor(err) {
    super(err);
    this.name = "sameUserError";
    this.statusCode = 409;
    this.message = "Пользователь с таким email уже существует.";
  }
}

class CardWrongData extends Error {
  constructor(err) {
    super(err);
    this.name = "cardWrongData";
    this.statusCode = 400;
    this.message = "Переданы некорректные данные карточки.";
  }
}

class CardWrongId extends Error {
  constructor(err) {
    super(err);
    this.name = "cardWrongId";
    this.statusCode = 404;
    this.message = "Карточка с указанным _id не найдена.";
  }
}

class CardAccessError extends Error {
  constructor(err) {
    super(err);
    this.name = "cardAccessError";
    this.statusCode = 403;
    this.message = "Ошибка доступа";
  }
}

exports.errorHandler = (err, req, res, next) => {
  let error;
  if (err.name === "userWrongData") {
    error = new UserWrongData(err);
  }
  if (err.name === "userWrongId") {
    error = new UserWrongId(err);
  }
  if (err.name === "userNotFound") {
    error = new UserNotFound(err);
  }
  if (err.name === "cardWrongData") {
    error = new CardWrongData(err);
  }
  if (err.name === "cardWrongId") {
    error = new CardWrongId(err);
  }
  if (err.name === "cardAccessError") {
    error = new CardAccessError(err);
  }
  if (err.name === "sameUserError"){
    error = new SameUserError(err)
  }
  if (!error) {
    res.status(500).send({ message: "Произошла ошибка на сервере" });
  }
  res.status(error.statusCode).send({ message: error.message });
};
