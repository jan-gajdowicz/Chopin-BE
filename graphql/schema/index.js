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

  input ProductUpdateInput {
    _id: ID!
    name: String!
    description: String!
    price: Float!
  }

  input UserUpdateInput {
    _id: ID!
    email: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  input OrderInput {
    productIds: [ID!]!
    userId: ID!
  }

  input OrderUpdateInput {
    _id: ID!
    productIds: [ID!]!
    userId: ID!
  }

  type RootQuery {
    products: [Product!]!
    product(productId: ID!): Product!
    
    users: [User!]!
    user(userId: ID!): User!
    
    orders: [Order!]!
    order(orderId: ID!): Order
    
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createProduct(productInput: ProductInput): Product
    updateProduct(productUpdateInput: ProductUpdateInput): Product
    deleteProduct(productId: ID!): Product
    
    createUser(userInput: UserInput): User
    updateUser(userUpdateInput: UserUpdateInput): User
    deleteUser(userId: ID!): User
    
    createOrder(orderInput: OrderInput): Order 
    updateOrder(orderUpdateInput: OrderUpdateInput): Order 
    deleteOrder(orderId: ID!): Order  
  }

  schema {
    query: RootQuery 
    mutation: RootMutation
  }
`)