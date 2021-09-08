"use strict";
const express = require("express"); // require the express package
const app = express(); // initialize your express app instance
const cors = require("cors");
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
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

class Moviez {
  constructor(title, overview, vote, count) {
    this.title = title;
    this.overview = overview;
    this.vote = vote;
    this.count = count;
  }
}

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.get("/weather", (request, response) => {
  let city_name = request.query.city_name;
  let lon = request.query.lon;
  let lat = request.query.lat;

  const returedArray = weather.find((item) => {
    retrun(item.city_name.toLowerCase() === city_name.toLowerCase());
  });

  if (returedArray) {
    let newArray = returedArray.data.map((item) => {
      return new Forecast(item.datetime, item.weather.description);
    });
    response.json(newArray);
  } else {
    response.json("data not found");
  }

  const weatherBitUrl = "https://api.weatherbit.io/v2.0/forecast/daily";
  const weatherBitResponse = await axios.get(
    `${weatherBitUrl}?city=${city_name}&key=${WEATHER_API_KEY}`
  );

  if (city_name) {
    let bitArr = weatherBitResponse.data.data.map((value) => {
      // console.log(value);
      return new Forecast(
        ` Low temp: ${value.low_temp}, and high temp: ${value.high_temp} , with ${value.weather.description} `,
        ` ${value.datetime}`
      );
    });

    let bitArr2 = bitArr[0];
    if (bitArr.length) {
      response.json(bitArr2);
    } else {
      response.send("error");
    }
  } else {
    response.json("error");
  }

  const MOVIES_API_KEY = process.env.MOVIES_API_KEY;

  app.get("/movies", async (request, response) => {
    const city_name = request.query.city_name;

    const movieUrl = `https://api.themoviedb.org/3/movie/76341?api_key=${MOVIES_API_KEY}`;
    const movieResponse = await axios.get(`${movieUrl}&query=${city_name}`);

    if (city_name) {
      let movieArr = movieResponse.data.results.map((value) => {
        console.log(value);
        return new Moviez(
          `Title: ${value.title}`,
          `Overview: ${value.overview}`,
          `Average votes: ${value.vote_average}`,
          ` Total Votes: ${value.vote_count}`
        );
      });

      let movieArr2 = movieArr[0];
      if (movieArr.length) {
        response.json(movieArr2);
      } else {
        response.send("error");
      }
    } else {
      response.json("error");
    }
  });
});

app.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
}); // kick start the express server to work
// nn
