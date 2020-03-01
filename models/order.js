const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)