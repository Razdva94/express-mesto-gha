const bcrypt = require("bcrypt");
const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");
const UserWrongData = require("../middlewares/UserWrongDataError");
const UserWrongId = require("../middlewares/UserWrongIdError");
const UserNotFound = require("../middlewares/UserNotFoundError");
const SameUserError = require("../middlewares/SameUserError");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      next(new UserWrongId("Пользователь по указанному _id не найден."));
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error.statusCode === 400) {
      next(new UserWrongData("Переданы некорректные данные пользователя."));
    } else {
      next(error);
    }
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(String(password), 12);
    const user = new User({
      name,
      about,
      avatar,
      password: hashedPassword,
      email,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.email === 1
    ) {
      next(new SameUserError("Пользователь с таким email уже существует."));
    } else if (error.name === "ValidationError") {
      next(new UserWrongData("Переданы некорректные данные пользователя."));
    } else {
      next(error);
    }
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true }
    );

    if (!updatedUser) {
      next(new UserWrongId("Пользователь по указанному _id не найден."));
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.statusCode === 400) {
      next(UserWrongData("Переданы некорректные данные пользователя."));
    } else {
      next(error);
    }
  }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );
    const validationError = updatedAvatar.validateSync();
    if (validationError) {
      next(new UserWrongData("Некорректные данные пользователя."));
      return;
    }
    if (!updatedAvatar) {
      next(new UserWrongId("Пользователь по указанному _id не найден."));
      return;
    }
    res.status(200).json(updatedAvatar);
  } catch (error) {
    if (error.statusCode === 400) {
      next(UserWrongData("Переданы некорректные данные ссылки на аватар."));
    } else {
      next(error);
    }
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      next(new UserNotFound("Пользователь с указанным email не найден."));
      return;
    }
    const isValidUser = await bcrypt.compare(String(password), user.password);
    if (isValidUser) {
      const jwtToken = jsonWebToken.sign(
        {
          _id: user._id,
        },
        "SECRET"
      );
      res.cookie("jwt", jwtToken, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ data: user.toJSON() });
    } else {
      next(new UserNotFound("Неверный пароль."));
    }
  } catch (error) {
    if (error.statusCode === 400) {
      next(UserWrongData("Переданы некорректные данные"));
    } else {
      next(error);
    }
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error();
      error.name = "userWrongId";
      next(error);
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
