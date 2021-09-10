"use strict";
const express = require("express"); // require the express package
const app = express(); // initialize your express app instance
const cors = require("cors");
const axios = require("axios");
app.use(cors());

require("dotenv").config();

const PORT = process.env.PORT;

const weather = require("./data/weather.json");

app.get(
  "/", // our endpoint name
  function (req, res) {
    // callback function of what we should do with our request
    res.send("Hello World"); // our endpoint function response
  }
);

class Forecast {
  constructor(description, date, low_temp, max_temp) {
    // this.date = data.valid_date;
    // this.description = data.weather.description;
    this.description = description;
    this.date = date;
    this.low_temp = low_temp;
    this.max_temp = max_temp;
    Forecast.all.push(this);
  }
}

Forecast.all = [];

class Movies {
  constructor(
    title,
    overview,
    vote_average,
    vote_count,
    poster_path,
    popularity,
    release_date
  ) {
    this.title = title;
    this.overview = overview;
    this.vote_average = vote_average;
    this.vote_count = vote_count;
    this.poster_path = poster_path;
    this.popularity = popularity;
    this.release_date = release_date;
    Movies.allMovies.push(this);
  }
}
Movies.allMovies = [];

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

// =================== weatherBit ======================

app.get("/weather", async (request, response) => {
  const city_name = request.query.city_name;
  const lat = request.query.lat;
  const lon = request.query.lon;

  const weatherBitUrl = "https://api.weatherbit.io/v2.0/forecast/daily";

  const weatherBitResponse = await axios.get(
    `${weatherBitUrl}?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`
  );
  // Model the data according to the ticket
  // response.json(weatherBitResponse.data);
  // console.log(weatherBitResponse.data);
  if (lon) {
    const weatherBitArr = weatherBitResponse.data.data.map((weatherData) => {
      return new Forecast(
        weatherData.weather.description,
        weatherData.datetime,
        weatherData.low_temp,
        weatherData.max_temp
      );
    });

    if (weatherBitArr.length) {
      response.json(weatherBitArr);
      // console.log(weatherBitArr);
    } else {
      response.send("error: 0000000000000.");
    }
  } else {
    // response.send("try another city")
    response.json("error: 11111111111111111.");
  }
});
// ===================== weatherBit =======================
// ====================== Movies ===========================
app.get("/movies", async (request, response) => {
  const city_name = request.query.city_name;
  const moviesUrl = "https://api.themoviedb.org/3/movie/top_rated";

  const moviesResponse = await axios.get(
    `${moviesUrl}?api_key=${MOVIE_API_KEY}&city_name=${city_name}`
  );

  // Model the data according to the ticket

  // response.json(moviesResponse.data);
  // console.log(moviesResponse);

  if (city_name) {
    const moviesArr = moviesResponse.data.results.map((moviesData) => {
      return new Movies(
        moviesData.title,
        moviesData.overview,
        moviesData.vote_average,
        moviesData.vote_count,
        moviesData.poster_path,
        moviesData.popularity,
        moviesData.release_date
      );
    });

    if (moviesArr.length) {
      response.json(moviesArr);
      console.log(moviesArr);
    } else {
      response.send("error: 0000000000000.");
    }
  } else {
    response.json("error: 11111111111111111.");
  }
});
// ===================== Movies ======================

app.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
}); // kick start the express server to work
