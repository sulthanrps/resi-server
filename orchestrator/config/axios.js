const axios = require("axios");

module.exports.axiosApp = axios.create({
  baseURL: "http://localhost:4001/",
});

module.exports.axiosUser = axios.create({
  baseURL: "http://localhost:4002/",
});

module.exports.axiosWasher = axios.create({
  baseURL: "http://localhost:4003/",
});
