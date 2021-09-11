"use strict";
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();

const PORT = process.env.PORT;

const getWeather = require("./controller/weather.controller");
const getMovies = require("./controller/movies.controller");
const getIndex = require("./controller/index.controller");

app.get("/", getIndex);
app.get("/weather", getWeather);
app.get("/movies", getMovies);

app.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
});
