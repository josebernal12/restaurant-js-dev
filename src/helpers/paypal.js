import axios from "axios";

export async function getPayPalAccessToken() {

  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_API_KEY}`
    ).toString("base64");
    console.log("Auth Header:", auth);

    const response = await axios.post(
      `${process.env.PAYPAL_URL}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Response Data:", response.data);
    console.log("Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error obtaining PayPal access token:",
      error.response?.data || error.message
    );
    throw error;
  }
}
