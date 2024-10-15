import mongoose from "mongoose";
import billModel from "../model/BillModel.js";
import ticketModel from "../model/TIcketModel.js";
import tableModel from "../model/TableModel.js";
import productModel from "../model/ProductModel.js";
import moment from "moment"; // Importa la librería moment.js para manejar fechas
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";
import userModel from "../model/UserModel.js";
import { searchByDatabase, searchByDate } from "../helpers/searchByDate.js";
import momentZone from "moment-timezone";
import promotionModel from "../model/Promotion.js";
export const generateBill = async (
  ticketId,
  tableId,
  userId,
  methodOfPayment,
  companyId,
  tips,
  iva,
  type
) => {
  try {
    // Verificación de campos obligatorios
    if (!tableId || !methodOfPayment) {
      return "Error al generar factura: faltan datos por proporcionar";
    }

    const table = await tableModel.findById(tableId);
    if (!table) {
      return {
        msg: "La mesa con ese ID no existe",
      };
    }
    table.available = true;
    await table.save();

    // Obtener el último folio y calcular el nuevo folio
    const lastBill = await billModel.findOne({ companyId }).sort({ folio: -1 });
    const newFolio = lastBill && lastBill.folio ? lastBill.folio + 1 : 1;

    // Verificación de tickets coincidentes con la mesa
    const newBill = await billModel.create({
      ticketId,
      tableId,
      userId,
      methodOfPayment,
      folio: newFolio,
      companyId,
      tips,
      iva,
      type,
    });

    // Actualización del estado de la mesa
    await tableModel.findByIdAndUpdate(
      tableId,
      { available: true },
      { new: true }
    );

    // Actualización del estado de los tickets a completados
    await Promise.all(
      ticketId.map(async (id) => {
        const ticket = await ticketModel.findById(id);
        ticket.completed = true;
        await ticket.save();
      })
    );

    if (!newBill) {
      return {
        msg: "Error al generar la factura",
      };
    }
    return newBill;
  } catch (error) {
    console.log(error);
    return {
      msg: "Ocurrió un error al generar la factura",
    };
  }
};

