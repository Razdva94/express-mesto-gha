const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const WrongData = require('../middlewares/WrongDataError');
const WrongId = require('../middlewares/WrongIdError');
const NotFound = require('../middlewares/NotFoundError');
const SameUserError = require('../middlewares/SameUserError');

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
      next(new WrongId('Пользователь по указанному _id не найден.'));
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new WrongData('Переданы некорректные данные пользователя.'));
    } else {
      next(error);
    }
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, password, email,
    } = req.body;
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
      error.code === 11000
      && error.keyPattern
      && error.keyPattern.email === 1
    ) {
      next(new SameUserError('Пользователь с таким email уже существует.'));
    } else if (error.name === 'ValidationError') {
      next(new WrongData('Переданы некорректные данные пользователя.'));
    }
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true },
    );

    if (!updatedUser) {
      next(new WrongId('Пользователь по указанному _id не найден.'));
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(WrongData('Переданы некорректные данные пользователя.'));
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
      { new: true },
    );
    const validationError = updatedAvatar.validateSync();
    if (validationError) {
      next(new WrongData('Некорректные данные пользователя.'));
      return;
    }
    if (!updatedAvatar) {
      next(new WrongId('Пользователь по указанному _id не найден.'));
      return;
    }
    res.status(200).json(updatedAvatar);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(WrongData('Переданы некорректные данные ссылки на аватар.'));
    } else {
      next(error);
    }
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new NotFound('Пользователь с указанным email не найден.'));
      return;
    }
    const isValidUser = await bcrypt.compare(String(password), user.password);
    if (isValidUser) {
      const jwtToken = jsonWebToken.sign(
        {
          _id: user._id,
        },
        'SECRET',
      );
      res.cookie('jwt', jwtToken, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ data: user.toJSON() });
    } else {
      next(new NotFound('Неверный пароль.'));
    }
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      next(new WrongId('Пользователь по указанному _id не найден.'));
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
