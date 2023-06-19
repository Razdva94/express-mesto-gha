const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");

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
    if (error.name === "ValidationError") {
      console.log(error);
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
    );
    const validationError = updatedUser.validateSync();
    if (validationError) {
      return res.status(400).json({
        message: "Переданы некорректные данные при создании пользователя.",
      });
    }
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Пользователь с указанным _id не найден." });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    const isValidUser = await bcrypt.compare(String(password), user.password);
    if (isValidUser) {
      const jwt = jsonWebToken.sign(
        {
          _id: user._id,
        },
        "SECRET"
      );
      res.cookie("jwt", jwt, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ data: user.toJSON() });
    } else {
      res.status(401).send({ message: "Переданы некорректные данные" });
    }
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res) => {
  try { 
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь ненайден" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};