export const getBills = async (
  page,
  type,
  name,
  showAll,
  quantity,
  firstDate,
  secondDate,
  tableId,
  companyId
) => {
  try {
    const perPage = 10;
    const pageQuery = parseInt(page) || 1;
    const skip = perPage * (pageQuery - 1);
    const currentDate = moment();

    let startDate, endDate;

    // Verifica si se debe mostrar todas las facturas
    if (showAll === "1") {
      let billsFiltered = await billModel
        .find({ companyId })
        .populate("tableId")
        .populate("userId")
        .populate({
          path: "ticketId",
          populate: {
            path: "waiterId",
            model: "User", // el nombre del modelo relacionado
          },
        })
        .sort({ createdAt: -1 });

      const totalBills = await billModel.countDocuments({ companyId });

      return {
        totalBills,
        billsFiltered,
      };
    }

    // Establece las fechas de inicio y fin según los parámetros type, firstDate y secondDate
    if (type === "week") {
      startDate = currentDate.clone().subtract(1, "week").startOf("week");
      endDate = currentDate.clone().subtract(1, "week").endOf("week");
    } else if (type === "currentWeek") {
      startDate = currentDate.clone().startOf("week");
      endDate = currentDate.clone().endOf("week").subtract(1, "day"); // Sábado de la semana actual
    } else if (firstDate && secondDate) {
      startDate = moment(firstDate).startOf("day");
      endDate = moment(secondDate).endOf("day");
    }

    let query = {};

    // Agrega las fechas a la consulta si están definidas
    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      };
    }

    // Realiza la búsqueda de facturas según la consulta definida
    let billsFiltered = await billModel
      .find({ ...query, companyId })
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User", // el nombre del modelo relacionado
        },
      })
      .populate("tableId")
      .populate("userId");

    // Filtrar por cantidad si se proporciona
    if (quantity) {
      billsFiltered = billsFiltered.slice(0, quantity);
    }

    // Filtrar por ID de mesa si se proporciona
    if (tableId) {
      billsFiltered = billsFiltered.filter(
        (bill) => bill.tableId.number === Number(tableId)
      );
    }

    // Filtrar por nombre de camarero si se proporciona
    if (name) {
      billsFiltered = billsFiltered.filter((bill) =>
        bill.ticketId.some(
          (ticket) =>
            ticket.waiterId &&
            ticket.waiterId.name.toLowerCase().includes(name.toLowerCase())
        )
      );
    }

    const totalBills = billsFiltered.length;

    // Paginar los resultados
    const paginatedBills = billsFiltered.slice(skip, skip + perPage);

    return {
      totalBills,
      billsFiltered: paginatedBills,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const bestWaiter = async (
  type,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  try {
    let startDate, endDate;

    // Determinar las fechas de inicio y fin según el tipo de consulta o si no se proporciona ningún tipo
    switch (type) {
      case "day":
        const today = momentZone().tz(timeZone);
        startDate = today.startOf("day").toDate(); // Inicio del día actual
        endDate = today.endOf("day").toDate(); // Fin del día actual
        break;
      case "week":
        const todayWeek = momentZone().tz(timeZone);
        startDate = todayWeek.startOf("isoWeek").toDate(); // Inicio de la semana actual
        endDate = todayWeek.endOf("isoWeek").toDate(); // Fin de la semana actual
        break;
      case "month":
        const currentMonth = momentZone().tz(timeZone);
        startDate = currentMonth.startOf("month").toDate(); // Primer día del mes actual
        endDate = currentMonth.endOf("month").toDate(); // Último día del mes actual
        break;
      case "quarter":
        const currentQuarter = momentZone().tz(timeZone);
        startDate = currentQuarter.startOf("quarter").toDate(); // Primer día del trimestre actual
        endDate = currentQuarter.endOf("quarter").toDate(); // Último día del trimestre actual
        break;
      case "year":
        startDate = momentZone().tz(timeZone).startOf("year").toDate(); // Primer día del año actual
        endDate = momentZone().tz(timeZone).endOf("year").toDate(); // Último día del año actual
        break;
      default:
        startDate = null;
        endDate = null;
    }

    // Construir la consulta basada en las fechas si se proporciona un tipo válido
    const query =
      startDate && endDate
        ? {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          }
        : {};
    let bills = await billModel
      .find({ ...query, companyId })
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User", // el nombre del modelo relacionado
        },
      })
      .populate("tableId")
      .populate("userId");

    // Objeto para almacenar el conteo de camareros
    const waiterCount = {};

    // Iterar sobre las facturas y contar los camareros
    bills.forEach((bill) => {
      bill.ticketId.forEach((ticket) => {
        const waiterName = ticket.waiterId?.name; // Accede al nombre del camarero

        if (waiterName) {
          // Asegúrate de que waiterName no sea undefined o null
          // Verificar si ya existe una entrada para este camarero en el objeto waiterCount
          if (waiterCount[waiterName]) {
            waiterCount[waiterName]++; // Incrementar el contador si ya existe
          } else {
            waiterCount[waiterName] = 1; // Inicializar el contador en 1 si es la primera vez que se encuentra este camarero
          }
        }
      });
    });
    const waiterArray = Object.keys(waiterCount).map((waiterName) => {
      return { name: waiterName, sell: waiterCount[waiterName] };
    });

    return waiterArray;
  } catch (error) {
    console.log(error);
    throw new Error("Ocurrió un error al obtener las facturas");
  }
};

export const getBillById = async (id) => {
  try {
    const bill = await billModel
      .findById(id)
      .populate("tableId")
      .populate({
        path: "userId",
        select: "-password", // Excluir el campo password
      })
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User",
          select: "-password", // Excluir el campo password
        },
      });

    if (!bill) {
      return {
        msg: "Esa factura con ese ID no existe",
      };
    }

    return bill;
  } catch (error) {
    console.log(error);
    return {
      msg: "Error del servidor",
    };
  }
};

