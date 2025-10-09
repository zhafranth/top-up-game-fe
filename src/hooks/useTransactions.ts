import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { transactionService, TransactionsQueryParams, TransactionsListResponse } from '@/services/transaction';

export const useTransactions = (params?: TransactionsQueryParams) => {
  return useQuery<TransactionsListResponse>({
    queryKey: ['transactions', params],
    queryFn: () => transactionService.getTransactions(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
};