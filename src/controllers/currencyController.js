import CurrencyModel from "../model/CurrencyModel.js";
import productModel from "../model/ProductModel.js";
import cron from 'node-cron'
import moment from 'moment-timezone'
export const currencyController = async (req, res) => {
  const { fromCurrency, toCurrency } = req.body;

  if (!fromCurrency || !toCurrency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Obtener todos los productos de la base de datos
    const products = await productModel.find({
      companyId: req.user.companyId.toString(),
    });

    if (!products.length) {
      return res.status(404).json({ error: "No products found" });
    }

    const currency = await CurrencyModel.findOne();
    const rates = currency.conversionRates;

    // Verificar que los datos contengan las tasas de cambio
    if (!rates[fromCurrency] || !rates[toCurrency]) {
      throw new Error("Invalid currency provided");
    }

    // Obtener la tasa de cambio entre la moneda origen y destino
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    // Actualizar precios de productos
    const updatedProductsPromises = products.map(async (product) => {
      const oldPrice = product.price;
      // Convertir el precio usando las tasas de cambio
      const newPrice = (oldPrice / fromRate) * toRate;

      // Actualizar el producto en la base de datos
      product.price = parseFloat(newPrice.toFixed(2)); // Nuevo precio convertido y redondeado a 2 decimales
      product.currency = toCurrency;
      await product.save();
      return product; // Retornar el producto actualizado
    });

    // Esperar a que todos los productos se actualicen
    const updatedProducts = await Promise.all(updatedProductsPromises);

    // Enviar los productos actualizados en la respuesta
    res.json({
      message: "Product prices updated successfully",
      updatedProducts, // Enviar los productos actualizados en la respuesta
    });
  } catch (error) {
    console.error("Error updating product prices:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const saveCurrencyInDBController = async (req, res) => {
  const currencyDB = await CurrencyModel.findOne();
  if (currencyDB.conversionRates) {
    return res.json(currencyDB.conversionRates);
  }
  // Realizar la solicitud a la API de tasas de cambio
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/USD`
  );

  const data = await response.json();
  const rates = data.conversion_rates;
  const currency = await CurrencyModel.create({
    conversionRates: rates,
  });
  res.json(currency.conversionRates);
};

export const updateCurrencInDBController = async (req, res) => {
  try {
    let { timezone } = req.body;

    // Si no se envía el timezone, se usa el horario de México (America/Mexico_City)
    if (!timezone) {
      timezone = "America/Mexico_City";
    }

    // Programar tarea a las 5:00 AM en la zona horaria especificada
    cron.schedule("0 5 * * *", async () => {
      const currentTime = moment().tz(timezone);

      if (currentTime.hours() === 5 && currentTime.minutes() === 0) {
        console.log(
          "Actualizando tasas de cambio a las 5:00 AM en la zona horaria:",
          timezone
        );

        const currencyDB = await CurrencyModel.findOne();
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/USD`
        );

        const data = await response.json();
        const rates = data.conversion_rates;

        currencyDB.conversionRates = rates;
        await currencyDB.save();

        console.log("Tasas de cambio actualizadas:", rates);
      }
    });

    res.json({
      message: `Tarea programada para ejecutarse a las 5:00 AM en la zona horaria: ${timezone}`,
    });
  } catch (error) {
    console.error("Error al actualizar las tasas de cambio:", error);
    res.status(500).json({ error: "Error al actualizar las tasas de cambio." });
  }
  res.json(currencyDB);
};
