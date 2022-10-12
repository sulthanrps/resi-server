const Redis = require("ioredis");
const redis = new Redis({
  port: 12650,
  host: "redis-12650.c292.ap-southeast-1-1.ec2.cloud.redislabs.com",
  password: "DIdpVhBWwJT3XxAXJtsVqNL3Dzcz2qx4",
});

module.exports = redis;
