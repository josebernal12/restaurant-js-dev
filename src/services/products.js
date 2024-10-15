import billModel from "../model/BillModel.js";
import inventaryModel from "../model/Inventary.js";
import productModel from "../model/ProductModel.js";
import moment from "moment-timezone";
import promotionModel from "../model/Promotion.js";
const TimeRange = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  QUARTER: "quarter",
  YEAR: "year",
};
const conversiones = {
  kg: 1000, // 1 kg = 1000 g
  gramos: 1, // 1 g = 1 g
  mg: 0.001, // 1 mg = 0.001 g
  litros: 1000, // 1 l = 1000 ml
  ml: 1, // 1 ml = 1 ml
  cl: 10, // 1 cl = 10 ml
  piezas: 1, // 1 pieza = 1 unidad
  uds: 1, // 1 unidad = 1 unidad
  m: 100, // 1 m = 100 cm
  cm: 1, // 1 cm = 1 cm
  mm: 0.1, // 1 mm = 0.1 cm
  botella: 1,
};

export const addProducts = async (
  name,
  description,
  price,
  category,
  image,
  discount,
  recipe,
  promotion,
  iva,
  companyId,
  priceBasis,
  show,
  currency,
  quantity = 1
) => {
  try {
    const newProduct = await (
      await productModel.create({
        name,
        description,
        price,
        category,
        image,
        discount,
        recipe,
        promotion,
        iva,
        companyId,
        priceBasis,
        show,
        currency,
      })
    ).populate("recipe");
    if (!newProduct) {
      return {
        msg: "Error al crear producto",
      };
    }

    for (const value of newProduct.recipe) {
      const product = await inventaryModel.findById(value._id);
      if (!product) {
        return {
          msg: `No se encontró el producto ${value._id} en el inventario`,
        };
      }

      // const recipeUnitQuantity =
      //   value.unitQuantity !== undefined ? value.unitQuantity : 1;
      // const inventoryUnitQuantity =
      //   product.unitQuantity !== undefined ? product.unitQuantity : 1;

      // const recipeItemStockEnGramos =
      //   value.stock * conversiones[value.unit] * recipeUnitQuantity * quantity; // Multiplying by quantity here
      // const inventoryItemStockEnGramos =
      //   product.stock * conversiones[product.unit.name] * inventoryUnitQuantity;

      // // Aquí solo se realiza la conversión, no se actualiza el inventario
      // const difference = inventoryItemStockEnGramos - recipeItemStockEnGramos;

      // if (difference < 0) {
      //   return {
      //     msg: `No hay suficiente ${product.name} para el ${value.name}`,
      //   };
      // }
    }

    return newProduct;
  } catch (error) {
    console.log(error);
    return {
      msg: "Error del servidor",
    };
  }
};

