const Product = require('../../models/product')
const User = require('../../models/user')

const findProducts = async productIds => {
  try {
    const products = await Product.find({ _id: { $in: productIds } })
    return products.map(product => {
      return transformProduct(product)
    })
  }
  catch (error) {
    throw error
  }
}

const findSingleProduct = async productId => {
  try {
    const product = await Product.findById(productId)
    return transformProduct(product)
  }
  catch (error) {
    throw error
  }
}

const findUser = async userId => {
  try {
    const user = await User.findById(userId)
    return {
      ...user._doc,
      _id: user._id,
      createdProducts: findProducts.bind(this, user._doc.createdProducts)
    }
  }
  catch (err) {
    throw err
  }
}

exports.findProducts = findProducts
exports.findSingleProduct = findSingleProduct
exports.findUser = findUser