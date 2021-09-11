"use strict";

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

module.exports = Forecast;
