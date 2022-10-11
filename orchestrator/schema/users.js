const { gql } = require("apollo-server");
const redis = require("../config/");
const axios = require("axios");
const { USER_URL } = require("../constant");

const typeDefs = gql`
  type User {
    _id: String!
    username: String!
    email: String!
    role: String!
    phoneNumber: String!
    address: String!
  }

  type Response {
    message: String
  }

  type Query {
    getUsers: [User]
    getUserById(id: String): User
    getRedis: [User]
  }
  type Mutation {
    postUser(
      username: String
      email: String
      password: String
      role: String
      phoneNumber: String
      address: String
    ): Response

    clearRedis: Response

    deleteUser(id: String): Response
  }
`;
const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        console.time("Time");
        const dataRedis = await redis.get("app:users");
        if (dataRedis) {
          console.log("masuk data redis");
          console.timeEnd("Time");
          return JSON.parse(dataRedis);
        } else {
          console.log("masuk else");
          const { data } = await axios.get(USER_URL + "/users/");
          await redis.set("app:users", JSON.stringify(data));
          console.timeEnd("Time");
          return data;
        }
      } catch ({ response }) {
        return response;
      }
    },
  },

  Mutation: {
    postUser: async (_, args) => {
      try {
        let { data } = await axios.post(USER_URL + "/users", {
          ...args,
        });
        const dataNewUsers = await axios.get(USER_URL + "/users/");

        await redis.set("app:users", JSON.stringify(dataNewUsers.data));
        return data;
      } catch (error) {
        return error;
      }
    },
  },
};

module.exports = {
  usersResolvers: resolvers,
  usersTypeDefs: typeDefs,
};
