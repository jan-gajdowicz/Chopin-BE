const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next()
  }
  const token = authHeader.split(' ')[0]
  if (!token || token === '') {
    req.isAuth = false
    return next()
  }
  try {
    const decodedToken = jwt.verify(token, 'supersecretkey')
  }
  catch (error) {
    req.isAuth = false
    return next()
  }
  if (!decodedToken) {
    req.isAuth = false
    return next()
  }
  req.isAuth = true
  req.userId = decodedToken.userId
  return next()
}