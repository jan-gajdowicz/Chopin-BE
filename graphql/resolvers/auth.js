const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')

module.exports = {
  createUser: async ({ userInput: { email, password } }) => {
    try {
      const existingUser = await User.findOne({ email })

      if (existingUser) {
        throw new Error('User already exists')
      }

      const hashedPassword = bcrypt.hash(password, 12)
      const user = new User({
        email,
        password: hashedPassword
      })

      const result = user.save()
      return { ...result._doc, password: null }
    }
    catch (error) {
      throw error
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('User not found')
    }

    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      throw new Error('Password is incorrect')
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'supersecretkey',
      { expiresIn: '1h' }
    )

    return {
      userId: user.id,
      token,
      tokenExpiration: 1
    }
  }
}