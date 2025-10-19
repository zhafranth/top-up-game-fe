import { api } from "../lib/axios";

export interface CreateTransactionPayload {
  total_diamond: number;
  total_amount: number;
  no_wa: string;
}

export interface Transaction {
  id: number;
  total_diamond: number;
  total_amount: number;
  no_wa: string;
  status: string;
  [key: string]: any;
}

export interface CheckNicknameResponse {
  message: string;
  success: boolean;
  nickname?: string;
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
    const response = await api.post(`/nickname/check`, { target });
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
};
