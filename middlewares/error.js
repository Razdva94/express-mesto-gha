exports.errorHandler = (err, req, res, next) => {
  if (!err.statusCode) {
    console.log(err)
    res.status(500).send({ message: "Произошла ошибка на сервере" });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
};