export const sells = async (
  date,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  try {
    let query = {}; // Inicializamos la consulta como vacía

    if (date) {
      let startDate;
      let endDate = momentZone().tz(timeZone).toDate(); // Fin hasta la fecha actual

      switch (date) {
        case "day":
          startDate = momentZone().tz(timeZone).startOf("day").toDate(); // Inicio del día
          endDate = momentZone().tz(timeZone).endOf("day").toDate(); // Fin del día
          break;
        case "week":
          startDate = momentZone()
            .tz("America/Mazatlan")
            .subtract(7, "days")
            .startOf("day")
            .toDate(); // Últimos 7 días
          endDate = momentZone().tz(timeZone).endOf("day").toDate(); // Fin hasta la fecha actual
          break;
        case "month":
          startDate = momentZone().tz(timeZone).startOf("month").toDate(); // Primer día del mes
          endDate = momentZone().tz(timeZone).endOf("month").toDate(); // Último día del mes
          break;
        case "year":
          startDate = momentZone().tz(timeZone).startOf("year").toDate(); // Primer día del año
          endDate = momentZone().tz(timeZone).endOf("year").toDate(); // Último día del año
          break;
        default:
          throw new Error("Invalid date filter");
      }

      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    //       // Verificar si hay ventas para el día actual
    //       const bills = await billModel
    //         .find({ ...query, companyId })
    //         .populate("ticketId");
    //       if (bills.length === 0) {
    //         return 0; // No hay ventas para este día, devolver 0
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    // }
    const bills = await billModel
      .find({ ...query, companyId })
      .populate("ticketId");
    let totalSales = 0;
    console.log(bills.length);
    // Recorremos cada factura
    bills.forEach((bill) => {
      // Recorremos cada método de pago
      bill.methodOfPayment.forEach((method) => {
        console.log(method);
        totalSales += method.sell; // Sumar el valor de 'sell' de todos los métodos
      });
    });

    return { totalSales };
  } catch (error) {
    console.log(error);
    throw new Error("Error al calcular las ventas.");
  }
};
export const getBillLastWeek = async (type, page, companyId, timeZone) => {
  const perPage = 10;
  const pageQuery = parseInt(page) || 1;
  const skip = perPage * (pageQuery - 1);
  let startDate, endDate;

  // Utilizar la zona horaria proporcionada por el cliente
  const currentDate = momentZone().tz(timeZone || "America/Mexico_City");

  try {
    if (type === "week") {
      // Ajustar para que comience desde el lunes de esta semana hasta hoy
      startDate = currentDate.clone().startOf("week"); // Lunes
      endDate = currentDate.clone().endOf("day"); // Hoy
    } else if (type === "month") {
      // Ajustar para obtener el inicio y el final del mes actual
      startDate = currentDate.clone().startOf("month"); // Primer día del mes
      endDate = currentDate.clone().endOf("month"); // Último día del mes
    }

    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      };
    }

    // Realiza la búsqueda de facturas según la consulta definida
    let billsFiltered = await billModel
      .find({ ...query, companyId })
      .populate("ticketId")
      .populate("tableId")
      .populate("userId")
      .limit(perPage)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalBills = await billModel.countDocuments({ ...query, companyId });

    if (!billsFiltered) {
      return {
        billsFiltered: [],
      };
    }

    return {
      totalBills,
      billsFiltered,
    };
  } catch (error) {
    console.log(error);
  }
};