export const getProducts = async (
  query,
  page,
  showAll,
  limit,
  skip,
  companyId,
  sortName,
  sortPrice,
  sortCategory
) => {
  try {
    const productTotal = await productModel.countDocuments({
      ...query,
      companyId,
    });

    let sortOptions = {};

    // Ordenar por nombre si se especifica
    if (sortName) {
      sortOptions.name = sortName === "asc" ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    // Ordenar por precio si se especifica
    if (sortPrice) {
      sortOptions.price = sortPrice === "asc" ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    // Ordenar por nombre de categoría si se especifica
    if (sortCategory) {
      sortOptions["category.name"] = sortCategory === "asc" ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    let products;
    if (showAll === "1") {
      products = await productModel
        .find({ ...query, companyId })
        .sort(sortOptions) // Aplicar el ordenamiento
        .populate("category"); // Asegúrate de que 'category' está correctamente referenciado
    } else {
      products = await productModel
        .find({ ...query, companyId })
        .limit(limit)
        .skip(skip)
        .sort(sortOptions) // Aplicar el ordenamiento
        .populate("category"); // Asegúrate de que 'category' está correctamente referenciado
    }

    return {
      products,
      productTotal: products.length,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving products from the database");
  }
};

export const getProductsById = async (id) => {
  try {
    const product = await productModel.findById(id).populate("category");
    if (!product) {
      return {
        msg: "no hay productos con ese id",
      };
    }
    return product;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const product = await productModel.findByIdAndDelete(id);
    const productTotal = await productModel.countDocuments();

    if (!product) {
      return {
        msg: "no hay productos con ese id",
      };
    }
    return { product, productTotal };
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (
  id,
  name,
  description,
  price,
  category,
  discount,
  recipe,
  image,
  promotion,
  iva,
  companyId,
  priceBasis,
  show,
  currency
) => {
  try {
    if (!name || !description || !price || !category) {
      return { msg: "Todos los campos son obligatorios" };
    }

    const exist = await productModel.findOne({
      name,
      companyId,
      _id: { $ne: id }, // Excluye el producto actual de la búsqueda
    });

    if (exist) {
      return { msg: "Ya existe un producto con ese nombre" };
    }

    // Obtener el producto antes de la actualización
    const productsBefore = await productModel.findById(id).populate("recipe");

    // Actualizar el producto con la nueva información
    const productUpdate = await productModel
      .findByIdAndUpdate(
        id,
        {
          name,
          description,
          price,
          category,
          discount,
          recipe,
          promotion,
          image,
          iva,
          companyId,
          priceBasis,
          show,
          currency,
        },
        { new: true }
      )
      .populate("recipe");

    if (!productUpdate) {
      return { msg: "Error en la actualización" };
    }

    // Crear un map de los ingredientes antes de la actualización para un acceso más rápido
    const beforeRecipeMap = new Map(
      productsBefore.recipe.map((item) => [item._id.toString(), item])
    );

    // Iterar sobre los ingredientes en la receta actualizada
    for (let value of productUpdate.recipe) {
      const recipeUnitQuantity =
        value.unitQuantity !== undefined ? value.unitQuantity : 1;
      const valueStockEnGramos =
        value.stock * conversiones[value.unit] * recipeUnitQuantity;

      if (beforeRecipeMap.has(value._id.toString())) {
        // Si el ingrediente está en ambas recetas, ajustar el stock según la diferencia
        const oldProduct = beforeRecipeMap.get(value._id.toString());
        const oldRecipeUnitQuantity =
          oldProduct.unitQuantity !== undefined ? oldProduct.unitQuantity : 1;
        const oldStockEnGramos =
          oldProduct.stock *
          conversiones[oldProduct.unit] *
          oldRecipeUnitQuantity;
        const stockDifferenceEnGramos = valueStockEnGramos - oldStockEnGramos;

        // Realizar solo la conversión, sin actualizar el inventario
        const inventary = await inventaryModel.findById(value._id);
        const inventoryUnitQuantity =
          inventary.unitQuantity !== undefined ? inventary.unitQuantity : 1;
        const inventoryStockEnGramos =
          inventary.stock *
          conversiones[inventary.unit.name] *
          inventoryUnitQuantity;

        const newStockEnGramos =
          inventoryStockEnGramos - stockDifferenceEnGramos;
        const newStock =
          newStockEnGramos /
          (conversiones[inventary.unit.name] * inventoryUnitQuantity);

        // Eliminar el ingrediente del mapa para marcarlo como procesado
        beforeRecipeMap.delete(value._id.toString());
      } else {
        // Si el ingrediente es nuevo en la receta, solo realizar la conversión sin actualizar el inventario
        const inventary = await inventaryModel.findById(value._id);
        const inventoryUnitQuantity =
          inventary.unitQuantity !== undefined ? inventary.unitQuantity : 1;
        const inventoryStockEnGramos =
          inventary.stock *
          conversiones[inventary.unit.name] *
          inventoryUnitQuantity;

        const newStockEnGramos = inventoryStockEnGramos - valueStockEnGramos;
        const newStock =
          newStockEnGramos /
          (conversiones[inventary.unit.name] * inventoryUnitQuantity);
      }
    }

    // Los ingredientes restantes en beforeRecipeMap ya no están en la receta, no actualizar su stock
    for (let [key, oldProduct] of beforeRecipeMap) {
      const oldRecipeUnitQuantity =
        oldProduct.unitQuantity !== undefined ? oldProduct.unitQuantity : 1;
      const oldStockEnGramos =
        oldProduct.stock *
        conversiones[oldProduct.unit] *
        oldRecipeUnitQuantity;

      const inventary = await inventaryModel.findById(oldProduct._id);
      const inventoryUnitQuantity =
        inventary.unitQuantity !== undefined ? inventary.unitQuantity : 1;
      const inventoryStockEnGramos =
        inventary.stock *
        conversiones[inventary.unit.name] *
        inventoryUnitQuantity;

      const newStockEnGramos = inventoryStockEnGramos + oldStockEnGramos;
      const newStock =
        newStockEnGramos /
        (conversiones[inventary.unit.name] * inventoryUnitQuantity);
    }

    return productUpdate;
  } catch (error) {
    console.log(error);
    return { msg: "Error en la actualización" };
  }
};

export const searchProduct = async (name, price, category) => {
  try {
    const productSearch = await productModel.find({
      name: { $regex: new RegExp(name, "i") },
      // price: {
      //   $regex: new RegExp(price, 'i'),
      // },
      category: { $regex: new RegExp(category, "i") },
    });

    if (!productSearch) {
      return {
        msg: "error en la busqueda",
      };
    }
    return productSearch;
  } catch (error) {
    console.log(error);
  }
};

export const bestProduct = async (
  range,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  try {
    let filter = {};

    // Si se proporciona un rango de tiempo, ajustar el filtro por fecha
    if (range) {
      let startDate, endDate;

      switch (range) {
        case TimeRange.DAY:
          startDate = moment.tz(timeZone).startOf("day").toDate();
          endDate = moment.tz(timeZone).endOf("day").toDate();
          break;

        case TimeRange.WEEK:
          const today = new Date();
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 7); // Restar 7 días desde el día actual
          endDate = new Date(today); // El día actual es el fin del rango
          break;

        case TimeRange.MONTH:
          const currentDate = new Date();
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          ); // Primer día del mes
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          ); // Último día del mes
          break;

        case TimeRange.QUARTER:
          const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3); // Determinar el trimestre actual
          startDate = new Date(
            new Date().getFullYear(),
            3 * currentQuarter - 3,
            1
          ); // Primer día del trimestre
          endDate = new Date(new Date().getFullYear(), 3 * currentQuarter, 0); // Último día del trimestre
          break;

        case TimeRange.YEAR:
          startDate = new Date(new Date().getFullYear(), 0, 1); // Primer día del año
          endDate = new Date(new Date().getFullYear(), 11, 31); // Último día del año
          break;

        default:
          throw new Error("Rango de tiempo no válido");
      }

      filter = { createdAt: { $gte: startDate, $lte: endDate } };
    }

    // Obtener todas las facturas
    const bills = await billModel
      .find({ ...filter, companyId })
      .populate("ticketId");

    // Objeto para almacenar la cantidad total vendida de cada producto
    const soldProducts = {};
    for (const bill of bills) {
      for (const ticket of bill.ticketId) {
        for (const product of ticket.products) {
          let productStock = product.stock;

          // Recorre todas las promociones en lugar de solo la primera
          if (ticket.promotion.length >= 1 && product.idProduct) {
            for (const promotionId of ticket.promotion) {
              const promotion = await promotionModel.findById(promotionId);
              if (
                promotion &&
                promotion.productsId.includes(product.idProduct)
              ) {
                const type = promotion.type;
                const value = parseInt(type.split("x")[0]); // Ejemplo: 2x1, toma el 2
                productStock += productStock * (value - 1); // Ajusta el stock según promoción
              }
            }
          }

          // Manejo de productos de combo (idProduct)
          if (product.idProduct) {
            if (!soldProducts[product.idProduct]) {
              soldProducts[product.idProduct] = { stock: 0 };
            }
            soldProducts[product.idProduct].stock += productStock;
          } else {
            // Producto sin idProduct (producto regular)
            if (!soldProducts[product._id]) {
              soldProducts[product._id] = { stock: 0 };
            }
            soldProducts[product._id].stock += productStock;
          }
        }
      }
    }

    // Obtener los nombres de los productos vendidos
    const productIds = Object.keys(soldProducts);
    const productsInfo = await Promise.all(
      productIds.map(async (productId) => {
        const product = await productModel.findById(productId);
        if (!product) return null;
        return { name: product.name, stock: soldProducts[productId].stock };
      })
    );

    const validProductsInfo = productsInfo.filter(
      (product) => product !== null
    );

    // Ordenar los productos por el stock vendido
    const sortedProducts = validProductsInfo.sort((a, b) => b.stock - a.stock);

    if (sortedProducts.length === 0) {
      return { products: [] };
    }

    // Retornar los productos más vendidos en formato JSON
    const products = sortedProducts.map((product) => ({
      name: product.name,
      stock: product.stock,
    }));

    return { products };
  } catch (error) {
    console.log(error);
    throw new Error("Ocurrió un error al obtener los productos más vendidos.");
  }
};

export const deleteManyProducts = async (ids) => {
  try {
    ids.forEach(async (id) => {
      const product = await productModel.findByIdAndDelete(id, { new: true });
      const productTotal = await productModel.countDocuments();

      return { product, productTotal };
    });
  } catch (error) {
    console.log(error);
  }
};

export const manyProduct = async (products) => {
  try {
    const productsArray = [];
    let productTotal;
    for (const value of products) {
      const product = await productModel.create(value);
      productTotal = await productModel.countDocuments();

      if (!product) {
        return { product: [] };
      }
      productsArray.push(product);
    }
    return { productsArray, productTotal };
  } catch (error) {
    console.log(error);
    throw error; // Puedes elegir manejar el error aquí o dejarlo para que lo maneje el controlador.
  }
};
