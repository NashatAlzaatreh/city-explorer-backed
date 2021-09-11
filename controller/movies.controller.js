"use strict";

const axios = require("axios");
require("dotenv").config();
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const Movies = require("../models/movies.model");

const getMovies = async (request, response) => {
  const city_name = request.query.city_name;

  const moviesUrl = "https://api.themoviedb.org/3/movie/top_rated";
  const moviesResponse = await axios.get(
    `${moviesUrl}?api_key=${MOVIE_API_KEY}&city_name=${city_name}`
  );

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
};

module.exports = getMovies;
