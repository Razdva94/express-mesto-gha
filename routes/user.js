const express = require("express");
const router = express.Router();
const user = require("../contorollers/users");
// const {auth} = require("../middlewares/auth")



router.get("/users", user.getUsers);

router.patch("/users/me", user.updateUser);

router.get("/users/me", user.getUser);

router.patch("/users/me/avatar", user.updateAvatar);

router.get("/users/:userId",  user.getUserById);

module.exports = router;
