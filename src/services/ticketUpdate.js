import tableModel from "../model/TableModel.js";
import ticketModel from "../model/TIcketModel.js";

export const updateTableTicket = async (id, table) => {
  try {
    const ticket = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    i;
    const table = await tableModel.findById(ticket.tableId);
    if (table) {
      table.available = false;
      await table.save();
    }
    ticket.tableId = table;
    await ticket.save();
    if (!ticket) {
      return {
        msg: "error updating ticket",
      };
    }
    return ticket;
  } catch (error) {
    console.log(error);
  }
};

export const updateWaiterTicket = async (id, waiter) => {
  try {
    const ticket = await ticketModel.findById(id);
    ticket.waiterId = waiter;
    await ticket.save();
    if (!ticket) {
      return {
        msg: "error updating ticket",
      };
    }
    const ticketReturn = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });

    return ticketReturn;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductTicket = async (id, productId) => {
  try {
    const ticket = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    ticket.products = ticket.products.filter(
      (value) => value._id.toString() !== productId.toString()
    );
    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
  }
};

export const payBillWithPart = async (bills) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

export const ticketProcess = async (id) => {
  try {
    const ticket = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    if (!ticket) {
      return {
        msg: "no hay tickets con ese id",
      };
    }
    ticket.status = "proceso";
    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
  }
};
export const updateTicketType = async (id, type) => {
  try {
    const ticket = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    if (!ticket) {
      return {
        msg: "no hay tickets con ese id",
      };
    }
    ticket.type = type;
    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
  }
};
export const updateTicketClient = async (id, client) => {
  try {
    const ticket = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    if (!ticket) {
      return {
        msg: "no hay tickets con ese id",
      };
    }
    ticket.client = client;
    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
  }
};
export const deleteTicketClient = async (id, type) => {
  try {
    const ticket = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    if (!ticket) {
      return {
        msg: "no hay tickets con ese id",
      };
    }
    ticket.type = type;
    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
  }
};
