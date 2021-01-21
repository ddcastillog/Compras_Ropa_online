import { GraphQLServer } from "graphql-yoga";
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
const typeDefs = mergeTypeDefs(loadFilesSync(`${__dirname}/**/*.graphql`));
import resolvers from "./resolver"
const server = new GraphQLServer({
  typeDefs,
  resolvers
});
server.start({ port: 3100 }, ({ port }) => {
  console.log('Server on port http://localhost:'+port);
});