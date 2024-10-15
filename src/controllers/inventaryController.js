import {
  createProductInventory,
  deleteManyInventory,
  deleteProductInventory,
  getProductByIdInventory,
  inventary,
  manyInventary,
  updateProductInventory
} from "../services/inventary.js";

export const inventaryController = async (req, res) => {
  const query = {}; // Inicializar el objeto de consulta
  let page;
  let showAll;
  let quantity;
  let sortName;
  let sortStock;
  let sortMin;
  let sortMax;
  let sortUnit;
  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: 'i' }; // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.page) {
    page = req.query.page // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.showAll) {
    showAll = req.query.showAll // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.quantity) {
    quantity = req.query.quantity // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.sortName) {
    sortName = req.query.sortName // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.sortStock) {
    sortStock = req.query.sortStock // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.sortMin) {
    sortMin = req.query.sortMin // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.sortMax) {
    sortMax = req.query.sortMax // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.sortUnit) {
    sortUnit = req.query.sortUnit // 'i' para hacer la búsqueda case-insensitive
  }
  const products = await inventary(query, quantity, page, showAll, req.user.companyId.toString(), sortName, sortStock, sortMin, sortMax, sortUnit)
  if (products?.msg) {
    res.status(404).json(products)
    return
  }
  res.json(products)
}

export const createProductInventoryController = async (req, res) => {
  const { name, stock, max, min, unit, companyId,unitQuantity, unitType } = req.body
  const product = await createProductInventory(name, stock, max, min, unit, companyId,unitQuantity,unitType)
  if (product?.msg) {
    res.status(404).json(product)
    return
  }
  res.json(product)
}

export const updateProductInventoryController = async (req, res) => {
  const { id } = req.params
  const { name, stock, max, min, unit, companyId,unitQuantity,unitType } = req.body
  const product = await updateProductInventory(id, name, stock, max, min, unit, companyId,unitQuantity,unitType)
  if (product?.msg) {
    res.status(404).json(product)
    return
  }
  res.json(product)
}

export const deleteProductInventoryController = async (req, res) => {
  const { id } = req.params
  const product = await deleteProductInventory(id)
  if (product?.msg) {
    res.status(404).json(product)
    return
  }
  res.json(product)
}

export const getProducInventoryByIdController = async (req, res) => {
  const { id } = req.params

  const product = await getProductByIdInventory(id)
  if (product?.msg) {
    res.status(404).json(product)
    return
  }
  res.json(product)
}


export const deleteManyInventaryController = async (req, res) => {
  const { ids } = req.body
  const inventary = await deleteManyInventory(ids)

  res.json(inventary)

}

export const manyInventaryController = async (req, res) => {
  const inventory = req.body;
  try {
    const inventaries = await manyInventary(inventory);
    res.json(inventaries);
  } catch (error) {
    // Manejar el error aquí si es necesario
    console.log(error);
    res.status(500).json({ error: 'Ha ocurrido un error al procesar la solicitud.' });
  }
};