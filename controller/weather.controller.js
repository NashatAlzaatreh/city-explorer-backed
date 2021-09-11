"use strict";

const axios = require("axios");
require("dotenv").config();
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const Forecast = require("../models/weather.model");
const Cache = require("../helper/cache.helper");

let cacheObject = new Cache();

console.log("Cache instance created");

const getWeather = async (request, response) => {
  const city_name = request.query.city_name;
  const lat = request.query.lat;
  const lon = request.query.lon;

  console.log("Check If cache has any forCast data");

  const foundData = cacheObject.foreCast.find(
    (location) => location.lat === lat && location.lon === lon
  );
  console.log("found ", foundData);
  console.log(lat);

  const counterInMilSec = 77777;
  const counterPassed = Date.now() - cacheObject.timeStamp > counterInMilSec;
  if (counterPassed) {
    console.log("Cache Reset");

    cacheObject = new Cache();
  }

  if (foundData) {
    console.log("send data from cache");

    response.json(foundData.data);
  } else {
    console.log("no cache found");

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

      cacheObject.foreCast.push({
        lat: lat,
        lon: lon,
        weatherBitArr: weatherBitArr,
      });

      console.log(cacheObject);

      if (weatherBitArr.length) {
        response.json(weatherBitArr);
      } else {
        response.send("error: 404.");
      }
    } else {
      response.json("error: 500.");
    }
  }
};

module.exports = getWeather;
