const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttps = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

app.use(bodyParser.json())

const products = []

app.use('/graphql', graphqlHttps({
  schema: buildSchema(`
    type Product {
      _id: ID!
      name: String!
      description: String!
      price: Float!
    }
    
    input ProductInput {
      name: String!
      description: String!
      price: Float!
    }

    type RootQuery {
      products: [Product!]!
    }

    type RootMutation {
      createProduct(productInput: ProductInput): Product
    }

    schema {
      query: RootQuery 
      mutation: RootMutation
    }
  `),
  rootValue: {
    products: () => {
      return products
    },
    createProduct: ({ productInput: { name, description, price } }) => {
      const product = {
        _id: Math.random().toString(),
        name,
        description,
        price: +price
      }
      products.push(product)
      return product
    }
  },
  graphiql: true
}))

app.listen(3000)