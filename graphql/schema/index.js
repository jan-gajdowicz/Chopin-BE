const { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type Order {
    _id: ID!,
    products: [Product!]!
    user: User!
    createdAt: String!
    updatedAt: String!
  }
  
  type Product {
    _id: ID!
    name: String!
    description: String!
    price: Float!
    creator: User!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdProducts: [Product!] 
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  input ProductInput {
    name: String!
    description: String!
    price: Float!
  }

  input UserInput {
    email: String!
    password: String!
  }

  input OrderInput {
    products: [ID!]!
    user: ID!
  }

  type RootQuery {
    products: [Product!]!
    orders: [Order!]!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createProduct(productInput: ProductInput): Product
    createUser(userInput: UserInput): User
    placeOrder(orderInput: OrderInput): Order 
    cancelOrder(orderId: ID!): Order  
  }

  schema {
    query: RootQuery 
    mutation: RootMutation
  }
`)