const express = require("express");

const router = express.Router();
const user = require("../contorollers/users");

router.get("/users", user.getUsers);

router.get("/users/:userId", user.getUserById);

router.post("/users", user.createUser);

router.patch("/users/me", user.updateUser);

module.exports = router;
