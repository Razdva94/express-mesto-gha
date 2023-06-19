const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cardRoutes = require("./routes/card");
const userRoutes = require("./routes/user");
const {login, createUser} =require("./contorollers/users")
const {auth} = require("./middlewares/auth")



const app = express();
app.use(express.json());
app.use(cookieParser())
const mongoURI = "mongodb://0.0.0.0:27017/mestodb";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.post('/signin', login );
app.post('/signup', createUser); 
app.use(auth);
app.use("/", cardRoutes);
app.use("/", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ message: "Переданы некорректные данные." });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
