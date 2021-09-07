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
});

// a server endpoint

app.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
}); // kick start the express server to work
// nn