export const userSell = async (
  id,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  try {
    const { year, month, week, day } = searchByDate(timeZone);
    let { valorAño, valorMes, valorSemana, valorDia, valorTodos, name } =
      await searchByDatabase(year, month, week, day, userModel, id, companyId);

    valorAño = valorAño.filter((bill) =>
      bill.ticketId.some(
        (ticket) => ticket.waiterId && ticket.waiterId._id.toString() === id
      )
    );
    valorMes = valorMes.filter((bill) =>
      bill.ticketId.some(
        (ticket) => ticket.waiterId && ticket.waiterId._id.toString() === id
      )
    );
    valorSemana = valorSemana.filter((bill) =>
      bill.ticketId.some(
        (ticket) => ticket.waiterId && ticket.waiterId._id.toString() === id
      )
    );
    valorDia = valorDia.filter((bill) =>
      bill.ticketId.some(
        (ticket) => ticket.waiterId && ticket.waiterId._id.toString() === id
      )
    );
    valorTodos = valorTodos.filter((bill) =>
      bill.ticketId.some(
        (ticket) => ticket.waiterId && ticket.waiterId._id.toString() === id
      )
    );
    return {
      valorAño: valorAño.length,
      valorMes: valorMes.length,
      valorSemana: valorSemana.length,
      valorDia: valorDia.length,
      valorTodos: valorTodos.length,
      name: name.name,
    };
  } catch (error) {
    console.log(error);
  }
};
export const productSell = async (
  id,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  try {
    const { year, month, week, day } = searchByDate(timeZone);
    const { valorAño, valorMes, valorSemana, valorDia, valorTodos, name } =
      await searchByDatabase(
        year,
        month,
        week,
        day,
        productModel,
        id,
        companyId
      );
    let totalAño = 0;
    let totalMes = 0;
    let totalSemana = 0;
    let totalDia = 0;
    let totalStock = 0;
    const valorAñoSinDuplicados = [...new Set(valorAño)];
    // Calcular ventas del año
    for (const bill of valorAño) {
      for (const ticket of bill.ticketId) {
        for (const product of ticket.products) {
          // Primero, verificamos si el producto está en la promoción
          const promotion = await promotionModel.findById(product._id);
          if (promotion && promotion.productsId.includes(id)) {
            const type = promotion.type;
            const value = parseInt(type.split("x")[0]); // Tomamos el valor de la promoción
            totalAño += value * product.stock; // Multiplicar por el stock del producto
          }
          // Ahora, verificamos si el ID del producto coincide
          if (product._id.toString() === id.toString()) {
            totalAño += product.stock;
          }
        }
      }
    }

    for (const bill of valorMes) {
      for (const ticket of bill.ticketId) {
        for (const product of ticket.products) {
          // Primero, verificamos si el producto está en la promoción
          const promotion = await promotionModel.findById(product._id);
          if (promotion && promotion.productsId.includes(id)) {
            const type = promotion.type;
            const value = parseInt(type.split("x")[0]); // Tomamos el valor de la promoción
            totalMes += value * product.stock; // Multiplicar por el stock del producto
          }
          // Ahora, verificamos si el ID del producto coincide
          if (product._id.toString() === id.toString()) {
            totalMes += product.stock;
          }
        }
      }
    }
    for (const bill of valorSemana) {
      for (const ticket of bill.ticketId) {
        for (const product of ticket.products) {
          // Primero, verificamos si el producto está en la promoción
          const promotion = await promotionModel.findById(product._id);
          if (promotion && promotion.productsId.includes(id)) {
            const type = promotion.type;
            const value = parseInt(type.split("x")[0]); // Tomamos el valor de la promoción
            totalSemana += value * product.stock; // Multiplicar por el stock del producto
          }
          // Ahora, verificamos si el ID del producto coincide
          if (product._id.toString() === id.toString()) {
            totalSemana += product.stock;
          }
        }
      }
    }

    // Calcular ventas del día
    for (const bill of valorDia) {
      for (const ticket of bill.ticketId) {
        for (const product of ticket.products) {
          console.log(product);
          // Primero, verificamos si el producto está en la promoción
          const promotion = await promotionModel.findById(product._id);
          if (promotion && promotion.productsId.includes(id)) {
            const type = promotion.type;
            const value = parseInt(type.split("x")[0]); // Tomamos el valor de la promoción
            totalDia += value * product.stock; // Multiplicar por el stock del producto
          }
          // Ahora, verificamos si el ID del producto coincide
          if (product._id.toString() === id.toString()) {
            totalDia += product.stock;
          }
        }
      }
    }

    // Calcular ventas totales
    for (const bill of valorTodos) {
      for (const ticket of bill.ticketId) {
        for (const product of ticket.products) {
          // Primero, verificamos si el producto está en la promoción
          const promotion = await promotionModel.findById(product._id);
          if (promotion && promotion.productsId.includes(id)) {
            const type = promotion.type;
            const value = parseInt(type.split("x")[0]); // Tomamos el valor de la promoción
            totalStock += value * product.stock; // Multiplicar por el stock del producto
          }
          // Ahora, verificamos si el ID del producto coincide
          if (product._id.toString() === id.toString()) {
            totalStock += product.stock;
          }
        }
      }
    }

    // Retornamos los valores calculados
    return {
      valorAño: totalAño,
      valorMes: totalMes,
      valorSemana: totalSemana,
      valorDia: totalDia,
      valorTodos: totalStock,
      name: name.name, // Nombre del producto
    };
  } catch (error) {
    console.error(error);
  }
};

