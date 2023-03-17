const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const mongoose = require("mongoose");
const { MONGO_URL } = process.env;

// Connect to MongoDB

mongoose
    .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.log(err));

// Routes
const authRoutes = require("./sources/users/authRoutes");
const userRoutes = require("./sources/users/userRoutes");
const followRoutes = require("./sources/interactions/followRequest");
const postRoutes = require("./sources/posts/postRoutes");

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", followRoutes);
app.use("/", postRoutes);

module.exports = app.listen(port, () => {
    console.log("Server started on port ", port);
});