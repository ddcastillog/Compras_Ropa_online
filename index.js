//packges
const express= require("express")
const{graphqlExpress,graphiqlExpress}= require("graphql-server-express")
const{makeExecutableSchema}=require("graphql-tools")
const bodyParser=require('body-parser')

const cors = require("cors")
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
//variables
const Port=3010
const endPoint="/ropa_api"
//GrapQL configurations
//const ropa=importSchema("ropa.graphql")
//const user=importSchema("user.graphql")
//const typeDefs=[ropa,user]
const typeDefs=mergeTypeDefs(loadFilesSync(`${__dirname}/**/*.graphql`));
import resolvers from "./resolver"
//const resolver=require("./resolvers")
const schema=makeExecutableSchema({
    typeDefs,
    resolvers
})
//web Server Express
const app = express()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
app.use(endPoint,bodyParser.json(),graphqlExpress({schema,rootValue:resolvers}))
app.use("/graphiql",graphiqlExpress({endpointURL:endPoint}))
//API-GRaphQL excution
app.listen(Port,()=>{
    console.log("GraphQl-API listen in http://localhost:"+Port+endPoint)
    console.log("GraphQl-API CLIENT-TOOL listen in http://localhost:"+Port+"/graphiql")
})