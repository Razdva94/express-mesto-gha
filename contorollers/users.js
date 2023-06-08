const mongoose = require("mongoose");
const User = require("../models/user");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Переданы некорректные данные при создании пользователя.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Пользователь по указанному _id не найден." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};
exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Переданы некорректные данные при создании пользователя.",
      });
    }
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true }
    ).orFail(new Error("Пользователь с указанным _id не найден."));

    const validationError = updatedUser.validateSync();

    if (validationError) {
      return res.status(400).json({
        message: "Переданы некорректные данные при обновлении пользователя.",
      });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(404).json({
        message: "Пользователь с указанным _id не найден.",
      });
    }
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );
    const validationError = updatedAvatar.validateSync("avatar");
    if (validationError) {
      return res.status(400).json({
        message: "Переданы некорректные данные при обновлении аватара.",
      });
    }
    if (!updatedAvatar) {
      return res
        .status(404)
        .json({ message: "Пользователь с указанным _id не найден. " });
    }
    res.status(200).json(updatedAvatar);
  } catch (error) {
    res.status(500).json({ message: "Ошибка по умолчанию." });
  }
};
