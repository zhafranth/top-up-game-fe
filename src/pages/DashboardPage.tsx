import { Card } from "@/components/ui/card";
import { CreditCard, DollarSign } from "lucide-react";
import { BarChartBase } from "@/components/BarChartBase";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { useDashboardTransactions } from "@/hooks/useTransactions";

// Data dummy total transaksi per bulan tahun 2025
const transaksiBulanan2025 = [
  { bulan: "Jan", total: 120 },
  { bulan: "Feb", total: 95 },
  { bulan: "Mar", total: 130 },
  { bulan: "Apr", total: 150 },
  { bulan: "Mei", total: 170 },
  { bulan: "Jun", total: 160 },
  { bulan: "Jul", total: 175 },
  { bulan: "Agu", total: 180 },
  { bulan: "Sep", total: 165 },
  { bulan: "Okt", total: 190 },
  { bulan: "Nov", total: 200 },
  { bulan: "Des", total: 210 },
];

// Util format Rupiah untuk menampilkan omset
const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const { data: dashboardTransactions } = useDashboardTransactions({
    start: startDate ? format(startDate, "yyyy-MM-dd") : "",
    end: endDate ? format(endDate, "yyyy-MM-dd") : "",
  });

  const {
    ranking_products = [],
    total_income = 0,
    total_profit = 0,
    total_transactions = 0,
  } = dashboardTransactions ?? {};

  const info = [
    {
      title: "Jumlah Transaksi",
      value: total_transactions || 0,
      icon: CreditCard,
      color: "text-purple-500",
    },
    {
      title: "Total Pendapatan",
      value: formatRupiah(total_income),
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      title: "Total Profit",
      value: formatRupiah(total_profit),
      icon: DollarSign,
      color: "text-yellow-500",
    },
  ];

  useEffect(() => {
    const startParam = searchParams.get("start") ?? undefined;
    const endParam = searchParams.get("end") ?? undefined;

    if (!startParam && !endParam) {
      const now = new Date();
      const end = new Date(now);
      end.setHours(0, 0, 0, 0);
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      setStartDate(start);
      setEndDate(end);
    } else {
      setStartDate(startParam ? new Date(startParam) : undefined);
      setEndDate(endParam ? new Date(endParam) : undefined);
    }
  }, [searchParams]);

  const updateQueryParams = (next: Partial<{ start?: Date; end?: Date }>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.start !== undefined) {
      if (!next.start) {
        params.delete("start");
      } else {
        params.set("start", format(next.start, "yyyy-MM-dd'T'HH:mm"));
      }
    }
    if (next.end !== undefined) {
      if (!next.end) {
        params.delete("end");
      } else {
        params.set("end", format(next.end, "yyyy-MM-dd'T'HH:mm"));
      }
    }

    setSearchParams(params);
  };

  const handleStartDateChange = (date?: Date) => {
    setStartDate(date);
    updateQueryParams({ start: date });
  };

  const handleEndDateChange = (date?: Date) => {
    setEndDate(date);
    updateQueryParams({ end: date });
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut adalah yang terjadi dengan platform
          top-up games Anda.
        </p>
        <div className="w-2/5 mt-5">
          <DateRangePicker
            showTime={false}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
        {info.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 gaming-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  {/* <p className="text-sm text-green-500 mt-1">
                    {stat.change} dari bulan lalu
                  </p> */}
                </div>
                <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        <Card className="p-6 gaming-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Total Transaksi per Bulan (2025)
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <div className="feature-chip text-violet-300 border-violet-400 ring-2 ring-violet-400">
                  <span className="font-medium">Jumlah Transaksi</span>
                </div>
                <div className="feature-chip text-muted-foreground">
                  <span className="font-medium">Total Pendapatan</span>
                </div>
                <div className="feature-chip text-muted-foreground">
                  <span className="font-medium">Total Profit</span>
                </div>
              </div>
            </div>
          </div>
          <BarChartBase
            data={transaksiBulanan2025}
            xKey="bulan"
            yKey="total"
            height={300}
            barColor="#8b5cf6" // violet-500
            yAxisFormatter={(v) => `${v}`}
          />
        </Card>

        {/* Ranking Produk Berdasarkan Total Transaksi */}
        <Card className="p-6 gaming-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Ranking Produk Berdasarkan Total Transaksi
            </h2>
          </div>
          <div className="space-y-4">
            {ranking_products.map((item, index) => {
              const rankClass =
                index === 0
                  ? "bg-yellow-500 text-black ring-2 ring-yellow-300"
                  : index === 1
                  ? "bg-gray-400 text-black ring-2 ring-gray-300"
                  : index === 2
                  ? "bg-orange-500 text-white ring-2 ring-orange-300"
                  : "bg-secondary text-foreground";
              return (
                <div key={item.name} className="flex items-center gap-4">
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${rankClass}`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {item.name}
                      </span>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {item.total_transaksi} transaksi
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {formatRupiah(item.total_pendapatan)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
