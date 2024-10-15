import inventaryModel from "../model/Inventary.js";
import productModel from "../model/ProductModel.js";

export const inventary = async (name, quantity, page, showAll, companyId, sortName, sortStock, sortMin, sortMax, sortUnit) => {
  try {
    const perPage = 10;
    const pageQuery = parseInt(page) || 1;
    const skip = perPage * (pageQuery - 1);

    let query = {}; // Inicializamos la consulta como vacía

    // Inicializar opciones de ordenamiento
    let sortOptions = {};

    // Configurar el ordenamiento por nombre
    if (sortName) {
      sortOptions.name = sortName === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    }

    // Configurar el ordenamiento por stock
    if (sortStock) {
      sortOptions.stock = sortStock === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    if (sortMin) {
      sortOptions.min = sortMin === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    if (sortMax) {
      sortOptions.max = sortMax === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    if (sortUnit) {
      sortOptions.unit = sortUnit === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    // Si se busca por nombre
    if (name && name.name) {
      query.name = name.name;
    }

    // Si se solicitan todos los productos
    if (showAll === "1") {
      const productTotal = await inventaryModel.countDocuments({ ...query, companyId });
      const products = await inventaryModel.find({ ...query, companyId }).select('-image -description -price').sort(sortOptions);
      return {
        productTotal,
        products
      };
    }

    // Si se solicita una cantidad específica de productos
    if (quantity) {
      const productTotal = await inventaryModel.countDocuments({ ...query, companyId });
      const products = await inventaryModel.find({ ...query, companyId })
        .limit(quantity)
        .select('-image -description -price')
        .skip(skip)
        .sort(sortOptions); // Aplicar el ordenamiento
      return {
        productTotal,
        products
      };
    }

    // Si se solicita una página específica de productos
    const productTotal = await inventaryModel.countDocuments({ ...query, companyId });
    const products = await inventaryModel.find({ ...query, companyId })
      .select('-image -description -price')
      .limit(perPage)
      .skip(skip)
      .sort(sortOptions) // Aplicar el ordenamiento
      .exec();

    if (!products || products.length === 0) {
      return {
        products: []
      };
    }

    return {
      products,
      productTotal
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error retrieving inventory from the database');
  }
};



export const createProductInventory = async (name, stock, max, min, unit, companyId,unitQuantity,unitType) => {
  try {

    // const exist = await inventaryModel.findOne({ name, companyId })
    // if (exist) {
    //   return {
    //     msg: 'ya existe un producto con ese nombre'
    //   }
    // }
    const newProduct = await inventaryModel.create({ name, stock, max, min, unit, companyId,unitQuantity,unitType })
    if (!newProduct) {
      return {
        msg: 'hubo un error al crear producto'
      }
    }
    return newProduct
  } catch (error) {
    console.log(error)
  }
}


export const updateProductInventory = async (id, name, stock, max, min, unit, companyId, unitQuantity,unitType) => {
  try {
    const exist = await inventaryModel.findOne({
      name,
      companyId,
      _id: { $ne: id } // Excluye el producto actual de la búsqueda
    });
    if (exist) {
      return {
        msg: 'ya existe un producto con ese nombre'
      }
    }
    // Actualiza el inventario

    const updatedInventory = await inventaryModel.findByIdAndUpdate(id, { name, stock, max, min, unit, companyId,unitQuantity,unitType }, { new: true });

    if (!updatedInventory) {
      return {
        msg: 'No hay producto con ese id'
      };
    }

    // Encuentra todos los productos que tienen este inventario en su receta
    const productsToUpdate = await productModel.find({ 'recipe._id': id });
    // Actualiza el nombre del inventario en las recetas de esos productos
    for (const product of productsToUpdate) {
      let isModified = false;
      for (const item of product.recipe) {
        if (item._id.toString() === id) {
          item.name = name;
          isModified = true;
        }
      }
      // Guarda el producto solo si hubo cambios
      if (isModified) {
        await product.save();
      }
    }

    return updatedInventory;
  } catch (error) {
    console.log(error);
    return {
      msg: 'Hubo un error al actualizar el inventario'
    };
  }
};

export const deleteProductInventory = async (id) => {
  try {
    // Buscar el inventario a eliminar
    const deletedInventory = await inventaryModel.findByIdAndDelete(id);
    const inventaryTotal = await inventaryModel.countDocuments()


    // Si no se encuentra el inventario, retornar un mensaje
    if (!deletedInventory) {
      return {
        msg: 'No se encontró ningún modelo de inventario con ese ID.'
      };
    }

    // Actualizar los documentos del modelo productModel
    // Remover la referencia al inventario eliminado del campo recipe
    await productModel.updateMany(
      { "recipe._id": id },
      { $pull: { recipe: { _id: id } } }
    );

    // Retornar un mensaje de éxito
    return {
      inventaryTotal
    };
  } catch (error) {
    console.log(error);
    // Retornar un mensaje de error en caso de que ocurra algún problema
    return {
      msg: 'Ocurrió un error al eliminar la referencia al inventario en los productos.'
    };
  }
};


export const getProductByIdInventory = async (id) => {
  try {
    const product = await inventaryModel.findById(id)
    if (!product) {
      return {
        msg: 'no hay id con ese producto'
      }
    }
    return product
  } catch (error) {
    console.log(error)
  }
}


export const deleteManyInventory = async (ids) => {
  try {
    ids.forEach(async (id) => {
      const inventary = await inventaryModel.findByIdAndDelete(id, { new: true })
      const inventaryTotal = await inventaryModel.countDocuments()
      await productModel.updateMany(
        { "recipe._id": id },
        { $pull: { recipe: { _id: id } } }
      );
      return { inventary, inventaryTotal }
    })
  } catch (error) {
    console.log(error)
  }
}

export const manyInventary = async (inventory) => {
  try {
    const inventariesArray = [];
    let inventaryTotal;
    for (const value of inventory) {
      const inventaries = await inventaryModel.create(value);
      inventaryTotal = await inventaryModel.countDocuments()

      if (!inventaries) {
        return { inventaries: [] };
      }
      inventariesArray.push(inventaries);
    }
    return { inventariesArray, inventaryTotal };
  } catch (error) {
    console.log(error);
    throw error; // Puedes elegir manejar el error aquí o dejarlo para que lo maneje el controlador.
  }
};