import mongoose from "mongoose";
import ticketModel from "../model/TIcketModel.js";
import tableModel from "../model/TableModel.js";
import productModel from "../model/ProductModel.js";
import promotionModel from "../model/Promotion.js";
import inventaryModel from "../model/Inventary.js";

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
export const createTicket = async (
  products,
  subTotal,
  total,
  tableId,
  userId,
  waiter,
  waiterId,
  promotion,
  companyId,
  type,
  client,
  productsLocalStorage
) => {
  try {
    if (!products || !total) {
      return {
        msg: "Todos los campos son obligatorios",
      };
    }

    const tableObjectId = mongoose.Types.ObjectId(tableId);
    const table = await tableModel.findById(tableObjectId);

    if (!table) {
      return {
        msg: "No existen mesas con ese ID",
      };
    }

    let invalid = false;

    // Verificar y corregir la categoría de los productos
    for (const product of products) {
      if (!product.category || product.category === "") {
        product.category = null; // Asignar null si está vacío
      }

      if (product?.recipe) {
        for (const recipe of product.recipe) {
          const inventoryItem = await inventaryModel.findById(recipe._id);
          if (!inventoryItem) continue;

          for (const localProduct of productsLocalStorage) {
            if (localProduct._id.toString() === inventoryItem._id.toString()) {
              if (localProduct.stock < 0) {
                invalid = true;
                break;
              }

              await inventaryModel.findByIdAndUpdate(localProduct._id, {
                stock: localProduct.stock,
              });
            }
          }
        }
      }

      if (invalid) break;
    }

    if (invalid) {
      return {
        msg: "El stock de al menos uno de los productos es insuficiente",
      };
    }

    const lastBill = await ticketModel
      .findOne({ companyId })
      .sort({ folio: -1 });
    const newFolio = lastBill && lastBill.folio ? lastBill.folio + 1 : 1;
    const tableAvailable = await tableModel.findById(tableId);
    tableAvailable.available = false;
    await tableAvailable.save();

    const newTicket = await ticketModel.create({
      products,
      subTotal,
      total,
      tableId,
      userId,
      waiter,
      waiterId,
      promotion,
      folio: newFolio,
      companyId,
      type,
      client,
    });

    if (!newTicket) {
      return {
        msg: "Error al crear el ticket",
      };
    }

    newTicket.status = "proceso";
    await newTicket.save();
    const ticket = await ticketModel.findById(newTicket._id).populate({
      path: "waiterId",
      select: "-password",
    });

    return ticket;
  } catch (error) {
    console.log(error);
    return {
      msg: "Ocurrió un error al crear el ticket",
    };
  }
};


// Helper function to get the promotion factor
const getPromotionFactor = (type) => {
  switch (type) {
    case "2x1":
      return 2;
    case "3x1":
      return 3;
    default:
      return 1;
  }
};

