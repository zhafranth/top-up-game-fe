import { api } from "../lib/axios";

export interface CreateTransactionPayload {
  total_diamond: number;
  total_amount: number;
  actual_price: number;
  price: number;
  no_wa: string;
  target_id: number;
  product_id: number;
}

export interface Transaction {
  id: number;
  total_diamond: number;
  total_amount: number;
  no_wa: string;
  status: string;
  merchant_transaction_id?: string;
  target_id?: number;
  created_at?: string; // ISO datetime
  updated_at?: string; // ISO datetime
  [key: string]: any;
}

export interface CheckNicknameResponse {
  message: string;
  nick: string;
  success: boolean;
}

export interface CreateTransactionResponse {
  message: string;
  transaction: Transaction;
}

export interface InitiateQrisResponse {
  message: string;
  reference_id?: string;
  transaction_id: number;
  qris: {
    qr_string?: string; // a.k.a qr_content
    qr_url?: string;
    redirect_url?: string;
    transaction_id?: string; // provider id (optional)
    raw?: any;
  };
}

export interface DashboardTransactions {
  ranking_products: {
    name: string;
    total_pendapatan: number;
    total_transaksi: number;
  }[];
  total_income: number;
  total_profit: number;
  total_transactions: number;
}

// Response for public status check by merchant_transaction_id and no_wa
export interface TransactionStatusResponse {
  status: "pending" | "processing" | "success" | "failed";
  transaction: Transaction;
}

// Tambahan: tipe untuk list transaksi
export interface TransactionsQueryParams {
  page?: number; // default 1
  limit?: number; // default 10
  status?: "pending" | "processing" | "success" | "failed";
}

export interface TransactionsListResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const transactionService = {
  checkNickname: async (target: string): Promise<CheckNicknameResponse> => {
    const response = await api.post(`/nickname/check-name-guin`, { target });
    return response.data;
  },

  createTransaction: async (
    payload: CreateTransactionPayload
  ): Promise<CreateTransactionResponse> => {
    const response = await api.post("/transactions", payload);
    return response.data;
  },

  initiateQrisPayment: async (id: number): Promise<InitiateQrisResponse> => {
    const response = await api.post(`/transactions/${id}/pay/qris`);
    return response.data;
  },

  // NEW: get transaction detail by id for polling status
  getTransaction: async (id: number): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    // Support both { transaction: {...} } or direct object response
    return response.data?.transaction ?? response.data;
  },

  // NEW: list transactions with pagination and status filter
  getTransactions: async (
    params?: TransactionsQueryParams
  ): Promise<TransactionsListResponse> => {
    const response = await api.get("/transactions", { params });
    return response.data as TransactionsListResponse;
  },

  // Public endpoint: check status by merchant_transaction_id and no_wa
  getTransactionStatusByMerchant: async (
    merchant_transaction_id: string,
    no_wa: string
  ): Promise<TransactionStatusResponse> => {
    const response = await api.get("/transactions/status", {
      params: { merchant_transaction_id, no_wa },
    });
    return response.data as TransactionStatusResponse;
  },

  updateTransactionStatus: async (id: number, status: string) => {
    const response = await api.put(`/transactions/${id}`, { status });
    return response.data;
  },

  dashboarTransactions: async (params: {
    start: string;
    end: string;
  }): Promise<DashboardTransactions> => {
    const response = await api.get("/dashboard", { params });
    return response.data as DashboardTransactions;
  },
};
