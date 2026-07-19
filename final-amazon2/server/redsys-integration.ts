import axios, { AxiosInstance } from "axios";

interface RedsysConfig {
  clientId: string;
  clientSecret: string;
  apiUrl: string;
  environment: "sandbox" | "production";
}

interface PaymentRequest {
  amount: string | number;
  currency: string;
  description: string;
  userId: string | number;
  orderId: string;
}

interface PaymentResponse {
  transactionId: string;
  status: string;
  redirectUrl?: string;
  error?: string;
}

export class RedsysIntegration {
  private client: AxiosInstance;
  private config: RedsysConfig;

  constructor(config: RedsysConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        "X-IBM-Client-Id": config.clientId,
        "X-IBM-Client-Secret": config.clientSecret,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Crear una solicitud de pago SEPA
   */
  async createPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      const payload = {
        instructedAmount: {
          currency: payment.currency || "MXN",
          amount: (typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount).toString(),
        },
        debtorAccount: {
          iban: "", // Se proporciona en el flujo de autenticación
        },
        creditorAccount: {
          iban: process.env.REDSYS_MERCHANT_IBAN || "",
        },
        creditorName: "Casino Royale",
        remittanceInformationUnstructured: payment.description,
        endToEndIdentification: payment.orderId,
      };

      const response = await this.client.post("/v1.1/payments/sepa-credit-transfers", payload);

      return {
        transactionId: response.data.transactionStatus?.transactionId || response.data.paymentId,
        status: response.data.transactionStatus?.status || "PENDING",
        redirectUrl: response.data._links?.scaRedirect?.href,
      };
    } catch (error: any) {
      console.error("Redsys Payment Error:", error.response?.data || error.message);
      return {
        transactionId: "",
        status: "ERROR",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Obtener estado de un pago
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await this.client.get(`/v1.1/payments/sepa-credit-transfers/${transactionId}`);

      return {
        transactionId: response.data.paymentId,
        status: response.data.transactionStatus?.status || "UNKNOWN",
      };
    } catch (error: any) {
      console.error("Redsys Status Error:", error.response?.data || error.message);
      return {
        transactionId,
        status: "ERROR",
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Obtener métodos de autenticación disponibles
   */
  async getAuthenticationMethods(transactionId: string): Promise<any[]> {
    try {
      const response = await this.client.get(
        `/v1.1/payments/sepa-credit-transfers/${transactionId}/authorisations`
      );

      return response.data.scaMethods || [];
    } catch (error: any) {
      console.error("Redsys Auth Methods Error:", error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Iniciar autorización de pago
   */
  async startAuthorization(transactionId: string, authenticationMethodId?: string): Promise<any> {
    try {
      const payload: any = {
        scaAuthenticationData: authenticationMethodId,
      };

      const response = await this.client.post(
        `/v1.1/payments/sepa-credit-transfers/${transactionId}/authorisations`,
        payload
      );

      return {
        authorizationId: response.data.authorisationId,
        scaStatus: response.data.scaStatus,
        redirectUrl: response.data._links?.scaRedirect?.href,
      };
    } catch (error: any) {
      console.error("Redsys Authorization Error:", error.response?.data || error.message);
      return {
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Obtener estado de autorización
   */
  async getAuthorizationStatus(transactionId: string, authorizationId: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/v1.1/payments/sepa-credit-transfers/${transactionId}/authorisations/${authorizationId}`
      );

      return {
        scaStatus: response.data.scaStatus,
        psuMessage: response.data.psuMessage,
      };
    } catch (error: any) {
      console.error("Redsys Authorization Status Error:", error.response?.data || error.message);
      return {
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Obtener información de servicios de pago disponibles
   */
  async getPaymentServices(): Promise<any> {
    try {
      const response = await this.client.get("/v1.1/payment-services");
      return response.data;
    } catch (error: any) {
      console.error("Redsys Payment Services Error:", error.response?.data || error.message);
      return null;
    }
  }
}

// Crear instancia singleton
export const createRedsysClient = (): RedsysIntegration => {
  const config: RedsysConfig = {
    clientId: process.env.REDSYS_CLIENT_ID || "",
    clientSecret: process.env.REDSYS_CLIENT_SECRET || "",
    apiUrl: process.env.REDSYS_API_URL || "https://market.apis-i.redsys.es/psd2/xs2a/node/4585",
    environment: (process.env.REDSYS_ENV as "sandbox" | "production") || "sandbox",
  };

  return new RedsysIntegration(config);
};
