import { searchByDatabase, searchByDate } from "../helpers/searchByDate.js";
import billModel from "../model/BillModel.js";
import categoryModel from "../model/CategoryModel.js";
import inventaryModel from "../model/Inventary.js";
import productModel from "../model/ProductModel.js";
import userModel from "../model/UserModel.js";
import { subDays, subWeeks, subMonths, subYears } from "date-fns";
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";
import momentZone from "moment-timezone";
import moment from "moment";
import promotionModel from "../model/Promotion.js";
export const userSellByTable = async (id, name, date, companyId) => {
  try {
    let query = {}; // Inicializamos la consulta como vacía

    if (date) {
      // Si se proporciona un tipo de consulta, construimos la consulta según el tipo
      switch (date) {
        case "month":
          query = {
            // Filtrar por mes
            createdAt: {
              $gte: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ),
              $lt: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                1
              ),
            },
          };
          break;
        case "year":
          query = {
            // Filtrar por año
            createdAt: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
              $lt: new Date(new Date().getFullYear() + 1, 0, 1),
            },
          };
          break;
        case "week":
          // Filtrar por semana
          const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Empieza la semana el lunes
          const endOfWeekDate = endOfWeek(new Date(), { weekStartsOn: 1 }); // Termina la semana el domingo

          query = {
            createdAt: {
              $gte: startOfWeekDate,
              $lt: endOfWeekDate,
            },
          };
          break;
        case "day":
          // Filtrar por día (hoy)
          const timeZone = "America/Mazatlan";
          const startOfDayDate = momentZone
            .tz(timeZone)
            .startOf("day")
            .toDate();
          const endOfDayDate = momentZone.tz(timeZone).endOf("day").toDate();

          query = {
            createdAt: {
              $gte: startOfDayDate,
              $lt: endOfDayDate,
            },
          };

          // Verificar si hay ventas para el día actual
          const bills = await billModel
            .find({ ...query, companyId })
            .populate("ticketId");
          if (bills.length === 0) {
            return 0; // No hay ventas para este día, devolver 0
          }
          break;
        default:
          break;
      }
    }
    const [bills, user] = await Promise.all([
      billModel
        .find({ ...query, companyId })
        .populate({
          path: "ticketId",
          populate: [
            { path: "waiterId", model: "User" },
            { path: "tableId", model: "table" }, // Asegúrate de que 'Table' es el modelo correcto
          ],
        })
        .populate("tableId")
        .populate("userId"),
      userModel.findById(id),
    ]);

    const userTables = bills
      .filter((bill) => {
        return bill.ticketId.some(
          (value) => value.waiterId._id.toString() === id
        );
      })
      .map((bill) => bill.tableId);

    return {
      name: user.name,
      tables: userTables.length,
    };
  } catch (error) {
    console.log(error);
  }
};

export const hourProduct = async (id, companyId) => {
  try {
    const [bills, product] = await Promise.all([
      billModel.find({ companyId }).populate("ticketId"),
      productModel.findById(id),
    ]);

    if (!bills || bills.length === 0) {
      return {
        product: [],
        message: "No se encontraron facturas.",
      };
    }

    const now = new Date();

    const filterBillsByTime = (bills, timePeriod) => {
      return bills.filter((bill) => bill.createdAt >= timePeriod);
    };

    const getHoursFromBills = (filteredBills) => {
      return filteredBills.flatMap((bill) =>
        bill.ticketId.flatMap((ticket) =>
          ticket.products
            .filter((product) => product._id.toString() === id)
            .map(() => bill.createdAt.getHours())
        )
      );
    };

    const calculateSalesByHour = (hours) => {
      return hours.reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});
    };

    const getPeakHour = (salesByHour) => {
      return Object.keys(salesByHour).reduce(
        (a, b) => (salesByHour[a] > salesByHour[b] ? a : b),
        0
      );
    };

    const timeFrames = {
      lastDay: subDays(now, 1),
      lastWeek: subWeeks(now, 1),
      lastMonth: subMonths(now, 1),
      lastYear: subYears(now, 1),
    };

    const result = {};

    for (const [key, timePeriod] of Object.entries(timeFrames)) {
      const filteredBills = filterBillsByTime(bills, timePeriod);
      const hours = getHoursFromBills(filteredBills);
      if (hours.length === 0) {
        result[key] = {
          peakHour: null,
          salesByHour: {},
        };
      } else {
        const salesByHour = calculateSalesByHour(hours);
        const peakHour = getPeakHour(salesByHour);
        result[key] = {
          peakHour: parseInt(peakHour),
          salesByHour,
        };
      }
    }

    return {
      product: product.name,
      timeFrames: result,
    };
  } catch (error) {
    console.error(error);
    return {
      product: [],
      message: "Ocurrió un error al procesar las facturas.",
    };
  }
};

