import {
  cancelAccount,
  completedAllProductTicket,
  completedProduct,
  createMultipleTickets,
  createTicket,
  deleteTicket,
  finishedTicket,
  getAllTickets,
  getTicketById,
  getTickets,
  joinAllProductsTicket,
  newUpdateTicket,
  receivedTicket,
  updateTicket,
} from "../services/ticket.js";
import {
  deleteProductTicket,
  ticketProcess,
  updateTableTicket,
  updateTicketClient,
  updateTicketType,
  updateWaiterTicket,
} from "../services/ticketUpdate.js";

export const createTicketController = async (req, res) => {
  const {
    products,
    subtotal,
    total,
    userId,
    waiter,
    waiterId,
    promotion,
    companyId,
    type,
    client,
    productsLocalStorage,
  } = req.body;
  const { id } = req.params;

  const ticket = await createTicket(
    products,
    subtotal,
    total,
    id,
    userId,
    waiter,
    waiterId,
    promotion,
    companyId,
    type,
    client,
    productsLocalStorage
  );
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const updateTicketController = async (req, res) => {
  const {
    products,
    subTotal,
    total,
    tableId,
    userId,
    waiterId,
    promotion,
    companyId,
  } = req.body;
  const { id } = req.params;

  const ticket = await newUpdateTicket(
    id,
    products,
    subTotal,
    total,
    tableId,
    userId,
    waiterId,
    promotion,
    companyId
  );

  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const getTicketsController = async (req, res) => {
  const query = {}; // Inicializar el objeto de consulta
  if (req.query.waiter) {
    query.waiter = { $regex: req.query.waiter, $options: "i" }; // 'i' para hacer la búsqueda case-insensitive
  }
  const tickets = await getTickets(query, req.user.companyId.toString());
  if (tickets?.msg) {
    res.status(404).json(tickets);
    return;
  }
  res.json(tickets);
};

export const getTicketsByIdController = async (req, res) => {
  const { id } = req.params;

  const ticket = await getTicketById(id);

  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const deleteTicketController = async (req, res) => {
  const { id } = req.params;
  const ticket = await deleteTicket(id);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const cancelTicketController = async (req, res) => {
  const { id } = req.params;
  const { productsLocalStorage } = req.body;
  const message = await cancelAccount(
    id,
    req.user.companyId.toString(),
    productsLocalStorage
  );
  if (message?.msg) {
    res.status(404).json(message);
    return;
  }
  res.json(message);
};

export const receivedTicketController = async (req, res) => {
  const { id } = req.params;

  const ticket = await receivedTicket(id);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};
export const finishedTicketController = async (req, res) => {
  const { id } = req.params;

  const ticket = await finishedTicket(id);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const completedProductController = async (req, res) => {
  const { id } = req.params;
  const { idProduct } = req.body;
  const ticket = await completedProduct(id, idProduct);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const completedAllProductTicketController = async (req, res) => {
  const { id } = req.params;
  const ticket = await completedAllProductTicket(id);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const joinAllProductsTicketController = async (req, res) => {
  const ids = req.body;
  const ticket = await joinAllProductsTicket(
    req.user.companyId.toString(),
    ids
  );
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const getAllTicketsController = async (req, res) => {
  const tickets = await getAllTickets(req.user.companyId.toString());
  if (tickets?.msg) {
    res.status(404).json(tickets);
    return;
  }
  res.json(tickets);
};

export const createMultipleTicketsControlller = async (req, res) => {
  const { tickets } = req.body;

  const response = await createMultipleTickets(tickets);

  res.json(response);
};

export const updateTableTicketController = async (req, res) => {
  const { id } = req.params;
  const { table } = req.body;
  const ticket = await updateTableTicket(id, table);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const updateWaiterTicketController = async (req, res) => {
  const { id } = req.params;
  const { waiter } = req.body;
  const ticket = await updateWaiterTicket(id, waiter);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const deleteProductTicketController = async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;

  const ticket = await deleteProductTicket(id, productId);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};
export const ticketProcessController = async (req, res) => {
  const { id } = req.params;

  const ticket = await ticketProcess(id);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const updateTicketTypeController = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  const ticket = await updateTicketType(id, type);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};
export const updateTicketClientController = async (req, res) => {
  const { id } = req.params;
  const { client } = req.body;

  const ticket = await updateTicketClient(id, client);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};
