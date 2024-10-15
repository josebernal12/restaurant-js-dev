import {
  createMultipleSuppliers,
  createSupplier,
  deleteMultipleSuppliers,
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
} from "../services/suppliers.js";

export const createSupplierController = async (req, res) => {
  const { name, address, phone, email, companyId } = req.body;

  const supplier = await createSupplier(name, address, phone, email, companyId);
  if (supplier?.msg) {
    return res.status(400).json(supplier);
  }
  res.json(supplier);
};

export const getSupplierByIdController = async (req, res) => {
  const { id } = req.params;
  
  const supplier = await getSupplierById(id);
  if (supplier?.msg) {
    return res.status(400).json(supplier);
  }
  res.json(supplier);
};

export const updateSupplierController = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, email, companyId } = req.body;

  const supplier = await updateSupplier(
    id,
    name,
    address,
    phone,
    email,
    companyId
  );
  if (supplier?.msg) {
    return res.status(400).json(supplier);
  }
  res.json(supplier);
};

export const deleteSupplierController = async (req, res) => {
  const { id } = req.params;

  const supplier = await deleteSupplier(id);
  if (supplier?.msg) {
    return res.status(400).json(supplier);
  }
  res.json(supplier);
};

export const getSuppliersController = async (req, res) => {
  let query = {};
  const { name, phone, address, email, sortName, sortEmail } = req.query;

  if (name) {
    query.name = { $regex: name, $options: "i" }; // Búsqueda parcial y case insensitive
  }
  if (phone) {
    query.phone = { $regex: phone, $options: "i" };
  }
  if (address) {
    query.address = { $regex: address, $options: "i" };
  }
  if (email) {
    query.email = { $regex: email, $options: "i" };
  }

  const showAll = req.query.showAll;
  const quantity = req.query.quantity;
  const page = req.query.page;
  const supplier = await getSuppliers(
    query,
    showAll,
    quantity,
    page,
    req.user.companyId.toString(),
    sortName,
    sortEmail
  );

  if (supplier?.msg) {
    return res.status(400).json(supplier);
  }
  res.json(supplier);
};

export const createMultipleSuppliersController = async (req, res) => {
  const suppliers = req.body;

  const newSuppliers = await createMultipleSuppliers(suppliers);

  if (newSuppliers?.msg) {
    return res.status(400).json(newSuppliers);
  }
  res.json(newSuppliers);
};

export const deleteMultipleSuppliersController = async (req, res) => {
  const { ids } = req.body;

  const supplier = await deleteMultipleSuppliers(ids);
  if (supplier?.msg) {
    return res.status(400).json(supplier);
  }
  res.json(supplier);
};