export const inventorySell = async (
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
        inventaryModel,
        id,
        companyId
      );

    let totalAño = 0;
    let totalMes = 0;
    let totalSemana = 0;
    let totalDia = 0;
    let totalStock = 0;
    valorAño.forEach((bill) =>
      bill.ticketId.some((ticket) => {
        ticket.products.some((value) => {
          value.recipe.some((recipe) => {
            if (recipe.id === id) {
              totalAño += recipe.stock;
            }
          });
        });
      })
    );
    valorMes.forEach((bill) =>
      bill.ticketId.some((ticket) => {
        ticket.products.some((value) => {
          value.recipe.some((recipe) => {
            if (recipe.id === id) {
              totalMes += recipe.stock;
            }
          });
        });
      })
    );
    valorSemana.forEach((bill) =>
      bill.ticketId.some((ticket) => {
        ticket.products.some((value) => {
          value.recipe.some((recipe) => {
            if (recipe.id === id) {
              totalSemana += recipe.stock;
            }
          });
        });
      })
    );
    valorDia.forEach((bill) =>
      bill.ticketId.some((ticket) => {
        ticket.products.some((value) => {
          value.recipe.some((recipe) => {
            if (recipe.id === id) {
              totalDia += recipe.stock;
            }
          });
        });
      })
    );
    valorTodos.forEach((bill) =>
      bill.ticketId.some((ticket) => {
        ticket.products.some((value) => {
          value.recipe.some((recipe) => {
            if (recipe.id === id) {
              totalStock += recipe.stock;
            }
          });
        });
      })
    );

    return {
      valorAño: totalAño,
      valorMes: totalMes,
      valorSemana: totalSemana,
      valorDia: totalDia,
      valorTodos: totalStock,
      name: name.name,
    };
  } catch (error) {
    console.log(error);
  }
};

export const billSell = async (companyId, timeZone = "America/Mexico_City") => {
  try {
    const { year, month, week, day } = searchByDate(timeZone);
    const { valorAño, valorMes, valorSemana, valorDia, valorTodos } =
      await searchByDatabase(year, month, week, day, null, null, companyId);
    let totalAño = valorAño.length;
    let totalMes = valorMes.length;
    let totalSemana = valorSemana.length;
    let totalDia = valorDia.length;
    let totalStock = valorTodos.length;
    return {
      totalAño,
      totalMes,
      totalSemana,
      totalDia,
      totalStock,
    };
  } catch (error) {
    console.log(error);
  }
};

export const productSellAll = async (
  companyId,
  timeZone = "America/Mexico_City"
) => {
  try {
    const { year, month, week, day } = searchByDate(timeZone);
    let totalAño = 0;
    let totalMes = 0;
    let totalSemana = 0;
    let totalDia = 0;
    let totalStock = 0;

    // Ejecutamos las consultas en paralelo
    const [valorAño, valorMes, valorSemana, valorDia, valorTodos, products] =
      await Promise.all([
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
              model: "User",
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
              model: "User",
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
              model: "User",
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
              model: "User",
            },
          })
          .populate("tableId")
          .populate("userId"),
        productModel.find({ companyId }),
      ]);

    // Calcular ventas y stock del año
    for (const bill of valorAño) {
      for (const ticket of bill.ticketId) {
        // Verificamos si tiene promociones
        if (ticket.promotion.length >= 1) {
          for (const id of ticket.promotion) {
            const promotion = await promotionModel.findById(id);
            const type = promotion.type;
            const value = parseInt(type.split("x")[0]); // Convertimos "3" a número
            totalAño += value; // Sumar el valor de la promoción a totalAño
          }
        }

        // Sumamos los valores de stock
        for (const product of ticket.products) {
          totalAño += product.stock;
        }
      }
    }

    // Calcular ventas y stock del mes
    for (const bill of valorMes) {
      for (const ticket of bill.ticketId) {
        // Verificamos si tiene promociones
        if (ticket.promotion.length >= 1) {
          for (const id of ticket.promotion) {
            const promotion = await promotionModel.findById(id);
            const type = promotion.type;
            const value = parseInt(type.split("x")[0]);
            totalMes += value; // Sumar el valor de la promoción a totalMes
          }
        }

        // Sumamos los valores de stock
        for (const product of ticket.products) {
          totalMes += product.stock;
        }
      }
    }

    // Calcular ventas y stock de la semana
    for (const bill of valorSemana) {
      for (const ticket of bill.ticketId) {
        // Verificamos si tiene promociones
        if (ticket.promotion.length >= 1) {
          for (const id of ticket.promotion) {
            const promotion = await promotionModel.findById(id);
            const type = promotion.type;
            const value = parseInt(type.split("x")[0]);
            totalSemana += value; // Sumar el valor de la promoción a totalSemana
          }
        }

        // Sumamos los valores de stock
        for (const product of ticket.products) {
          totalSemana += product.stock;
        }
      }
    }

    // Calcular ventas y stock del día
    for (const bill of valorDia) {
      for (const ticket of bill.ticketId) {
        // Verificamos si tiene promociones
        if (ticket.promotion.length >= 1) {
          for (const id of ticket.promotion) {
            const promotion = await promotionModel.findById(id);
            const type = promotion.type;
            const value = parseInt(type.split("x")[0]);
            totalDia += value; // Sumar el valor de la promoción a totalDia
          }
        }

        // Sumamos los valores de stock
        for (const product of ticket.products) {
          totalDia += product.stock;
        }
      }
    }

    // Calcular total de stock general (para todas las ventas)
    for (const bill of valorTodos) {
      for (const ticket of bill.ticketId) {
        // Verificamos si tiene promociones
        if (ticket.promotion.length >= 1) {
          for (const id of ticket.promotion) {
            const promotion = await promotionModel.findById(id);
            const type = promotion.type;
            const value = parseInt(type.split("x")[0]);
            totalStock += value; // Sumar el valor de la promoción a totalStock
          }
        }

        // Sumamos los valores de stock
        for (const product of ticket.products) {
          totalStock += product.stock;
        }
      }
    }

    // Retornamos los valores calculados
    return {
      totalAño,
      totalMes,
      totalSemana,
      totalDia,
      totalStock,
    };
  } catch (error) {
    console.log(error);
  }
};

