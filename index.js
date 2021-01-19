//packges
const express= require("express")
const{graphqlExpress,graphiqlExpress}= require("graphql-server-express")
const{importSchema}=require("graphql-import")
const{makeExecutableSchema}=require("graphql-tools")
const bodyParser=require('body-parser')

//variables
const Port=3001
const endPoint="/ropa_api"
//GrapQL configurations
const typeDefs=importSchema("type_system.graphql")
import resolvers from "./resolvers"
//const resolver=require("./resolvers")
const schema=makeExecutableSchema({
    typeDefs,
    resolvers
})
//web Server Express
const app = express()
app.use(endPoint,bodyParser.json(),graphqlExpress({schema}))
app.use("/graphiql",graphiqlExpress({endpointURL:endPoint}))
//API-GRaphQL excution
app.listen(Port,()=>{
    console.log("GraphQl-API listen in http://localhost:"+Port+endPoint)
    console.log("GraphQl-API CLIENT-TOOL listen in http://localhost:"+Port+"/graphiql")
})