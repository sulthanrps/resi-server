const {verifyToken} = require('../helpers/jwt')
const {User} = require('../models')

const authentication = async (req, res, next) => {
  try {
    const {access_token} = req.headers
    if(!access_token) throw {name: "Please login first"}
    
    const payload = verifyToken(access_token)
    const user = await User.findByPk(payload.id)
    if(!user) throw {name: "Unauthorized"}

    req.user = {id: user.id, name: user.name}
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authentication