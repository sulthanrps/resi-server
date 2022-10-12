const { ApolloServer } = require("apollo-server");
const { appsResolvers, appsTypeDefs } = require("./schema/apps");
const { usersTypeDefs, usersResolvers } = require("./schema/users");

const PORT = process.env.PORT || 4000;
//define listen port biar di deploy tidak error

const server = new ApolloServer({
  resolvers: [usersResolvers, appsResolvers],
  typeDefs: [usersTypeDefs, appsTypeDefs],
});

//define listen port biar di deploy tidak error
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
