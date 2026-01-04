const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Transfer API
export const transferApi = {
  create: (data: {
    to_address: string;
    amount: string;
    currency: string;
    chain: string;
    reference?: string;
    description?: string;
  }) => apiClient.post("/api/v1/transfers", data),
};

// Payout API
export const payoutApi = {
  createQuote: (data: {
    source: string;
    fromAsset: string;
    toCurrency: string;
    chain?: string;
    amount?: number;
    settlementAmount?: number;
  }) => apiClient.post("/api/v1/payouts/quotes", data),

  initialize: (data: {
    quoteId: string;
    customerId: string;
    country: string;
    reference: string;
    paymentReason: string;
    beneficiary: {
      type: string;
      bankCode?: string;
      accountName?: string;
      accountNumber?: string;
      phoneNumber?: string;
    };
  }) => apiClient.post("/api/v1/payouts/initialize", data),

  finalize: (data: { quoteId: string }) =>
    apiClient.post("/api/v1/payouts/finalize", data),

  getCountryRequirements: (country: string) =>
    apiClient.get(`/api/v1/payouts/countries/${country}/requirements`),

  getTransactionLimits: () =>
    apiClient.get("/api/v1/payouts/limits"),
};

// Trading API
export const tradingApi = {
  createQuote: (data: {
    base_currency: string;
    quote_currency: string;
    side: string;
    quantity: string;
  }) => apiClient.post("/api/v1/trading/quotes", data),

  createOrder: (data: {
    base_currency: string;
    quote_currency: string;
    side: string;
    quantity: string;
    price: string;
    quote_id: string;
  }) => apiClient.post("/api/v1/trading/orders", data),

  getOrders: () => apiClient.get("/api/v1/trading/orders"),

  getOrderById: (id: string) =>
    apiClient.get(`/api/v1/trading/orders/${id}`),
};

export default apiClient;