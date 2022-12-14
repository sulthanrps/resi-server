const { ApolloServer } = require("apollo-server");
const {
  appsCustResolvers,
  appsCustTypeDefs,
} = require("./schema/appsCustomer");
const {
  appsWasherResolvers,
  appsWasherTypeDefs,
} = require("./schema/appsWasher");
const { appsBikeResolvers, appsBikeTypeDefs } = require("./schema/appsBike");
const { usersTypeDefs, usersResolvers } = require("./schema/users");

const PORT = process.env.PORT || 4000;
//define listen port biar di deploy tidak error

const server = new ApolloServer({
  resolvers: [
    usersResolvers,
    appsCustResolvers,
    appsWasherResolvers,
    appsBikeResolvers,
  ],
  typeDefs: [
    usersTypeDefs,
    appsCustTypeDefs,
    appsWasherTypeDefs,
    appsBikeTypeDefs,
  ],
});

//define listen port biar di deploy tidak error
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
