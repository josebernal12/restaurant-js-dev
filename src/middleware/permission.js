import jwt from 'jsonwebtoken'
import RolModel from '../model/RolModel.js';
import userModel from '../model/UserModel.js';
export const checkJwt = async (req, res, next) => {
  let token = "";

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.KEYSECRET, { ignoreExpiration: true });
      const user = await userModel.findById(decoded.id).populate('rol').select('-password');
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      req.user = user; // Almacenar el usuario en el objeto de solicitud
      next(); // Pasar al siguiente middleware
    } catch (error) {
      console.log('error', error);
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ msg: 'Token expirado' });
      } else {
        return res.status(401).json({ msg: 'Token inválido' });
      }
    }
  } else {
    return res.status(401).json({ msg: 'Token no válido' });
  }
};


export const addUserPermission = async (req, res, next) => {
  const user = req.user
  if (user) {
    const rol = await RolModel.findById(user.rol)
    if (rol.permissions.agregarUsuario) {
      req.user = user
      return next()
    } else {
      return res.status(401).json({ msg: 'no tienes permisos para estas operaciones' })
    }
  }
}
export const updateUserPermission = async (req, res, next) => {
  const user = req.user
  if (user) {
    const rol = await RolModel.findById(user.rol)
    if (rol.permissions.actualizarUsuario) {
      req.user = user
      return next()
    } else {
      return res.status(401).json({ msg: 'no tienes permisos para estas operaciones' })
    }
  }
}
export const deleteUserPermission = async (req, res, next) => {
  const user = req.user

  if (user) {
    const rol = await RolModel.findById(user.rol)
    if (rol.permissions.eliminarUsuario) {
      req.user = user
      return next()
    } else {
      return res.status(401).json({ msg: 'no tienes permisos para estas operaciones' })
    }
  }
}