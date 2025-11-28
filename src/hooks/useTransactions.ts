import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  transactionService,
  TransactionsQueryParams,
  TransactionsListResponse,
  DashboardTransactions,
} from "@/services/transaction";

export const useTransactions = (params?: TransactionsQueryParams) => {
  return useQuery<TransactionsListResponse>({
    queryKey: ["transactions", params],
    queryFn: () => transactionService.getTransactions(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
};

export const useDashboardTransactions = (params: {
  start: string;
  end: string;
}) => {
  return useQuery<DashboardTransactions>({
    queryKey: ["dashboard-transactions", params],
    queryFn: () => transactionService.dashboarTransactions(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    enabled: !!params.start && !!params.end,
  });
};
