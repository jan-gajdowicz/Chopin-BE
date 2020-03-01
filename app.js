const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttps = require('express-graphql')
const mongoose = require('mongoose')

const isAuth = require('./middleware/is-auth')
const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')

const app = express()

app.use(bodyParser.json())

app.use(isAuth)

app.use('/graphql', graphqlHttps({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}))

mongoose
  .connect(
    `mongodb://127.0.0.1:27017/chopin`,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(app.listen(3000))
  .catch(error => console.error('Connection error', error.message))
