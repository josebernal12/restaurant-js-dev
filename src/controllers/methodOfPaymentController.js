import {
  findMethodOfPaymentByCompany,
  quantitySellMethodOfPayment,
  totalSellCash,
  totalSellCreditCard,
  totalSellCreditDebit,
  totalSellTransfer,
  updateMethodOfPayment,
} from "../services/methodOfPayment.js";

export const updateMethodOfPaymentController = async (req, res) => {
  const { cash, transfer, creditCard, creditDebit } = req.body;

  const methodOfPayment = await updateMethodOfPayment(
    req.user.companyId.toString(),
    cash,
    transfer,
    creditCard,
    creditDebit
  );
  if (methodOfPayment?.msg) {
    return res.status(400).json(methodOfPayment);
  }
  res.json(methodOfPayment);
};

export const findMethodOfPaymentByCompanyController = async (req, res) => {
  const methodOfPayment = await findMethodOfPaymentByCompany(
    req.user.companyId.toString()
  );
  if (methodOfPayment?.msg) {
    return res.status(400).json(methodOfPayment);
  }
  res.json(methodOfPayment);
};

export const quantitySellMethodOfPaymentController = async (req, res) => {
  const response = await quantitySellMethodOfPayment(
    req.query.date,
    req.user.companyId.toString(),
    req.query.timeZone
  );
  res.json(response);
};

export const totalSellCashController = async (req, res) => {
  const response = await totalSellCash(
    req.query.date,
    req.user.companyId.toString(),
    req.query.timezone
  );
  res.json(response);
};

export const totalSellTransferController = async (req, res) => {
  const response = await totalSellTransfer(
    req.query.date,
    req.user.companyId.toString(),
    req.query.timeZone
  );
  res.json(response);
};

export const totalSellCreditCardController = async (req, res) => {
  const response = await totalSellCreditCard(
    req.query.date,
    req.user.companyId.toString(),
    req.query.timeZone
  );
  res.json(response);
};

export const totalSellCreditDebitController = async (req, res) => {
  const response = await totalSellCreditDebit(
    req.query.date,
    req.user.companyId.toString(),
    req.query.timeZone
  );
  res.json(response);
};
