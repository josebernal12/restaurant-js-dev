import RolModel from '../model/RolModel.js'
import userModel from '../model/UserModel.js'

export const createRol = async (name, permissions, companyId) => {
  try {
    if (!name || !permissions) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    const newRol = await RolModel.create({ name, permissions, companyId })
    if (!newRol) {
      return 'error a la creacion del rol'
    }
    return newRol
  } catch (error) {
    console.log(error)
  }
}

export const getRol = async (companyId) => {
  try {
    // Encuentra todos los roles para la empresa, excluyendo aquellos con name 'admin'
    const rols = await RolModel.find({
      companyId,
      name: { $ne: 'admin' }
    });
    
    if (!rols.length) {
      return {
        rols: []
      }
    }
    
    return rols;
  } catch (error) {
    console.log(error);
    return {
      rols: []
    };
  }
};


export const updateRol = async (id, name, permissions, companyId) => {
  try {
    if (!id || !name || !permissions) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    const rol = await RolModel.findByIdAndUpdate(id, { name, permissions, companyId }, { new: true })
    if (!rol) {
      return {
        msg: 'error al actualizar'
      }
    }
    return rol
  } catch (error) {
    console.log(error)
  }
}


export const deleteRol = async (id) => {
  try {
    if (!id) {
      return {
        msg: 'error al mandar el id'
      }
    }
    const rol = await RolModel.findByIdAndDelete(id)
    const users = await userModel.find({ rol: id })
    if (users) {
      const userRol = await RolModel.findOne({ name: 'miembro' });
      console.log(userRol)
      users.forEach(user => {
        user.rol = userRol._id;
        user.save()
      })

    }
    if (!rol) {
      return {
        msg: 'error al eliminar'
      }
    }
    return rol
  } catch (error) {
    console.log(error)
  }
}