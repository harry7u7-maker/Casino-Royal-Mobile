import axios from "axios";

const PAYPAL_API_BASE = "https://api-m.paypal.com";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || "";
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || "";

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
}

interface PayPalOrder {
  id: string;
  status: string;
  payer: {
    email_address: string;
  };
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
  }>;
}

interface CreateOrderRequest {
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

let cachedAccessToken: string | null = null;
let tokenExpiryTime: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedAccessToken && tokenExpiryTime > now) {
    return cachedAccessToken;
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

  try {
    const response = await axios.post<PayPalAccessTokenResponse>(
      `${PAYPAL_API_BASE}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    cachedAccessToken = response.data.access_token;
    tokenExpiryTime = now + response.data.expires_in * 1000 - 60000; // Refresh 1 minute before expiry

    return cachedAccessToken;
  } catch (error) {
    console.error("Error getting PayPal access token:", error);
    throw new Error("Failed to authenticate with PayPal");
  }
}

export async function createPayPalOrder(request: CreateOrderRequest): Promise<PayPalOrder> {
  const accessToken = await getAccessToken();

  try {
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: request.currency,
              value: request.amount.toFixed(2),
            },
            description: request.description,
          },
        ],
        application_context: {
          return_url: request.returnUrl,
          cancel_url: request.cancelUrl,
          user_action: "PAY_NOW",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data as PayPalOrder;
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    throw new Error("Failed to create PayPal order");
  }
}

export async function capturePayPalOrder(orderId: string): Promise<PayPalOrder> {
  const accessToken = await getAccessToken();

  try {
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data as PayPalOrder;
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    throw new Error("Failed to capture PayPal order");
  }
}

export async function getPayPalOrder(orderId: string): Promise<PayPalOrder> {
  const accessToken = await getAccessToken();

  try {
    const response = await axios.get(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data as PayPalOrder;
  } catch (error) {
    console.error("Error getting PayPal order:", error);
    throw new Error("Failed to get PayPal order");
  }
}
