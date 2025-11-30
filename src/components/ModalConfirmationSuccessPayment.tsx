import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import type { Transaction } from "../services/transaction";
import { formatDate } from "../lib/date";
import { CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";

interface ModalConfirmationSuccessPaymentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Transaction | null;
}

const statusClassMap: Record<NonNullable<Transaction["status"]>, string> = {
  success:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400",
  failed:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400",
  pending:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
  processing:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
};

const statusIconMap: Record<
  NonNullable<Transaction["status"]>,
  React.ReactNode
> = {
  success: <CheckCircle className="h-4 w-4" />,
  failed: <AlertCircle className="h-4 w-4" />,
  pending: <Clock className="h-4 w-4" />,
  processing: <Loader2 className="h-4 w-4 animate-spin" />,
};

function formatCurrencyIDR(value?: number) {
  if (typeof value !== "number") return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm break-all">{value ?? "-"}</div>
    </div>
  );
}

export const ModalConfirmationSuccessPayment: React.FC<
  ModalConfirmationSuccessPaymentProps
> = ({ open, onOpenChange, data }) => {
  const trx = data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Pembayaran Berhasil</DialogTitle>
          <DialogDescription>
            Berikut adalah detail status pembayaran dan transaksi Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status ringkas */}
          <div
            className={
              "flex items-center justify-between rounded-md border p-3 " +
              (data ? statusClassMap[data.status] : "")
            }
          >
            <div className="flex items-center gap-2">
              {data ? statusIconMap.success : null}
              <span className="text-sm font-medium">
                {data ? data.status.toUpperCase() : "STATUS TIDAK TERSEDIA"}
              </span>
            </div>
            {trx?.merchant_transaction_id ? (
              <span className="text-xs">
                Ref: {trx.merchant_transaction_id}
              </span>
            ) : null}
          </div>

          {/* Detail utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="ID Transaksi" value={trx?.id} />
            <InfoItem
              label="Merchant Transaction ID"
              value={trx?.merchant_transaction_id || "-"}
            />
            <InfoItem label="Nomor WhatsApp" value={trx?.no_wa} />
            <InfoItem
              label="Total Diamond"
              value={
                typeof trx?.total_diamond === "number"
                  ? trx.total_diamond.toLocaleString("id-ID")
                  : "-"
              }
            />
            <InfoItem
              label="Total Amount"
              value={formatCurrencyIDR(trx?.total_amount)}
            />
            <InfoItem label="Status" value={trx?.status} />
            <InfoItem label="Target ID" value={trx?.target_id} />
            <InfoItem
              label="Dibuat"
              value={
                trx?.created_at
                  ? formatDate(trx.created_at, "YYYY-MM-DD HH:mm")
                  : "-"
              }
            />
            <InfoItem
              label="Diupdate"
              value={
                trx?.updated_at
                  ? formatDate(trx.updated_at, "YYYY-MM-DD HH:mm")
                  : "-"
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalConfirmationSuccessPayment;
