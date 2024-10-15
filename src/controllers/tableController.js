import {
  availableTable,
  createTable,
  deleteTable,
  getTableById,
  getTables,
} from "../services/table.js";

export const availableTableController = async (req, res) => {
  const { available, companyId } = req.body;
  const { id } = req.params;

  const table = await availableTable(id, available, companyId);
  res.json(table);
};

export const createTableController = async (req, res) => {
  const { available, quantity, companyId } = req.body;

  // const user = req.user
  const table = await createTable(available, quantity, companyId);
  res.json(table);
};

export const getTablesController = async (req, res) => {
  const { number } = req.query;
  const tables = await getTables(number, req.user.companyId.toString());
  res.json(tables);
};

export const getTableByIdController = async (req, res) => {
  const { id } = req.params;
  const table = await getTableById(id);
  res.json(table);
};

export const deleteTableController = async (req, res) => {
  const { id } = req.params;
  const table = await deleteTable(id, req.user.companyId.toString());
  res.json(table);
};
