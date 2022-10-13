const { gql } = require("apollo-server");

const axios = require("axios");
const { APP_URL, USER_URL } = require("../constant");

const typeDefs = gql`
  type Book {
    id: ID
    UserId: Int
    BookDate: String
    GrandTotal: Int
    BikeId: Int
    WasherId: Int
    ScheduleId: Int
    status: String
    location: String
  }

  type Response {
    message: String
  }

  type ResponseCreate {
    id: ID
  }

  type Query {
    getBooks(access_token: String, status: String): [Book]
    getBooksPending(access_token: String): [Book]
    getBooksByBooksId(access_token: String, id: ID): Book
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
    ): ResponseCreate

    patchStatusBook(id: ID, status: String, access_token: String): Response

    deleteItem(id: ID): Response

    deleteBook(id: ID, access_token: String): Response
  }
`;

const resolvers = {
  Query: {
    getBooksByBooksId: async (_, args) => {
      try {
        const { access_token, id } = args;

        const { data } = await axios({
          method: "get",
          url: `${APP_URL}/customers/${id}`,
          headers: { access_token },
        });
        console.log("disini");
        return data;
      } catch ({ response }) {
        return response.data.message;
      }
    },

    getBooks: async (_, args) => {
      try {
        const { status, access_token } = args;
        console.log(status);
        const { data } = await axios({
          method: "get",
          url: `${APP_URL}/customers`,
          headers: { access_token },
          params: { status: status },
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

module.exports = { appsCustTypeDefs: typeDefs, appsCustResolvers: resolvers };
