import categoryModel from "../model/CategoryModel.js";
import {
  addProducts,
  bestProduct,
  deleteManyProducts,
  deleteProduct,
  getProducts,
  getProductsById,
  manyProduct,
  searchProduct,
  updateProduct,
} from "../services/products.js";
export const addProductController = async (req, res) => {
  const {
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
  } = req.body;
  const newProduct = await addProducts(
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
    currency
  );
  if (newProduct?.msg) {
    res.status(404).json(newProduct);
    return;
  }
  res.json(newProduct);
};

export const getProductsController = async (req, res) => {
  const query = {};
  const {
    name,
    category,
    page,
    showAll,
    quantity,
    sortName,
    sortPrice,
    sortCategory,
  } = req.query;

  if (name) {
    query.name = { $regex: name, $options: "i" }; // 'i' para hacer la búsqueda case-insensitive
  }

  if (category) {
    try {
      const categoryDoc = await categoryModel.findOne({
        name: { $regex: category, $options: "i" },
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        return res.status(200).json({ category: [] });
      }
    } catch (error) {
      return res.status(500).json({ msg: "Server error" });
    }
  }

  const pageNumber = parseInt(page) || 1;
  const limit = parseInt(quantity) || 10;
  const skip = (pageNumber - 1) * limit;

  try {
    const products = await getProducts(
      query,
      pageNumber,
      showAll,
      limit,
      skip,
      req.user.companyId.toString(),
      sortName,
      sortPrice,
      sortCategory
    );
    if (!products.products.length) {
      return res.status(200).json({ products: [] });
    }
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getProductByIdController = async (req, res) => {
  const { id } = req.params;
  const product = await getProductsById(id);
  if (product?.msg) {
    res.status(404).json(product);
    return;
  }
  res.json(product);
};

export const deleteProductController = async (req, res) => {
  const { id } = req.params;
  const productDeleted = await deleteProduct(id);
  if (productDeleted?.msg) {
    res.status(404).json(productDeleted);
    return;
  }
  res.json(productDeleted);
};

export const updateProductController = async (req, res) => {
  const { id } = req.params;
  const {
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
  } = req.body;
  const productUpdate = await updateProduct(
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
    show
  );
  if (productUpdate?.msg) {
    res.status(404).json(productUpdate);
    return;
  }
  res.json(productUpdate);
};

export const searchProductController = async (req, res) => {
  const { name, price, category } = req.body;
  const productSearch = await searchProduct(name, price, category);
  res.json(productSearch);
};

export const bestProductController = async (req, res) => {
  let range;
  if (req.query.range) {
    range = req.query.range;
  }
  const bill = await bestProduct(
    range,
    req.user.companyId.toString(),
    req.query.timeZone
  );
  res.json(bill);
};
export const deleteManyProductsController = async (req, res) => {
  const { ids } = req.body;
  const product = await deleteManyProducts(ids);

  res.json(product);
};

export const manyProductsController = async (req, res) => {
  const { products } = req.body;
  try {
    const product = await manyProduct(products);
    res.json(product);
  } catch (error) {
    // Manejar el error aquí si es necesario
    console.log(error);
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al procesar la solicitud." });
  }
};