export const billSellByQuery = async (
  date,
  companyId,
  timeZone = "America/Mexico_City"
) => {
  try {
    let query = {}; // Inicializamos la consulta como vacía

    if (date) {
      // Si se proporciona un tipo de consulta, construimos la consulta según el tipo
      switch (date) {
        case "month":
          query = {
            // Filtrar por mes
            createdAt: {
              $gte: momentZone().tz(timeZone).startOf("month").toDate(),
              $lt: momentZone().tz(timeZone).endOf("month").toDate(),
            },
          };
          break;
        case "year":
          query = {
            // Filtrar por año
            createdAt: {
              $gte: momentZone().tz(timeZone).startOf("year").toDate(),
              $lt: momentZone().tz(timeZone).endOf("year").toDate(),
            },
          };
          break;
        case "week":
          // Filtrar por los últimos 7 días
          const startOfWeekDate = momentZone()
            .tz(timeZone)
            .subtract(7, "days")
            .startOf("day")
            .toDate(); // Hace 7 días desde el inicio del día
          const endOfWeekDate = momentZone().tz(timeZone).endOf("day").toDate(); // Hasta el final del día actual

          query = {
            createdAt: {
              $gte: startOfWeekDate, // Fecha de hace 7 días
              $lt: endOfWeekDate, // Fecha actual
            },
          };
          break;

        case "day":
          // Filtrar por día (hoy)
          const startOfDayDate = momentZone()
            .tz(timeZone)
            .startOf("day")
            .toDate();
          const endOfDayDate = momentZone().tz(timeZone).endOf("day").toDate();
          query = {
            createdAt: {
              $gte: startOfDayDate,
              $lt: endOfDayDate,
            },
          };

          // Verificar si hay ventas para el día actual
          const bills = await billModel
            .find({ ...query, companyId })
            .populate("ticketId");
          if (bills.length === 0) {
            return { bills: 0 }; // No hay ventas para este día, devolver 0
          }
          break;
        default:
          break;
      }
    }

    const bills = await billModel
      .find({ ...query, companyId })
      .populate({
        path: "ticketId",
        populate: {
          path: "waiterId",
          model: "User", // Asegúrate de que 'User' es el modelo correcto
        },
      })
      .populate("tableId")
      .populate("userId");

    return {
      bills: bills.length,
    };
  } catch (error) {
    console.log(error);
  }
};

export const sellsCategory = async (
  dateFilter,
  companyId,
  timeZone = "America/Mexico_City"
) => {
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

    const bills = await billModel.find(query).populate("ticketId");

    // Inicializar todas las categorías con 0
    const categories = await categoryModel.find({ companyId });
    const categoryCount = {};

    categories.forEach((category) => {
      categoryCount[category.name] = 0;
    });
    // Contar las ventas por categoría
    for (const bill of bills) {
      for (const ticket of bill.ticketId) {
        for (const product of ticket.products) {
          let productStock = product.stock;

          // Verificar si el producto tiene promociones aplicadas
          if (ticket.promotion.length >= 1 && product.idProduct) {
            for (const promotionId of ticket.promotion) {
              const promotion = await promotionModel.findById(promotionId);

              if (
                promotion &&
                promotion.productsId.includes(product.idProduct)
              ) {
                const type = promotion.type;
                const value = parseInt(type.split("x")[0]); // Ejemplo: 2x1, toma el 2
                productStock += productStock * (value - 1); // Ajusta el stock según promoción
              }
            }
          }

          // Obtener la categoría del producto y contar
          const category = await categoryModel.findById(product.category);
          if (category) {
            categoryCount[category.name] += productStock; // Contar según el stock ajustado
          }
        }
      }
    }

    return categoryCount;
  } catch (error) {
    console.log(error);
    throw new Error("Ocurrió un error al obtener las ventas por categoría.");
  }
};
