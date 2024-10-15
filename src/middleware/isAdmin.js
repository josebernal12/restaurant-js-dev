import jwt from 'jsonwebtoken'
import userModel from '../model/UserModel.js';
export const isAdmin = async (req, res, next) => {
  let token = "";
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.KEYSECRET || 'defaultSecret')

      const user = await userModel.findById(decoded.id)
      if (user) {
        if (user.rol === 'admin') {
          req.user = user
          return next()
        }else{
          const error = new Error('no tienes permisos para estas operaciones')
          return res.status(401).json({ msg: error.message })
        }
      }
    } catch (error) {
      console.log('error')
    }
  } if (!token) {
    const error = new Error('Token no valid')
    return res.status(401).json({ msg: error.message })
  }
  next()




}