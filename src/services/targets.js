import targetModel from "../model/TargetsModel.js"

export const createTargets = async (targets, companyId) => {
  try {
    // Primero, eliminamos cualquier objetivo existente
    await targetModel.deleteMany({companyId}); // Esto eliminará todos los objetivos existentes

    // Luego, creamos el nuevo objetivo
    const newTarget = await targetModel.create({ targets, companyId });

    if (!newTarget) {
      return {
        msg: 'Error al crear el objetivo'
      };
    }
    return newTarget;
  } catch (error) {
    console.log(error);
    return {
      msg: 'Error en la operación'
    };
  }
};

export const updateTargets = async (id, targets, companyId) => {
  try {
    const targetUpdate = await targetModel.findByIdAndUpdate(id, { targets, companyId }, { new: true })
    if (!targetUpdate) {
      return {
        msg: 'error no hay objetivos con ese id'
      }
    }
    return targetUpdate
  } catch (error) {
    console.log(error)
  }
}

export const deleteTarget = async (id) => {
  try {
    const target = await targetModel.findByIdAndDelete(id, { new: true })
    if (!target) {
      return {
        msg: 'no hay objetivos con ese id'
      }
    }
    return target
  } catch (error) {
    console.log(error)
  }
}

export const getAllTargets = async (companyId) => {
  try {
    const targets = await targetModel.find({ companyId })
    if (!targets) {
      return {
        targets: []
      }
    }
    return targets
  } catch (error) {
    console.log(error)
  }
}


export const getTargetById = async (id) => {
  try {
    const target = await targetModel.findById(id)
    if (!target) {
      return {
        msg: 'no hay objetivos con ese id'
      }
    }
    return target
  } catch (error) {
    console.log(error)
  }
}