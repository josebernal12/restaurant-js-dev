import { startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";
import momentZone from "moment-timezone";
import billModel from "../model/BillModel.js";

export const searchByDate = (timeZone) => {
  // Filtrar por año
  const year = {
    createdAt: {
      $gte: momentZone().tz(timeZone).startOf("year").toDate(), // Primer día del año
      $lt: momentZone().tz(timeZone).endOf("year").toDate(), // Último día del año
    },
  };

  // Filtrar por mes
  const month = {
    createdAt: {
      $gte: momentZone().tz(timeZone).startOf("month").toDate(), // Primer día del mes
      $lt: momentZone().tz(timeZone).endOf("month").toDate(), // Último día del mes
    },
  };

  // Filtrar por los últimos 7 días
  const startOfWeekDate = momentZone()
    .tz(timeZone)
    .subtract(7, "days")
    .startOf("day")
    .toDate(); // Hace 7 días desde el inicio del día
  const endOfWeekDate = momentZone().tz(timeZone).endOf("day").toDate(); // Hasta el final del día actual

  const week = {
    createdAt: {
      $gte: startOfWeekDate, // Fecha de hace 7 días
      $lt: endOfWeekDate, // Fecha actual
    },
  };

  // Filtrar por día
  const startOfDayDate = momentZone().tz(timeZone).startOf("day").toDate(); // Inicio del día
  const endOfDayDate = momentZone().tz(timeZone).endOf("day").toDate(); // Fin del día

  const day = {
    createdAt: {
      $gte: startOfDayDate,
      $lt: endOfDayDate,
    },
  };

  return {
    year,
    month,
    week,
    day,
  };
};

export const searchByDatabase = async (
  year,
  month,
  week,
  day,
  database,
  id,
  companyId
) => {
  const billQueries = [
    billModel
      .find({ ...year, companyId })
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User", // Asegúrate de que 'User' es el modelo correcto
        },
      })
      .populate("tableId")
      .populate("userId"),

    billModel
      .find({ ...month, companyId })
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User", // Asegúrate de que 'User' es el modelo correcto
        },
      })
      .populate("tableId")
      .populate("userId"),

    billModel
      .find({ ...week, companyId })
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User", // Asegúrate de que 'User' es el modelo correcto
        },
      })
      .populate("tableId")
      .populate("userId"),

    billModel
      .find({ ...day, companyId })
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User", // Asegúrate de que 'User' es el modelo correcto
        },
      })
      .populate("tableId")
      .populate("userId"),

    billModel
      .find({ companyId })
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User", // Asegúrate de que 'User' es el modelo correcto
        },
      })
      .populate("tableId")
      .populate("userId"),
  ];

  if (database) {
    billQueries.push(database.findById(id));
  }

  const results = await Promise.all(billQueries);
  // console.log(results[0])
  return {
    valorAño: results[0],
    valorMes: results[1],
    valorSemana: results[2],
    valorDia: results[3],
    valorTodos: results[4],
    name: database ? results[5] : null,
  };
};
