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
    WasherId: Int
    location: String
    distance: Float
    Bike: Bike
  }

  type Bike {
    id: ID
    name: String
    imgUrl: String
    price: Int
  }

  type Response {
    message: String
  }

  type Query {
    getWasherBooks(access_token: String): [Book]

    getWasherBooksPending(
      access_token: String
      lon: String
      lat: String
      dist: Int
    ): [Book]

    getWasherBooksByBooksId(access_token: String, id: ID): Book
  }

  type Mutation {
    washerPickBook(id: ID, access_token: String): Response
    washerRemoveBook(id: ID, access_token: String): Response
    washerUpdateBook(id: ID, access_token: String, status: String): Response
  }
`;

const resolvers = {
  Query: {
    getWasherBooks: async (_, args) => {
      try {
        const { data } = await axios({
          method: "get",
          url: `${APP_URL}/washers`,
          headers: args,
        });
        return data;
      } catch ({ response }) {
        return { message: response.data.message };
      }
    },

    getWasherBooksPending: async (_, args) => {
      try {
        const { access_token, lon, lat, dist = 2 } = args;
        console.log(dist);
        if (dist == "undefined") dist = null;
        const { data } = await axios({
          method: "get",
          url: `${APP_URL}/washers/books?lon=${lon}&lat=${lat}&dist=${dist}`,
          headers: { access_token },
        });
        return data;
      } catch ({ response }) {
        return { message: response.data.message };
      }
    },

    getWasherBooksByBooksId: async (_, args) => {
      try {
        const { access_token, id } = args;

        console.log(id);
        const { data } = await axios({
          method: "get",
          url: `${APP_URL}/washers/books/${id}`,
          headers: { access_token },
        });

        const dataCustomer = await axios({
          method: "get",
          url: `${USER_URL}/user/${data.UserId}`,
        });

        const dataWasher = await axios({
          method: "get",
          url: `${USER_URL}/user/${data.WasherId}`,
        });

        data.Customer = dataCustomer.data;
        data.Washer = dataWasher.data;
        return data;
      } catch ({ response }) {
        return response.data.message;
      }
    },
  },

  Mutation: {
    washerPickBook: async (_, args) => {
      try {
        const { access_token, id } = args;

        const { data } = await axios({
          method: "patch",
          url: `${APP_URL}/washers/books/${id}`,
          headers: { access_token },
        });
        return data;
      } catch ({ response }) {
        return { message: response.data.message };
      }
    },

    washerRemoveBook: async (_, args) => {
      try {
        const { access_token, id } = args;

        const { data } = await axios({
          method: "patch",
          url: `${APP_URL}/washers/books/${id}/remove`,
          headers: { access_token },
        });
        return data;
      } catch ({ response }) {
        return { message: response.data.message };
      }
    },

    washerUpdateBook: async (_, args) => {
      try {
        const { access_token, id, status } = args;

        const { data } = await axios({
          method: "patch",
          url: `${APP_URL}/washers/books/${id}/status`,
          headers: { access_token },
          data: { status },
        });
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
