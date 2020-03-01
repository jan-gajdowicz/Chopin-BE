const Product = require('../../models/product')
const Order = require('../../models/order')

const { findUser, findSingleProduct } = require('./finders')
const { dateToString } = require('../../helpers/date')

const transformOrder = order => {
  return {
    ...order._doc,
    user: findUser.bind(this, order._doc.user),
    product: findSingleProduct.bind(this, order._doc.product),
    createdAt: dateToString(order._doc.createdAt),
    updatedAt: dateToString(order._doc.updatedAt),
  }
}

module.exports = {
  orders: async () => {
    try {
      const orders = await Order.find()
      return orders.map(order => {
        return transformOrder(order)
      })
    }
    catch (error) {
      throw error
    }
  },
  placeOrder: async ({ orderInput: { products, user } }) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const orderedProducts = await Product.findById(products)

      const order = new Order({
        user: req.userId,
        products: orderedProducts
      })

      const result = await order.save()

      return transformOrder(result)
    }
    catch (error) {
      throw error
    }
  },
  cancelOrder: async ({ orderId }) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const order = await Order.findById(orderId)
      const products = {
        ...order.products._doc,
      }
      await Order.deleteOne({ _id: orderId })
      return products
    }
    catch (error) {
      throw error
    }
  }
}