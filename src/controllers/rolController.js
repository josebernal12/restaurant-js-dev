import { createRol, deleteRol, getRol, updateRol } from "../services/rol.js"

export const createRolController = async (req, res) => {
  const { name, permissions, companyId } = req.body

  const newRol = await createRol(name, permissions, companyId)

  res.json(newRol)
}

export const getRolController = async (req, res) => {

  const rols = await getRol(req.user.companyId.toString())
  res.json(rols)
}

export const updateRolController = async (req, res) => {
  const { name, permissions, companyId } = req.body
  const { id } = req.params

  const rol = await updateRol(id, name, permissions, companyId, req.user._id.toString())

  if (rol?.msg) {
    return res.status(400).json(rol)
  }
  res.json(rol)
}

export const deleteRolController = async (req, res) => {
  const { id } = req.params

  const rol = deleteRol(id)

  if (rol?.msg) {
    return res.status(400).json(rol)
  }
  res.json(rol)
}