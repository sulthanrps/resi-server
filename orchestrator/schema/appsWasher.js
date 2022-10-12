const { gql } = require("apollo-server");

const axios = require("axios");
const redis = require("../config");
const { APP_URL, USER_URL } = require("../constant");

const typeDefs = gql`
  type Book {
    id: ID
    UserId: Int
    BookDate: String
    GrandTotal: Int
    BikeId: Int
    ScheduleId: Int
    status: String
    location: String
  }

  type Response {
    message: String
  }

  type Query {
    getBooks(access_token: String): [Book]
    getBooksPending(access_token: String): [Book]
  }

  type Mutation {
    createBook(
      access_token: String
      BookDate: String!
      GrandTotal: Int
      BikeId: Int!
      ScheduleId: Int!
      lon: String!
      lat: String!
    ): Response

    patchStatusBook(id: ID, status: String, access_token: String): Response

    deleteItem(id: ID): Response

    deleteBook(id: ID, access_token: String): Response
  }
`;

const resolvers = {
  Query: {
    getBooks: async (_, args) => {
      try {
        const { data } = await axios({
          method: "get",
          url: `${APP_URL}/customers`,
          headers: args,
        });
        return data;
      } catch ({ response }) {
        return { message: response.data.message };
      }
    },

    getBooksPending: async (_, args) => {
      try {
        const { data } = await axios({
          method: "get",
          url: `${APP_URL}/customers/pending`,
          headers: args,
        });
        return data;
      } catch ({ response }) {
        return { message: response.data.message };
      }
    },
  },

  Mutation: {
    createBook: async (_, args) => {
      try {
        const {
          BookDate,
          GrandTotal,
          BikeId,
          ScheduleId,
          lon,
          lat,
          access_token,
        } = args;
        const { data } = await axios({
          method: "post",
          url: APP_URL + "/customers",
          headers: { access_token },
          data: {
            BookDate,
            GrandTotal,
            BikeId,
            ScheduleId,
            lon,
            lat,
          },
        });

        return data;
      } catch ({ response }) {
        return { message: response.data.message };
      }
    },

    patchStatusBook: async (_, args) => {
      try {
        const { id, status, access_token } = args;

        console.log(APP_URL + "/customers/" + id);
        const { data } = await axios({
          method: "Patch",
          url: APP_URL + "/customers/" + id,
          data: { status },
          headers: {
            access_token,
          },
        });
        console.log(data);
        return data;
      } catch ({ response }) {
        return { message: response.data.message };
      }
    },

    deleteBook: async (_, args) => {
      try {
        const { id, access_token } = args;

        console.log(APP_URL + "/customers/" + id);
        const { data } = await axios({
          method: "delete",
          url: APP_URL + "/customers/" + id,
          headers: {
            access_token,
          },
        });
        console.log(data);
        return data;
      } catch ({ response }) {
        return { message: response.data.message };
      }
    },
  },
};

module.exports = {
  appsWasherTypeDefs: typeDefs,
  appsWasherResolvers: resolvers,
};
