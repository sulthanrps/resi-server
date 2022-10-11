const { gql } = require("apollo-server");

const axios = require("axios");
const redis = require("../config");
const { APP_URL, USER_URL } = require("../constant");

const typeDefs = gql`
  type Ingredients {
    id: ID
    name: String
  }

  type User {
    _id: String!
    username: String!
    email: String!
    role: String!
    phoneNumber: String!
    address: String!
  }

  type Category {
    id: ID
    name: String
  }
  type Item {
    id: ID
    name: String
    description: String
    price: Int
    imgUrl: String
    authorId: String
    categoryId: Int
    Category: Category
    Ingredients: [Ingredients]
    User: User
  }

  type Response {
    message: String
  }

  type Query {
    getapps: [Item]
    getItemById(id: ID): Item
  }

  type Mutation {
    postItem(
      name: String
      description: String
      price: Int
      imgUrl: String
      authorId: String
      categoryId: Int
      ingredients: String
    ): Response

    deleteItem(id: ID): Response
  }
`;

const resolvers = {
  Query: {
    getapps: async () => {
      try {
        const apps = await redis.get("app:apps");

        if (!apps) {
          let dataUsersRedis = await redis.get("app:users");
          if (!dataUsersRedis) {
            const { data } = await axios.get(USER_URL + "/users/");
            await redis.set("app:users", JSON.stringify(data));
            dataUsersRedis = await redis.get("app:users");
          }
          let { data } = await axios.get(`${APP_URL}/apps`);
          data = data.map((el) => {
            el.User = JSON.parse(dataUsersRedis).filter(
              (ele) => ele["_id"] == el.authorId
            )[0];
            return el;
          });
          await redis.set("app:apps", JSON.stringify(data));
          return data;
        }

        return JSON.parse(apps);
      } catch (error) {
        return error;
      }
    },
  },

  Mutation: {
    postItem: async (_, args) => {
      try {
        // console.log(args);
        let { data } = await axios.post(APP_URL + "/apps", {
          ...args,
        });
        const dataNewapps = await axios.get(APP_URL + "/apps/");

        await redis.set("app:apps", JSON.stringify(dataNewapps.data));
        return { message: data };
      } catch ({ response }) {
        return response.data;
      }
    },
  },
};

module.exports = { appsTypeDefs: typeDefs, appsResolvers: resolvers };
