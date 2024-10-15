import axios from "axios";
import { getPayPalAccessToken } from "../helpers/paypal.js";
import { getSuscriptionById, paySuscription } from "../services/pay.js";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_KEY);
export async function createProductController() {
  const accessToken = await getPayPalAccessToken();
  const productDetails = {
    name: "Bersof",
    description: "sofware restaurant",
    type: "SERVICE", // Puede ser 'SERVICE' o 'PHYSICAL'
    category: "SOFTWARE", // Categoría del producto
    // image_url: "https://example.com/product-image.png", // URL opcional de la imagen del producto
    // home_url: "https://example.com"  // URL opcional de tu sitio web
  };

  try {
    const response = await axios.post(
      `${process.env.PAYPAL_URL}/v1/catalogs/products`,
      productDetails,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Product created successfully:", response.data);
    return response.data.id; // Aquí obtienes el product_id
  } catch (error) {
    console.error("Error creating product:", error.message);
    throw error;
  }
}
export const createPlanController = async (req, res) => {
  try {
    const accessToken = await getPayPalAccessToken();
    const planDetails = {
      product_id: process.env.PAYPAL_PRODUCT_ID, // Product ID, debe ser creado en PayPal
      name: "Bersof",
      description: "software restaurant",
      billing_cycles: [
        {
          frequency: {
            interval_unit: "YEAR", // Puede ser DAY, WEEK, MONTH, YEAR
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // 0 significa sin fin
          pricing_scheme: {
            fixed_price: {
              value: "1", // Precio del plan
              currency_code: "MXN",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: "0",
          currency_code: "MXN",
        },
        setup_fee_failure_action: "CANCEL",
        payment_failure_threshold: 3,
      },
      taxes: {
        percentage: "0",
        inclusive: false,
      },
    };
    try {
      const response = await axios.post(
        `${process.env.PAYPAL_URL}/v1/billing/plans`,
        planDetails,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(
        "Error creating plan:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: error.response?.data || error.message });
    }
  } catch (error) {
    console.log("Error fetching access token:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const paySuscriptionController = async (req, res) => {
  const { type } = req.body;
  const suscription = await paySuscription(type, req.user._id);
  if (suscription?.msg) {
    return res.status(400).json(suscription);
  }
  res.json(suscription);
};

export const getSuscriptionByIdController = async (req, res) => {
  const { id } = req.params;
  const suscription = await getSuscriptionById(id);

  if (suscription?.msg) {
    return res.status(404).json(suscription);
  }
  res.json(suscription);
};

export const payConfirmation = async (req, res) => {
  try {
    const { amount, type } = req.body;
    // const suscription = await paySuscription(type, req.user._id);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "mxn",
      payment_method_types: ["card"],
    });

    // if (suscription?.msg) {
    //   return res.status(404).json(suscription);
    // }
    res.json({
      clientSecret: paymentIntent.client_secret, // Enviar el client_secret al frontend
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
