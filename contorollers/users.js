// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const User = require("../models/user");
// const jsonWebToken = require("jsonwebtoken");
// const { body, validationResult } = require("express-validator");

// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getUserById = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       const error = new Error();
//       error.name = "userWrongData";
//       next(error);
//       return;
//     }
//     const user = await User.findById(userId);
//     if (!user) {
//       const error = new Error();
//       error.name = "userWrongId";
//       next(error);
//       return;
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };

// exports.createUser = [
//   body("email").isEmail().notEmpty(),
//   body("password").notEmpty(),

//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const error = new Error();
//       error.name = "userWrongData";
//       return next(error);
//     }
//     next();
//   },
//   async (req, res, next) => {
//     try {
//       const { name, about, avatar, password, email } = req.body;
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         const error = new Error();
//         error.name = "sameUserError";
//         next(error);
//         return;
//       }
//       const hashedPassword = await bcrypt.hash(String(password), 12);
//       const user = new User({
//         name,
//         about,
//         avatar,
//         password: hashedPassword,
//         email,
//       });
//       const savedUser = await user.save();
//       res.status(201).json(savedUser);
//     } catch (error) {
//       if (error.name === "ValidationError") {
//         const validationError = new Error();
//         validationError.name = "userWrongData";
//         next(validationError);
//       } else {
//         next(error);
//       }
//     }
//   },
// ];

// exports.updateUser = [
// body("name").optional().isLength({min: 2}).isLength({max: 30}),
// body("about").optional().isLength({min: 2}).isLength({max: 30}),

// (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error();
//     error.name = "userWrongData";
//     return next(error);
//   }
//   next();
// },

// async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { name, about } = req.body;
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { name, about },
//       { new: true }
//     );
//     const validationError = updatedUser.validateSync();
//     if (validationError) {
//       const error = new Error();
//       error.name = "userWrongData";
//       next(error);
//     }
//     if (!updatedUser) {
//       const error = new Error();
//       error.name = "userWrongId";
//       next(error);
//     }
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     next(error);
//   }
// }
// ];

// exports.updateAvatar =  [
//   body("avatar").matches(/^https?:\/\/(?:www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/),

//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const error = new Error();
//       error.name = "userWrongData";
//       return next(error);
//     }
//     next()
//   },
//   async (req, res) =>{
//   try {
//     const userId = req.user._id;
//     const { avatar } = req.body;
//     const updatedAvatar = await User.findByIdAndUpdate(
//       userId,
//       { avatar },
//       { new: true }
//     );
//     const validationError = updatedAvatar.validateSync("avatar");
//     if (validationError) {
//       const error = new Error();
//       error.name = "userWrongData";
//       next(error);
//     }
//     if (!updatedAvatar) {
//       const error = new Error();
//       error.name = "userWrongId";
//       next(error);
//     }
//     res.status(200).json(updatedAvatar);
//   } catch (error) {
//     next(error);
//   }
// }
// ];

// exports.login = [
//   body("email").isEmail().notEmpty(),
//   body("password").notEmpty(),

//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const error = new Error();
//       error.name = "userWrongData";
//       return next(error);
//     }
//    next()
//   },
// async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//       const error = new Error();
//       error.name = "userNotFound";
//       next(error);
//     }
//     const isValidUser = await bcrypt.compare(String(password), user.password);
//     if (isValidUser) {
//       const jwt = jsonWebToken.sign(
//         {
//           _id: user._id,
//         },
//         "SECRET"
//       );
//       res.cookie("jwt", jwt, {
//         maxAge: 3600000,
//         httpOnly: true,
//         sameSite: true,
//       });
//       res.send({ data: user.toJSON() });
//     } else {
//       const error = new Error();
//       error.name = "userNotFound";
//       next(error);
//     }
//   } catch (error) {
//     next(error);
//   }
// }
// ];

// exports.getUser = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     if (!user) {
//       const error = new Error();
//       error.name = "userWrongId";
//       next(error);
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jsonWebToken = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

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

exports.createUser = [
  body("email").isEmail().notEmpty(),
  body("password").notEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.name = "userWrongData";
      return next(error);
    }
    next();
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

exports.updateUser = [
  body("name").optional().isLength({ min: 2 }).isLength({ max: 30 }),
  body("about").optional().isLength({ min: 2 }).isLength({ max: 30 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.name = "userWrongData";
      return next(error);
    }
    next();
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
        return;
      }
      if (!updatedUser) {
        const error = new Error();
        error.name = "userWrongId";
        next(error);
        return;
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
];

exports.updateAvatar = [
  body("avatar").matches(
    /^https?:\/\/(?:www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/
  ),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.name = "userWrongData";
      return next(error);
    }
    next();
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
      const validationError = updatedAvatar.validateSync();
      if (validationError) {
        const error = new Error();
        error.name = "userWrongData";
        next(error);
        return;
      }
      if (!updatedAvatar) {
        const error = new Error();
        error.name = "userWrongId";
        next(error);
        return;
      }
      res.status(200).json(updatedAvatar);
    } catch (error) {
      next(error);
    }
  }
];

exports.login = [
  body("email").isEmail().notEmpty(),
  body("password").notEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.name = "userWrongData";
      return next(error);
    }
    next();
  },

  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        const error = new Error();
        error.name = "userNotFound";
        next(error);
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
        const error = new Error();
        error.name = "userNotFound";
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }
];

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
