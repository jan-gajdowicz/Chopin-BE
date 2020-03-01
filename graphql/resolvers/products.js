const Product = require('../../models/product')
const { findUser } = require('./finders')

const transformProduct = product => {
  return {
    ...product._doc,
    _id: product.id,
    creator: findUser.bind(this, product._doc.creator)
  }
}

module.exports = {
  products: async () => {
    try {
      const products = await Product.find()
      return products.map(product => {
        return transformProduct(product)
      })
    }
    catch (error) {
      throw error
    }
  },
  createProduct: async ({ productInput: { name, description, price } }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated')
    }

    const product = new Product({
      name,
      description,
      price: +price,
      creator: req.userId
    })

    let createdProduct

    try {
      const result = await product.save()

      createdProduct = {
        ...result._doc,
        creator: findUser.bind(this, result._doc.creator)
      }

      const creator = await User.findById(req.userId)

      if (!creator) {
        throw new Error('User not found')
      }

      creator.createdProducts.push(product)
      await creator.user.save()

      return createdProduct
    }
    catch (error) {
      throw error
    }
  },
}