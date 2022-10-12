const { gql, UserInputError } = require("apollo-server");
const redis = require("../config/");
const axios = require("axios");
const { USER_URL } = require("../constant");

const typeDefs = gql`
  type User {
    id: ID
    email: String
    name: String
    role: String
    profileImg: String
    balance: Int
    phoneNumber: String
  }

  type access_token {
    access_token: String
  }

  type Message {
    message: String
  }

  type Url {
    redirect_url: String
  }

  type Query {
    getUser(access_token: String): User
  }
  type Mutation {
    register(
      name: String
      email: String
      password: String
      profileImge: String
      phoneNumber: String
      role: String
    ): access_token

    updateProfile(
      name: String
      email: String
      phoneNumber: String
      profileImg: String
      access_token: String
    ): Message

    topUpMidtrans(nominal: Int, access_token: String): Url
    login(email: String, password: String): access_token
    payment(access_token: String): Message
  }
`;
const resolvers = {
  Query: {
    getUser: async (_, args) => {
      try {
        const { data } = await axios({
          method: "get",
          url: `${USER_URL}/user`,
          headers: args,
        });
        return data;
      } catch ({ response }) {
        console.log(response.data.message);
      }
    },
  },

  Mutation: {
    register: async (_, args) => {
      try {
        const { data } = await axios({
          method: "post",
          url: USER_URL + "/register",
          data: args,
        });
        return { access_token: data.access_token };
      } catch ({ response }) {
        throw response.data.message;
      }
    },

    login: async (_, args) => {
      try {
        const { data } = await axios({
          method: "POST",
          url: USER_URL + "/login",
          data: args,
        });
        console.log(data);
        return { access_token: data.access_token };
      } catch ({ response }) {
        throw response.data.message;
      }
    },

    updateProfile: async (_, args) => {
      try {
        const { name, email, phoneNumber, profileImg, access_token } = args;
        const { data } = await axios({
          method: "PATCH",
          url: USER_URL + "/user",
          data: { name, email, phoneNumber, profileImg },
          headers: {
            access_token,
          },
        });
        return { message: data.message };
      } catch ({ response }) {
        throw response.data.message;
      }
    },

    topUpMidtrans: async (_, args) => {
      try {
        const { nominal, access_token } = args;
        const { data } = await axios({
          method: "POST",
          url: USER_URL + "/midtrans",
          headers: { access_token },
          data: { nominal },
        });

        return {redirect_url: data.redirect_url}
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = {
  usersResolvers: resolvers,
  usersTypeDefs: typeDefs,
};