export const updateTicket = async (
  id,
  products,
  subTotal,
  total,
  tableId,
  userId,
  waiterId,
  promotion,
  companyId
) => {
  try {
    // Encontrar el ticket actual
    const ticket = await ticketModel.findById(id);
    if (!ticket) {
      return {
        msg: "El ticket no existe",
      };
    }
    if (!products || !subTotal || !total) {
      return {
        msg: "Todos los campos son obligatorios",
      };
    }

    // Objeto para almacenar la diferencia de stock
    const stockDifference = {};

    // Verificar y calcular la diferencia de stock para los productos en el ticket
    for (const product of products) {
      const originalProduct = ticket.products.find(
        (p) => p._id.toString() === product._id.toString()
      );
      if (!originalProduct) {
        // Si el producto no existe en el ticket original, considerarlo como un nuevo producto
        stockDifference[product._id] = product.stock;
      } else {
        // Calcular la diferencia de stock para los productos existentes en el ticket
        const diff = product.stock - originalProduct.stock;
        stockDifference[product._id] = diff;
      }

      const productData = await productModel.findById(product._id);
      if (!productData) {
        return {
          msg: `No se encontró el producto ${product._id}`,
        };
      }
      if (productData.stock + stockDifference[product._id] < 0) {
        return {
          msg: `No hay suficiente stock disponible para el producto ${product._id}`,
        };
      }
    }

    // Verificación del stock para los productos en la promoción
    let invalid = false;
    if (promotion.length > 0) {
      for (const value of promotion) {
        const promotionItem = await promotionModel.findById(value);
        for (const product of promotionItem.productsId) {
          const promoProduct = await productModel.findById(product);
          for (const recipe of promoProduct.recipe) {
            const inventoryItem = await inventaryModel.findById(recipe._id);
            if (inventoryItem.stock < recipe.stock) {
              invalid = true;
              break;
            }
          }
          if (invalid) break;
        }
        if (invalid) break;
      }
    }

    if (invalid) {
      return {
        msg: "La cantidad de al menos uno de los productos de la promoción supera el stock disponible",
      };
    }

    // Agregar nuevos productos al ticket
    for (const productId in stockDifference) {
      if (stockDifference[productId] > 0) {
        const newProduct = products.find((p) => p._id.toString() === productId);
        ticket.products.push(newProduct);
      }
    }

    // Actualizar el stock de los productos
    for (const productId in stockDifference) {
      await productModel.findByIdAndUpdate(productId, {
        $inc: { stock: -stockDifference[productId] },
      });

      // Actualizar el stock de los ingredientes en la receta del producto
      const product = products.find((p) => p._id.toString() === productId);
      for (const recipe of product.recipe) {
        await inventaryModel.findByIdAndUpdate(recipe._id, {
          $inc: { stock: -recipe.stock },
        });
      }
    }

    // Actualizar el stock de los productos de la promoción
    if (promotion.length > 0) {
      for (const value of promotion) {
        const promotionItem = await promotionModel.findById(value);
        for (const product of promotionItem.productsId) {
          const promoProduct = await productModel.findById(product);
          for (const recipe of promoProduct.recipe) {
            if (recipe._id) {
              await inventaryModel.findByIdAndUpdate(recipe._id, {
                $inc: { stock: -recipe.stock },
              });
            }
          }
        }
      }
    }

    // Actualizar el ticket
    const ticketUpdate = await ticketModel.findByIdAndUpdate(
      id,
      {
        products: ticket.products,
        subTotal,
        total,
        tableId,
        userId,
        waiterId,
        promotion,
        companyId,
      },
      { new: true }
    );
    if (!ticketUpdate) {
      return {
        msg: "No se pudo actualizar el ticket",
      };
    }

    return ticketUpdate;
  } catch (error) {
    console.log(error);
    return {
      msg: "Ocurrió un error al actualizar el ticket",
    };
  }
};

export const newUpdateTicket = async (
  id,
  products,
  subTotal,
  total,
  tableId,
  userId,
  type
) => {
  try {
    const ticket = await ticketModel.findById(id);
    if (!ticket) {
      return {
        msg: "El ticket no existe",
      };
    }
    // if (type) {
    //   ticket.products.forEach(async (product) => {
    //     const product = await productModel.findById(product._id)
    //   })

    //   const ticketUpdate = await ticketModel.findByIdAndUpdate(id, { products, subTotal, total, tableId, userId })
    //   return ticketUpdate
    // }
  } catch (error) {
    console.log(error);
  }
};

export const getTickets = async (name, companyId) => {
  try {
    if (name.waiter) {
      const tickets = await ticketModel.find({ name, companyId }).populate({
        path: "waiterId",
        select: "-password", // Excluir el campo password
      });
      return tickets;
    }
    const tickets = await ticketModel.find({ companyId }).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    if (!tickets) {
      return {
        tickets: [],
      };
    }
    return tickets;
  } catch (error) {
    console.log(error);
  }
};

