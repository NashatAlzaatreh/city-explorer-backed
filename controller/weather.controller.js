"use strict";

const axios = require("axios");
require("dotenv").config();
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const Forecast = require("../models/weather.model");

const getWeather = async (request, response) => {
  const city_name = request.query.city_name;
  const lat = request.query.lat;
  const lon = request.query.lon;

  const weatherBitUrl = "https://api.weatherbit.io/v2.0/forecast/daily";
  const weatherBitResponse = await axios.get(
    `${weatherBitUrl}?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`
  );

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
    } else {
      response.send("error: 404.");
    }
  } else {
    response.json("error: 500.");
  }
};

module.exports = getWeather;
