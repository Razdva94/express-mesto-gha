const User = require("../models/user");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.user._id;
    console.log("Айди юзера", userId);
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { name, about });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
