import {
  createTargets,
  deleteTarget,
  getAllTargets,
  getTargetById,
  updateTargets
} from "../services/targets.js"

export const createTargetController = async (req, res) => {
  const { targets, companyId } = req.body
  const target = await createTargets(targets, companyId)
  if (target?.msg) {
    res.status(404).json(target)
    return
  }
  res.json(target)
}

export const updateTargetController = async (req, res) => {
  const { targets, companyId } = req.body
  const { id } = req.params
  const target = await updateTargets(id, targets, companyId)
  if (target?.msg) {
    res.status(404).json(target)
    return
  }
  res.json(target)
}

export const deleteTargetController = async (req, res) => {
  const { id } = req.params
  const target = await deleteTarget(id)
  if (target?.msg) {
    res.status(404).json(target)
    return
  }
  res.json(target)
}

export const getAllTargetController = async (req, res) => {
  const targets = await getAllTargets(req.user.companyId.toString())
  if (targets?.msg) {
    res.status(404).json(targets)
    return
  }
  res.json(targets)
}
export const getTargetbyIdController = async (req, res) => {
  const { id } = req.params
  const target = await getTargetById(id)
  if (target?.msg) {
    res.status(404).json(target)
    return
  }
  res.json(target)
}