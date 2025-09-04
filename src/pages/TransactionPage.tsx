import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/DataTable";
import { Check, X, RotateCcw, Plus, Filter } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Data dummy untuk Transaksi
const transactionsData = [
  {
    id: 1,
    transactionId: "TRX-001",
    userId: "USR-001",
    totalDiamond: 500,
    amount: 50000,
    status: "success",
    createdAt: "2024-01-15 14:30:25",
  },
  {
    id: 2,
    transactionId: "TRX-002",
    userId: "USR-002",
    totalDiamond: 250,
    amount: 25000,
    status: "success",
    createdAt: "2024-01-15 13:45:10",
  },
  {
    id: 3,
    transactionId: "TRX-003",
    userId: "USR-003",
    totalDiamond: 1000,
    amount: 100000,
    status: "pending",
    createdAt: "2024-01-15 12:20:45",
  },
  {
    id: 4,
    transactionId: "TRX-004",
    userId: "USR-004",
    totalDiamond: 750,
    amount: 75000,
    status: "processing",
    createdAt: "2024-01-15 11:15:30",
  },
  {
    id: 5,
    transactionId: "TRX-005",
    userId: "USR-005",
    totalDiamond: 1500,
    amount: 150000,
    status: "failed",
    createdAt: "2024-01-15 10:05:15",
  },
  {
    id: 6,
    transactionId: "TRX-006",
    userId: "USR-006",
    totalDiamond: 300,
    amount: 30000,
    status: "success",
    createdAt: "2024-01-14 16:40:20",
  },
];

export function TransactionPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filterTransactionsByDate = (transactions: typeof transactionsData) => {
    if (!startDate && !endDate) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);

      if (startDate && endDate) {
        return transactionDate >= startDate && transactionDate <= endDate;
      } else if (startDate) {
        return transactionDate >= startDate;
      } else if (endDate) {
        return transactionDate <= endDate;
      }
      return true;
    });
  };

  const filteredTransactions = filterTransactionsByDate(transactionsData);

  const transactionColumns: Column<(typeof transactionsData)[0]>[] = [
    {
      key: "createdAt",
      header: "Created At",
      className: "text-muted-foreground",
    },
    {
      key: "transactionId",
      header: "ID Transaction",
      className: "font-medium text-primary",
    },
    {
      key: "userId",
      header: "User ID",
      className: "font-medium text-foreground",
    },
    {
      key: "totalDiamond",
      header: "Total Diamond",
      render: (value) => (
        <span className="font-medium text-blue-500">
          {value?.toLocaleString()} 💎
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (value) => (
        <span className="font-medium text-green-500">
          Rp {value?.toLocaleString("id-ID")}
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
      key: "actions",
      header: "Action",
      render: () => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-500 hover:text-green-600"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600"
          >
            <RotateCcw className="h-4 w-4" />
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
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Transaksi
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                Filter Tanggal
              </label>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                startPlaceholder="Tanggal mulai"
                endPlaceholder="Tanggal akhir"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                }}
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <DataTable
        columns={transactionColumns}
        data={filteredTransactions}
        emptyMessage="Tidak ada transaksi yang ditemukan."
      />
    </>
  );
}
