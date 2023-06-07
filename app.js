const express = require("express");
const mongoose = require("mongoose");
const cardRoutes = require("./routes/card");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());
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
app.use((req, res, next) => {
  req.user = {
    _id: "647edc6ba0fc4d1a40d2b772",
  };

  next();
});
app.use("/", cardRoutes);
app.use("/", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