export const generateMultipleBills = async (
  tickets,
  tableId,
  userId,
  methodOfPayment,
  companyId
) => {
  try {
    // Verificación de campos obligatorios
    if (
      !tableId ||
      !methodOfPayment ||
      !tickets ||
      !Array.isArray(tickets) ||
      tickets.length === 0
    ) {
      return "Error al generar facturas: faltan datos por proporcionar o el array de tickets está vacío";
    }

    const tableObjectId = mongoose.Types.ObjectId(tableId);
    const table = await tableModel.findById(tableObjectId);
    if (!table) {
      return {
        msg: "La mesa con ese ID no existe",
      };
    }

    const createdBills = [];
    for (const ticketId of tickets) {
      const ticket = await ticketModel.findById(ticketId);
      if (!ticket) {
        return {
          msg: `El ticket con el ID ${ticketId} no existe`,
        };
      }
      const lastBill = await billModel
        .findOne({ companyId })
        .sort({ folio: -1 });
      const newFolio = lastBill && lastBill.folio ? lastBill.folio + 1 : 1;
      const newBill = await billModel.create({
        ticketId,
        tableId,
        userId,
        methodOfPayment,
        folio: newFolio,
        companyId,
      });
      // const allTickets = await ticketModel.find({ tableId });

      // Obtener el último folio y calcular el nuevo folio

      // Verificación de tickets coincidentes con la mesa
      // if (allTickets.some(ticket => ticket.tableId.toString() === tableId)) {
      //   const newBill = await billModel.create({
      //     ticketId: allTickets.map(ticket => ticket._id),
      //     tableId,
      //     userId,
      //     methodOfPayment,
      //     folio: newFolio
      //   });

      // Actualización del estado de la mesa
      await tableModel.findByIdAndUpdate(
        tableId,
        { available: true },
        { new: true }
      );
      await ticketModel.findByIdAndUpdate(
        ticket._id,
        { completed: true },
        { new: true }
      );

      // Actualización del estado de los tickets a completados
      // await Promise.all(allTickets.map(async (ticket) => {
      // }));

      if (!newBill) {
        return {
          msg: `Error al generar la factura para el ticket con el ID ${ticketId}`,
        };
      }
      createdBills.push(newBill);
    }

    return createdBills;
  } catch (error) {
    console.log(error);
    return {
      msg: "Ocurrió un error al generar las facturas",
    };
  }
};
//pending
export const payManyTickets = async (tableIds) => {
  try {
  } catch (error) {
    console.log(error);
  }
};
