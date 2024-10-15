import billModel from "../model/BillModel.js";
import methodOfPaymentModel from "../model/methodOfPayment.js";
import moment from "moment";
import momentZone from "moment-timezone";
export const updateMethodOfPayment = async (
  id,
  cash,
  transfer,
  creditCard,
  creditDebit
) => {
  try {
    const methodOfPayment = await methodOfPaymentModel.findOne({
      companyId: id,
    });
    methodOfPayment.cash = cash;
    methodOfPayment.transfer = transfer;
    methodOfPayment.creditCard = creditCard;
    methodOfPayment.creditDebit = creditDebit;
    await methodOfPayment.save();
    if (!methodOfPayment) {
      return {
        msg: "error updating method of payment",
      };
    }
    return methodOfPayment;
  } catch (error) {
    console.log(error);
  }
};

export const findMethodOfPaymentByCompany = async (companyId) => {
  try {
    const methodOfPayment = await methodOfPaymentModel.findOne({ companyId });
    if (!methodOfPayment) {
      return {
        msg: "error updating method of payment",
      };
    }
    return methodOfPayment;
  } catch (error) {
    console.log(error);
  }
};
export const totalSellCash = async (
  dateFilter,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  let cash = 0;

  try {
    const query = { companyId };

    if (dateFilter) {
      let startDate;
      let endDate = momentZone().tz(timeZone).toDate(); // Fin hasta la fecha actual

      switch (dateFilter) {
        case "day":
          startDate = momentZone().tz(timeZone).startOf("day").toDate(); // Inicio del día
          endDate = momentZone().tz(timeZone).endOf("day").toDate(); // Fin del día
          break;
        case "week":
          startDate = momentZone()
            .tz(timeZone)
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

    const bills = await billModel
      .find(query)
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User",
        },
      })
      .populate("tableId")
      .populate("userId");
    console.log(bills.length);
    bills.forEach((bill) => {
      bill.methodOfPayment.forEach((method) => {
        if (method?.name === "cash") {
          console.log(method);
          cash += method.sell;
        }
      });
    });

    return cash;
  } catch (error) {
    console.log(error);
  }
};

export const totalSellTransfer = async (
  dateFilter,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  let transfer = 0;

  try {
    const query = { companyId };

    if (dateFilter) {
      let startDate;
      let endDate = momentZone().tz(timeZone).toDate(); // Fin hasta la fecha actual

      switch (dateFilter) {
        case "day":
          startDate = momentZone().tz(timeZone).startOf("day").toDate(); // Inicio del día
          endDate = momentZone().tz(timeZone).endOf("day").toDate(); // Fin del día
          break;
        case "week":
          startDate = momentZone()
            .tz(timeZone)
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

    const bills = await billModel
      .find(query)
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User",
        },
      })
      .populate("tableId")
      .populate("userId");

    bills.forEach((bill) => {
      bill.methodOfPayment.forEach((method) => {
        if (method?.name === "transfer") {
          transfer += method.sell;
        }
      });
    });

    return transfer;
  } catch (error) {
    console.log(error);
  }
};

export const totalSellCreditCard = async (
  dateFilter,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  let creditCard = 0;

  try {
    const query = { companyId };

    if (dateFilter) {
      let startDate;
      let endDate = momentZone().tz(timeZone).toDate(); // Fin hasta la fecha actual

      switch (dateFilter) {
        case "day":
          startDate = momentZone().tz(timeZone).startOf("day").toDate(); // Inicio del día
          endDate = momentZone().tz(timeZone).endOf("day").toDate(); // Fin del día
          break;
        case "week":
          startDate = momentZone()
            .tz(timeZone)
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

    const bills = await billModel
      .find(query)
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User",
        },
      })
      .populate("tableId")
      .populate("userId");

    bills.forEach((bill) => {
      bill.methodOfPayment.forEach((method) => {
        if (method.name === "creditCard") {
          creditCard += method.sell;
        }
      });
    });

    return creditCard;
  } catch (error) {
    console.log(error);
  }
};

export const totalSellCreditDebit = async (
  dateFilter,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  let creditDebit = 0;

  try {
    const query = { companyId };

    if (dateFilter) {
      let startDate;
      let endDate = momentZone().tz(timeZone).toDate(); // Fin hasta la fecha actual

      switch (dateFilter) {
        case "day":
          startDate = momentZone().tz(timeZone).startOf("day").toDate(); // Inicio del día
          endDate = momentZone().tz(timeZone).endOf("day").toDate(); // Fin del día
          break;
        case "week":
          startDate = momentZone()
            .tz(timeZone)
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

    const bills = await billModel
      .find(query)
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User",
        },
      })
      .populate("tableId")
      .populate("userId");

    bills.forEach((bill) => {
      bill.methodOfPayment.forEach((method) => {
        if (method.name === "creditDebit") {
          creditDebit += method.sell;
        }
      });
    });

    return creditDebit;
  } catch (error) {
    console.log(error);
  }
};

export const quantitySellMethodOfPayment = async (
  dateFilter,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  let cash = 0;
  let transfer = 0;
  let creditCard = 0;
  let creditDebit = 0;

  try {
    const query = { companyId };

    if (dateFilter) {
      let startDate;
      let endDate = momentZone().tz(timeZone).toDate(); // Fin hasta la fecha actual

      switch (dateFilter) {
        case "day":
          startDate = momentZone().tz(timeZone).startOf("day").toDate(); // Inicio del día
          endDate = momentZone().tz(timeZone).endOf("day").toDate(); // Fin del día
          break;
        case "week":
          startDate = momentZone()
            .tz(timeZone)
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

    const bills = await billModel
      .find(query)
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User", // Asegúrate de que 'User' es el modelo correcto
        },
      })
      .populate("tableId")
      .populate("userId");

    // Contar las transacciones por cada método de pago
    bills.forEach((bill) => {
      bill.methodOfPayment.forEach((method) => {
        switch (method.name) {
          case "cash":
            cash++;
            break;
          case "transfer":
            transfer++;
            break;
          case "creditCard":
            creditCard++;
            break;
          case "creditDebit":
            creditDebit++;
            break;
        }
      });
    });

    const total = cash + transfer + creditCard + creditDebit;

    return { cash, transfer, creditCard, creditDebit, total };
  } catch (error) {
    console.log(error);
    throw new Error("Ocurrió un error al procesar las facturas");
  }
};
