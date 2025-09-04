import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, CreditCard, DollarSign } from "lucide-react";

// Dummy data untuk dashboard
const dashboardStats = [
  {
    title: "Total Pengguna",
    value: "2,543",
    change: "+12%",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Total Game",
    value: "45",
    change: "+3%",
    icon: Package,
    color: "text-green-500",
  },
  {
    title: "Transaksi",
    value: "1,234",
    change: "+8%",
    icon: CreditCard,
    color: "text-purple-500",
  },
  {
    title: "Pendapatan",
    value: "Rp 45.2M",
    change: "+15%",
    icon: DollarSign,
    color: "text-yellow-500",
  },
];

const recentTransactions = [
  {
    id: 1,
    user: "John Doe",
    game: "Mobile Legends",
    amount: "Rp 50,000",
    status: "Berhasil",
    time: "2 menit yang lalu",
  },
  {
    id: 2,
    user: "Jane Smith",
    game: "Free Fire",
    amount: "Rp 25,000",
    status: "Berhasil",
    time: "5 menit yang lalu",
  },
  {
    id: 3,
    user: "Bob Johnson",
    game: "PUBG Mobile",
    amount: "Rp 100,000",
    status: "Menunggu",
    time: "10 menit yang lalu",
  },
  {
    id: 4,
    user: "Alice Brown",
    game: "Genshin Impact",
    amount: "Rp 75,000",
    status: "Berhasil",
    time: "15 menit yang lalu",
  },
];

export function DashboardPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut adalah yang terjadi dengan platform
          top-up games Anda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => {
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
                  <p className="text-sm text-green-500 mt-1">
                    {stat.change} dari bulan lalu
                  </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <Card className="p-6 gaming-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Transaksi Terbaru
            </h2>
            <Button variant="outline" size="sm">
              Lihat Semua
            </Button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {transaction.user}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.game}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">
                    {transaction.amount}
                  </p>
                  <p
                    className={`text-sm ${
                      transaction.status === "Berhasil"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {transaction.status}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-xs text-muted-foreground">
                    {transaction.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Revenue Chart Placeholder */}
        <Card className="p-6 gaming-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Pendapatan Bulanan
            </h2>
            <Button variant="outline" size="sm">
              Lihat Detail
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center bg-secondary/30 rounded-lg">
            <p className="text-muted-foreground">
              Chart akan ditampilkan di sini
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
