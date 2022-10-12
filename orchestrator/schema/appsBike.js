const { gql } = require("apollo-server");

const axios = require("axios");
const redis = require("../config");
const { APP_URL, USER_URL } = require("../constant");

const typeDefs = gql`
  type Bike {
    id: ID
    name: String
    imgUrl: String
    price: Int
  }

  type Query {
    getBikes(access_token: String): [Bike]
  }
`;

const resolvers = {
  Query: {
    getBikes: async (_, args) => {
      try {
        console.log(args);
        const { data } = await axios({
          method: "get",
          url: `${APP_URL}/bikes`,
          headers: args,
        });
        return data;
      } catch ({ response }) {
        return { message: response.data.message };
      }
    },
  },
};

module.exports = { appsBikeTypeDefs: typeDefs, appsBikeResolvers: resolvers };
