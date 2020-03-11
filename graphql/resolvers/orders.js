const Product = require('../../models/product')
const Order = require('../../models/order')

const { findUser, findProducts } = require('./finders')
const { dateToString } = require('./../../helpers/date')

const transformOrder = order => {
  return {
    ...order._doc,
    user: findUser.bind(this, order._doc.user),
    products: findProducts.bind(this, order._doc.products),
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
  order: async ({ orderId }) => {
    try {
      const order = await Order.findById(orderId)
      return transformOrder(order)
    }
    catch (error) {
      throw error
    }
  },
  createOrder: async ({ orderInput: { productIds, userId } }, req) => {
    const ids = productIds[0].split(',')
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const orderedProducts = await Product.find().where('_id').in(ids)
      const order = new Order({
        user: userId,
        products: orderedProducts
      })

      const result = await order.save()

      return transformOrder(result)
    }
    catch (error) {
      throw error
    }
  },
  updateOrder: async ({ orderUpdateInput: { _id, productIds, userId } }, req) => {
    const ids = productIds[0].split(',')
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const order = await Order.findById(_id)
      order.products = ids
      order.user = userId

      const result = await order.save()

      return transformOrder(result)
    }
    catch (error) {
      throw error
    }
  },
  deleteOrder: async ({ orderId }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const order = await Order.findById(orderId)
      const products = {
        ...order.products._doc,
      }
      await Order.deleteOne({ _id: orderId })
      return order
    }
    catch (error) {
      throw error
    }
  }
}