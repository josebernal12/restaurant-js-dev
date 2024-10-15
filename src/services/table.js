import tableModel from "../model/TableModel.js";

export const createTable = async (available, quantity, companyId) => {
  try {
    // Obtener el número máximo actual de mesa
    const maxNumberTable = await tableModel
      .findOne({ companyId }, {}, { sort: { number: -1 } })
      .select("number");

    // Si no hay mesas existentes, asignar 0 como número máximo
    const maxNumber = maxNumberTable ? maxNumberTable.number : 0;

    const tables = [];
    if (quantity) {
      for (let index = 0; index < Number(quantity); index++) {
        const number = maxNumber + index + 1; // Incrementar el número basado en el número máximo actual y la iteración
        const table = await tableModel.create({ available, number, companyId });
        tables.push(table);
      }
    } else {
      const table = await tableModel.create({ available, companyId });
      tables.push(table);
    }
    if (!tables.length) {
      return "error al crear las tablas";
    }
    return tables;
  } catch (error) {
    console.log(error);
    throw error; // Re-lanzar el error para manejarlo en un contexto superior si es necesario
  }
};

export const getTables = async (number, companyId) => {
  try {
    if (number) {
      if (isNaN(number)) {
        return [];
      }
      const table = await tableModel.find({ number, companyId });
      if (!table) {
        return "no hay mesas con ese id";
      }
      return table;
    }
    const table = await tableModel.find({ companyId });
    if (!table) {
      return [];
    }
    return table;
  } catch (error) {
    console.log(error);
  }
};

export const getTableById = async (id) => {
  try {
    const table = await tableModel.findById(id);
    if (!table) {
      return "no hay mesas con ese id";
    }
    return table;
  } catch (error) {
    console.log(error);
  }
};

export const availableTable = async (id, available, companyId) => {
  try {
    const table = await tableModel.findByIdAndUpdate(
      id,
      { available, companyId },
      { new: true }
    );
    if (!table) {
      return "error en la seleccion de la mesa";
    }
    return table;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTable = async (id, companyId) => {
  try {
    // Eliminar la mesa con el ID proporcionado
    const tableDeleted = await tableModel.findByIdAndDelete(id);

    if (!tableDeleted) {
      return {
        msg: "Error deleting table",
      };
    }

    // Obtener todas las mesas restantes, ordenadas por su campo 'number'
    const tables = await tableModel.find({ companyId }).sort("number");
    console.log(tables)
    // Actualizar los números de las mesas para que sean consecutivos
    for (let i = 0; i < tables.length; i++) {
      tables[i].number = i + 1;
      await tables[i].save();
    }

    return tableDeleted;
  } catch (error) {
    console.error(error);
    return {
      msg: "An error occurred",
    };
  }
};
