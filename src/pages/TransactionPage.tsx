import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/DataTable";
import { Check, X, RotateCcw } from "lucide-react";
import Filters from "@/components/Filter";
// import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useTransactions } from "@/hooks/useTransactions";
import {
  transactionService,
  type TransactionsQueryParams,
} from "@/services/transaction";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/date";

// Tipe baris transaksi sesuai response backend
type TxRow = {
  id: number;
  merchant_transaction_id: string;
  total_diamond: number;
  total_amount: number;
  status: "pending" | "processing" | "success" | "failed" | string;
  no_wa: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
};

export function TransactionPage() {
  const [startDate] = useState<Date | undefined>();
  const [endDate] = useState<Date | undefined>();

  // Read active query params for page, limit, and status
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "50");
  const statusParam = searchParams.get("status") ?? undefined;
  const startParam = searchParams.get("start") ?? undefined;
  const endParam = searchParams.get("end") ?? undefined;

  const params: TransactionsQueryParams = useMemo(
    () => ({
      page,
      limit,
      status:
        statusParam === "all"
          ? undefined
          : (statusParam as TransactionsQueryParams["status"]) || undefined,
      start: startParam
        ? formatDate(startParam, "YYYY-MM-DD HH:mm:ss")
        : undefined,
      end: endParam ? formatDate(endParam, "YYYY-MM-DD HH:mm:ss") : undefined,
    }),
    [page, limit, statusParam, startParam, endParam]
  );

  const { data, isLoading, isError, refetch, isFetching } =
    useTransactions(params);

  const serverTransactions = (data?.transactions ?? []) as TxRow[];

  // Filter tanggal hanya terhadap data halaman saat ini (client-side)
  const filteredTransactions = useMemo(() => {
    if (!startDate && !endDate) return serverTransactions;
    return serverTransactions.filter((t) => {
      const d = new Date(t.created_at);
      if (startDate && endDate) return d >= startDate && d <= endDate;
      if (startDate) return d >= startDate;
      if (endDate) return d <= endDate;
      return true;
    });
  }, [serverTransactions, startDate, endDate]);

  const total = data?.pagination?.total ?? 0;

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })
      .format(n)
      .replace(/,00$/, "");

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const updateStatus = async (id: number, status: string) => {
    await transactionService.updateTransactionStatus(id, status);
    refetch();
  };

  const transactionColumns: Column<TxRow>[] = [
    {
      key: "id",
      header: "ID",
      className: "text-muted-foreground",
      render: (value) => <span>{`#${value}`}</span>,
    },
    {
      key: "merchant_transaction_id",
      header: "ID Transaction",
      className: "font-medium text-primary",
    },
    {
      key: "target_id",
      header: "Target ID",
      className: "font-medium text-primary",
      render: (value: string) => <span>{value || "-"}</span>,
    },
    {
      key: "no_wa",
      header: "No WA",
      className: "font-medium text-foreground",
    },
    {
      key: "total_diamond",
      header: "Total Diamond",
      render: (value) => (
        <span className="font-medium text-blue-500">
          {Number(value)?.toLocaleString()} 💎
        </span>
      ),
    },
    {
      key: "total_amount",
      header: "Amount",
      render: (value) => (
        <span className="font-medium text-green-500">
          {formatRupiah(Number(value) || 0)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "success"
              ? "bg-green-500/20 text-green-500"
              : value === "pending"
              ? "bg-yellow-500/20 text-yellow-500"
              : value === "processing"
              ? "bg-blue-500/20 text-blue-500"
              : "bg-red-500/20 text-red-500"
          }`}
        >
          {value === "success"
            ? "Success"
            : value === "pending"
            ? "Pending"
            : value === "processing"
            ? "Processing"
            : "Failed"}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      className: "text-muted-foreground",
      render: (_, row) => (
        <>
          <span>{formatDateTime(String(row.created_at))}</span>
          <Separator />
          <span>{formatDateTime(String(row.updated_at))}</span>
        </>
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: (_, { id }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-500 hover:text-green-600"
            onClick={() => updateStatus(id, "success")}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
            onClick={() => updateStatus(id, "failed")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Transaksi
            </h1>
            <p className="text-muted-foreground">
              Kelola dan pantau semua transaksi top-up games.
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {isFetching ? "Merefresh..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Filters />

      {/* Loading & Error */}
      {isLoading && (
        <Card className="mb-4">
          <div className="p-6 text-sm text-muted-foreground">
            Memuat data transaksi...
          </div>
        </Card>
      )}
      {isError && (
        <Card className="mb-4">
          <div className="p-6 text-sm text-red-500">
            Gagal memuat data transaksi. Coba lagi.
          </div>
        </Card>
      )}

      {/* Transactions Table */}
      <DataTable
        columns={transactionColumns}
        data={filteredTransactions}
        totalCount={total}
        emptyMessage={
          isLoading ? "Memuat..." : "Tidak ada transaksi yang ditemukan."
        }
      />
    </>
  );
}
