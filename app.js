const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttps = require('express-graphql')
const mongoose = require('mongoose')
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

console.log(process.env.NODE_ENV, '')

const isAuth = require('./middleware/is-auth')
const graphqlSchema = require('./graphql/schema/index')
const graphqlResolvers = require('./graphql/resolvers/index')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(isAuth)

app.use('/graphql', graphqlHttps({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}))

const port = 5555

mongoose
  .connect(
    process.env.CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => {
    app.listen(port)
    console.log(`Listening on ${port}`)
  })
  .catch(error => console.error('Connection error', error.message))
