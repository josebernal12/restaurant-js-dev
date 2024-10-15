import {
  bestWaiter,
  generateBill,
  generateMultipleBills,
  getBillById,
  getBillLastWeek,
  getBills,
  productSell,
  sells,
  userSell,
} from "../services/bill.js";
import {
  billSell,
  billSellByQuery,
  hourProduct,
  inventorySell,
  productSellAll,
  sellsCategory,
  userSellByTable,
} from "../services/sells.js";

export const generateBillController = async (req, res) => {
  const { ticketId, userId, methodOfPayment, companyId, tips, iva, type } =
    req.body;
  const { id } = req.params;
  const bill = await generateBill(
    ticketId,
    id,
    userId,
    methodOfPayment,
    companyId,
    tips,
    iva,
    type
  );
  if (bill?.msg) {
    res.status(404).json(bill);
    return;
  }
  res.json(bill);
};

export const getBillsController = async (req, res) => {
  let page;
  let type;
  let name;
  let showAll;
  let quantity;
  let firstDate;
  let secondDate;
  let tableId;
  if (req.query.page) {
    page = req.query.page;
  }
  if (req.query.firstDate) {
    firstDate = req.query.firstDate;
  }
  if (req.query.secondDate) {
    secondDate = req.query.secondDate;
  }
  if (req.query.type) {
    type = req.query.type;
  }
  if (req.query.name) {
    name = req.query.name;
  }
  if (req.query.showAll) {
    showAll = req.query.showAll;
  }
  if (req.query.quantity) {
    quantity = req.query.quantity;
  }
  if (req.query.tableId) {
    tableId = req.query.tableId;
  }
  const bills = await getBills(
    page,
    type,
    name,
    showAll,
    quantity,
    firstDate,
    secondDate,
    tableId,
    req.user.companyId.toString()
  );
  if (bills?.msg) {
    res.status(404).json(bills);
    return;
  }
  res.json(bills);
};

export const getBillByIdController = async (req, res) => {
  const { id } = req.params;
  const bill = await getBillById(id);
  if (bill?.msg) {
    res.status(404).json(bill);
    return;
  }
  res.json(bill);
};

export const bestWaiterController = async (req, res) => {
  let type;
  if (req.query.type) {
    type = req.query.type;
  }
  const bill = await bestWaiter(
    type,
    req.user.companyId.toString(),
    req.query.timeZone
  );
  if (bill?.msg) {
    res.status(404).json(bill);
    return;
  }
  res.json(bill);
};

export const sellsController = async (req, res) => {
  let date;
  if (req.query.date) {
    date = req.query.date;
  }
  const sellsTotal = await sells(
    date,
    req.user.companyId.toString(),
    req.query.timeZone
  );
  if (sellsTotal?.msg) {
    res.status(404).json(sellsTotal);
    return;
  }
  res.json(sellsTotal);
};

export const getBillLastWeekController = async (req, res) => {
  let type;
  let page;
  const { timeZone } = req.body;
  if (req.query.type) {
    type = req.query.type;
  }
  if (req.query.page) {
    page = req.query.page;
  }
  const response = await getBillLastWeek(
    type,
    page,
    req.user.companyId.toString(),
    timeZone
  );
  res.json(response);
};

export const userSellController = async (req, res) => {
  let name;
  let date;
  const { id } = req.params;
  if (req.query.name) {
    name = req.query.name;
  }
  if (req.query.date) {
    date = req.query.date;
  }
  const users = await userSell(
    id,
    req.user.companyId.toString(),
    req.query.timeZone
  );
  res.json(users);
};
export const productSellController = async (req, res) => {
  let name;
  let date;
  const { id } = req.params;
  if (req.query.name) {
    name = req.query.name;
  }
  if (req.query.date) {
    date = req.query.date;
  }
  const users = await productSell(
    id,
    req.user.companyId.toString(),
    req.query.timeZone
  );
  res.json(users);
};
export const userSellByTableController = async (req, res) => {
  let name;
  let date;
  const { id } = req.params;
  if (req.query.name) {
    name = req.query.name;
  }
  if (req.query.date) {
    date = req.query.date;
  }
  const users = await userSellByTable(
    id,
    name,
    date,
    req.user.companyId.toString()
  );
  res.json(users);
};

export const hourProductController = async (req, res) => {
  const { id } = req.params;
  const product = await hourProduct(id, req.user.companyId.toString());
  res.json(product);
};
export const inventorySellController = async (req, res) => {
  const { id } = req.params;
  const inventory = await inventorySell(
    id,
    req.user.companyId.toString(),
    req.query.timeZone
  );
  res.json(inventory);
};
export const billSellController = async (req, res) => {
  const bill = await billSell(
    req.user.companyId.toString(),
    req.query.timeZone
  );
  res.json(bill);
};
export const productsSellAllController = async (req, res) => {
  const products = await productSellAll(
    req.user.companyId.toString(),
    req.query.timeZone
  );
  res.json(products);
};
export const billSellByQuerysController = async (req, res) => {
  let date;
  if (req.query.date) {
    date = req.query.date;
  }
  const bills = await billSellByQuery(date, req.user.companyId.toString());
  res.json(bills);
};

export const createMultipleBillsController = async (req, res) => {
  const { tickets, userId, methodOfPayment, tableId, companyId } = req.body;

  const bills = await generateMultipleBills(
    tickets,
    tableId,
    userId,
    methodOfPayment,
    companyId
  );

  res.json(bills);
};

export const sellsCategoryController = async (req, res) => {
  const categories = await sellsCategory(
    req.query.date,
    req.user.companyId.toString(),
    req.query.timeZone
  );

  res.json(categories);
};