export const getTicketById = async (id) => {
  try {
    const ticket = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    if (!ticket) {
      return {
        msg: "no hay ticket con ese id",
      };
    }
    if (ticket.completed === false) {
      return ticket;
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteTicket = async (id) => {
  let noMatchFound = true;

  try {
    const tickets = await ticketModel.find({ companyId });
    const ticketDeleted = await ticketModel.findByIdAndDelete(id, {
      new: true,
    });

    if (!ticketDeleted) {
      return {
        msg: "no hay tickets con ese id",
      };
    }

    for (const ticket of tickets) {
      if (ticket.tableId.toString() === ticketDeleted.tableId.toString()) {
        noMatchFound = false;
        break;
      }
    }

    if (noMatchFound) {
      const table = await tableModel.findById(ticketDeleted.tableId);
      table.available = true;
      await table.save();
    }

    return ticketDeleted;
  } catch (error) {
    console.log(error);
  }
};

export const joinTable = async (idsTables) => {
  try {
    const ticket = await ticketModel.create();
  } catch (error) {
    console.log(error);
  }
};
export const cancelAccount = async (
  ticketId,
  companyId,
  productsLocalStorage
) => {
  try {
    // Buscar el ticket por ID
    const ticket = await ticketModel
      .findById(ticketId)
      .populate("products.recipe");
    if (!ticket) {
      return {
        msg: "Ticket no encontrado",
      };
    }

    // Regenerar el inventario a partir de las recetas
    for (const product of ticket.products) {
      if (product?.recipe) {
        for (const recipe of product.recipe) {
          const inventoryItem = await inventaryModel.findById(recipe._id);
          if (!inventoryItem) continue;

          // Iterar sobre el array de productsLocalStorage
          for (const localProduct of productsLocalStorage) {
            if (localProduct._id.toString() === inventoryItem._id.toString()) {
              // Verificar que el stock en localProduct no sea negativo
              if (localProduct.stock < 0) {
                invalid = true;
                break;
              }

              // Actualizar el stock si es válido
              await inventaryModel.findByIdAndUpdate(localProduct._id, {
                stock: localProduct.stock, // Usar el stock ya calculado
              });
            }
          }
        }
      }

      // Restablecer el stock del producto general
      await productModel.findByIdAndUpdate(product._id, {
        $inc: { stock: product.stock }, // Regenerar el stock
      });
    }

    // Eliminar el ticket
    await ticketModel.deleteOne({ _id: ticketId });

    // Después de eliminar, buscar la mesa asociada
    const tables = await tableModel.find({
      companyId,
      _id: ticket.tableId.toString(),
    });

    // Iterar sobre las mesas encontradas
    for (const table of tables) {
      // Contar cuántos tickets están activos para esa mesa
      const activeTickets = await ticketModel.countDocuments({
        tableId: table._id,
        companyId,
      });

      // Si no hay más tickets activos para esa mesa, marcar como disponible
      if (activeTickets === 0) {
        table.available = true;
        await table.save();
      }
    }

    return ticket;
  } catch (error) {
    console.log(error);
    return {
      msg: "Ocurrió un error al cancelar el ticket",
    };
  }
};

export const receivedTicket = async (id) => {
  try {
    const ticket = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    if (!ticket) {
      return {
        msg: "no hay ticket con ese id",
      };
    }
    ticket.status = "completado";
    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
  }
};

export const finishedTicket = async (id) => {
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
    ticket.status = "finalizado";
    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
  }
};

export const completedProduct = async (id, idProduct) => {
  try {
    const ticket = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    if (!ticket) {
      return {
        msg: "no hay id con ese ticket",
      };
    }
    ticket.products.forEach((product) => {
      if (product._id.toString() === idProduct.toString()) {
        product.completed = true;
      }
    });
    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
  }
};

export const completedAllProductTicket = async (id) => {
  try {
    const ticket = await ticketModel.findById(id).populate({
      path: "waiterId",
      select: "-password", // Excluir el campo password
    });
    if (!ticket) {
      return {
        msg: "no hay id con ese tikcet",
      };
    }
    ticket.products.forEach((product) => {
      product.completed = true;
    });
    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
  }
};

export const joinAllProductsTicket = async (companyId, ids) => {
  try {
    let ticketAll = [];

    for (const id of ids) {
      const ticket = await ticketModel.findById(id).populate({
        path: "waiterId",
        select: "-password", // Exclude the password field
      });

      console.log(ticket);

      if (!ticket) {
        return {
          msg: "no hay ticket en esa mesa",
        };
      }

      if (companyId !== ticket.companyId.toString()) {
        return {
          msg: "no tienes permiso para esta operacion",
        };
      }

      ticketAll.push(ticket);
    }

    return ticketAll;
  } catch (error) {
    console.log(error);
  }
};

export const getAllTickets = async (companyId) => {
  const tickets = await ticketModel.find({ companyId }).populate({
    path: "waiterId",
    select: "-password", // Esto excluye el campo 'password'
  });

  if (!tickets || tickets.length === 0) {
    return {
      tickets: [],
    };
  }

  // Crear un objeto para mapear tableId a arrays de tickets
  const ticketsGrouped = tickets.reduce((acc, ticket) => {
    const { tableId } = ticket;
    if (!acc[tableId]) {
      acc[tableId] = [ticket];
    } else {
      acc[tableId].push(ticket);
    }
    return acc;
  }, {});

  // Extraer los arrays de tickets agrupados en un solo array
  const groupedTickets = Object.values(ticketsGrouped);

  return {
    tickets: groupedTickets,
  };
};

export const createMultipleTickets = async (tickets) => {
  try {
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return {
        msg: "El array de tickets es obligatorio y no puede estar vacío",
      };
    }
    const createdTickets = [];
    for (const ticket of tickets) {
      const {
        products,
        subTotal,
        total,
        tableId,
        userId,
        waiter,
        waiterId,
        promotion,
        companyId,
      } = ticket;
      if (!products || !total) {
        return {
          msg: "Todos los campos son obligatorios en cada ticket",
        };
      }

      const tableObjectId = mongoose.Types.ObjectId(tableId);
      const table = await tableModel.findById(tableObjectId);

      if (!table) {
        return {
          msg: `No existen mesas con el ID ${tableId}`,
        };
      }

      let invalid = false;

      if (promotion) {
        if (promotion.length > 0) {
          for (const value of promotion) {
            const promotionDoc = await promotionModel.findById(value);
            for (const product of promotionDoc.productsId) {
              const promoProduct = await productModel.findById(product);
              for (const recipe of promoProduct.recipe) {
                if (recipe._id) {
                  await inventaryModel.findByIdAndUpdate(recipe._id, {
                    $inc: { stock: -recipe.stock },
                  });
                }
              }
            }
          }
        }
      }

      const lastBill = await ticketModel.findOne().sort({ folio: -1 });
      const newFolio = lastBill && lastBill.folio ? lastBill.folio + 1 : 1;

      for (const product of products) {
        const productUpdate = await productModel.findById(product._id);

        for (const recipe of product.recipe) {
          console.log(recipe);
          const inventoryItem = await inventaryModel.findById(recipe._id);
          console.log(inventoryItem);
          if (inventoryItem.stock < recipe.stock) {
            invalid = true;
            break;
          }
        }

        if (invalid) break;
      }

      if (invalid) {
        return {
          msg: "La cantidad de al menos uno de los productos supera el stock disponible",
        };
      }

      for (const product of products) {
        await productModel.findByIdAndUpdate(product._id, {
          $inc: { stock: -product.stock },
        });

        for (const recipe of product.recipe) {
          await inventaryModel.findByIdAndUpdate(recipe._id, {
            $inc: { stock: -recipe.stock },
          });
        }
      }

      const newTicket = await ticketModel.create({
        products,
        subTotal,
        total,
        tableId,
        userId,
        waiter,
        waiterId,
        promotion,
        folio: newFolio,
        companyId,
      });

      if (!newTicket) {
        return {
          msg: "Error al crear uno de los tickets",
        };
      }

      newTicket.status = "proceso";
      await newTicket.save();

      createdTickets.push(newTicket);
    }

    return createdTickets;
  } catch (error) {
    console.log(error);
    return {
      msg: "Ocurrió un error al crear los tickets",
    };
  }
};
