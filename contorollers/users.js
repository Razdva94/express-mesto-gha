const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");
const Joi = require("joi");

exports.getUsers = async (req, res) => {
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
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error();
      error.name = "userWrongData";
      next(error);
      return;
    }
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

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.createUser = [
  (req, res, next) => {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      const validationError = new Error();
      validationError.name = "userWrongData";
      next(validationError);
    } else {
      next();
    }
  },
  async (req, res, next) => {
    try {
      const { name, about, avatar, password, email } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error();
        error.name = "sameUserError";
        next(error);
        return;
      }
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
        const validationError = new Error();
        validationError.name = "userWrongData";
        next(validationError);
      } else {
        next(error);
      }
    }
  },
];

const updateUserSchema = Joi.object({
  name: Joi.string().optional().min(2).max(30),
  about: Joi.string().optional().min(2).max(30),
});

exports.updateUser = [
  (req, res, next) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      const validationError = new Error();
      validationError.name = "userWrongData";
      next(validationError);
    } else {
      next();
    }
  },
  async (req, res, next) => {
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
        const error = new Error();
        error.name = "userWrongData";
        next(error);
      }
      if (!updatedUser) {
        const error = new Error();
        error.name = "userWrongId";
        next(error);
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
];

const updateAvatarSchema = Joi.object({
  avatar: Joi.string()
    .pattern(/^https?:\/\/(?:www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/)
    .required(),
});

exports.updateAvatar = [
  (req, res, next) => {
    const { error } = updateAvatarSchema.validate(req.body);
    if (error) {
      const validationError = new Error();
      validationError.name = "userWrongData";
      next(validationError);
    } else {
      next();
    }
  },
  async (req, res, next) => {
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
        const error = new Error();
        error.name = "userWrongData";
        next(error);
      }
      if (!updatedAvatar) {
        const error = new Error();
        error.name = "userWrongId";
        next(error);
      }
      res.status(200).json(updatedAvatar);
    } catch (error) {
      next(error);
    }
  },
];

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.login = [
  (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      const validationError = new Error();
      validationError.name = "userWrongData";
      next(validationError);
    } else {
      next();
    }
  },
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        const error = new Error();
        error.name = "userNotFound";
        next(error);
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
        const error = new Error();
        error.name = "userNotFound";
        next(error);
      }
    } catch (error) {
      next(error);
    }
  },
];

exports.getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error();
      error.name = "userWrongId";
      next(error);
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
