require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const PORT = process.env.PORT || 7000;
const userRoute = require("./backend/routes/userRoute");
const itemRoute = require("./backend/routes/itemRoute");
const errorHandler = require("./backend/middlewares/errorMiddleWare");

// Connect to mongodb and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Route MiddleWare
app.use("/api/users", userRoute);
app.use("/api/items", itemRoute);

// Error Middleware
app.use(errorHandler);

// Routes
// app.get("/", (req, res) => {
//   res.send("Home Page");
// });

// passing the frontend
app.use(express.static(path.join(__dirname, "./frontend/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});
