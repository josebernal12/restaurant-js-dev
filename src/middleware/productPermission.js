import RolModel from "../model/RolModel.js"

export const addProductPermission = async (req, res, next) => {
  const user = req.user
  if (user) {
    const rol = await RolModel.findById(user.rol)
    if (rol.permissions.agregarProducto) {
      req.user = user
      return next()
    } else {
      return res.status(401).json({ msg: 'no tienes permisos para estas operaciones' })
    }
  } else {
    return res.status(401).json({ msg: 'no tienes permisos para estas operaciones' })
  }

}
export const updateProductPermission = async (req, res, next) => {
  const user = req.user
    if (user) {
    const rol = await RolModel.findById(user.rol)
    if (rol.permissions.actualizarProducto) {
      req.user = user
      return next()
    } else {
      return res.status(401).json({ msg: 'no tienes permisos para estas operaciones' })
    }
  }
}
export const deleteProductPermission = async (req, res, next) => {
  const user = req.user
  if (user) {
    const rol = await RolModel.findById(user.rol)
    if (rol.permissions.eliminarProducto) {
      req.user = user
      return next()
    } else {
      return res.status(401).json({ msg: 'no tienes permisos para estas operaciones' })
    }
  }
}