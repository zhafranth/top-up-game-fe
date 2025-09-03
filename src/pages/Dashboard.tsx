import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Package,
  CreditCard,
  TrendingUp,
  DollarSign,
  Activity,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

interface DashboardProps {
  onLogout: () => void;
}

// Dummy data untuk dashboard
const revenueData = [
  { month: 'Jan', revenue: 25.5 },
  { month: 'Feb', revenue: 32.1 },
  { month: 'Mar', revenue: 28.8 },
  { month: 'Apr', revenue: 41.2 },
  { month: 'May', revenue: 38.7 },
  { month: 'Jun', revenue: 45.2 }
];

const dashboardStats = [
  {
    title: 'Total Pengguna',
    value: '2,543',
    change: '+12%',
    icon: Users,
    color: 'text-blue-500'
  },
  {
    title: 'Total Game',
    value: '45',
    change: '+3%',
    icon: Package,
    color: 'text-green-500'
  },
  {
    title: 'Transaksi',
    value: '1,234',
    change: '+8%',
    icon: CreditCard,
    color: 'text-purple-500'
  },
  {
    title: 'Pendapatan',
    value: 'Rp 45.2M',
    change: '+15%',
    icon: DollarSign,
    color: 'text-yellow-500'
  }
];

const recentTransactions = [
  {
    id: 1,
    user: 'John Doe',
    game: 'Mobile Legends',
    amount: 'Rp 50,000',
    status: 'Berhasil',
    time: '2 menit yang lalu'
  },
  {
    id: 2,
    user: 'Jane Smith',
    game: 'Free Fire',
    amount: 'Rp 25,000',
    status: 'Berhasil',
    time: '5 menit yang lalu'
  },
  {
    id: 3,
    user: 'Bob Johnson',
    game: 'PUBG Mobile',
    amount: 'Rp 100,000',
    status: 'Menunggu',
    time: '10 menit yang lalu'
  },
  {
    id: 4,
    user: 'Alice Brown',
    game: 'Genshin Impact',
    amount: 'Rp 75,000',
    status: 'Berhasil',
    time: '15 menit yang lalu'
  }
];

// Data dummy untuk User
const usersData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+62 812-3456-7890',
    joinDate: '2024-01-15',
    status: 'Aktif',
    totalTransactions: 25
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+62 813-9876-5432',
    joinDate: '2024-02-20',
    status: 'Aktif',
    totalTransactions: 18
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@email.com',
    phone: '+62 814-5555-1234',
    joinDate: '2024-03-10',
    status: 'Tidak Aktif',
    totalTransactions: 7
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice.brown@email.com',
    phone: '+62 815-7777-8888',
    joinDate: '2024-01-05',
    status: 'Aktif',
    totalTransactions: 42
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie.wilson@email.com',
    phone: '+62 816-9999-0000',
    joinDate: '2024-04-01',
    status: 'Aktif',
    totalTransactions: 12
  }
];

// Data dummy untuk Product
const productsData = [
  {
    id: 1,
    name: 'Mobile Legends Diamond',
    category: 'MOBA',
    price: 'Rp 15,000 - Rp 1,500,000',
    stock: 'Unlimited',
    sales: 1250,
    status: 'Aktif',
    createdDate: '2024-01-10'
  },
  {
    id: 2,
    name: 'Free Fire Diamond',
    category: 'Battle Royale',
    price: 'Rp 10,000 - Rp 2,000,000',
    stock: 'Unlimited',
    sales: 980,
    status: 'Aktif',
    createdDate: '2024-01-12'
  },
  {
    id: 3,
    name: 'PUBG Mobile UC',
    category: 'Battle Royale',
    price: 'Rp 20,000 - Rp 3,000,000',
    stock: 'Unlimited',
    sales: 750,
    status: 'Aktif',
    createdDate: '2024-01-14'
  },
  {
    id: 4,
    name: 'Genshin Impact Genesis Crystal',
    category: 'RPG',
    price: 'Rp 25,000 - Rp 5,000,000',
    stock: 'Unlimited',
    sales: 650,
    status: 'Aktif',
    createdDate: '2024-01-16'
  },
  {
    id: 5,
    name: 'Valorant Points',
    category: 'FPS',
    price: 'Rp 30,000 - Rp 2,500,000',
    stock: 'Unlimited',
    sales: 420,
    status: 'Tidak Aktif',
    createdDate: '2024-01-18'
  }
];

// Data dummy untuk Transaksi
const transactionsData = [
  {
    id: 1,
    transactionId: 'TRX-001',
    user: 'John Doe',
    game: 'Mobile Legends Diamond',
    amount: 'Rp 50,000',
    paymentMethod: 'GoPay',
    status: 'Berhasil',
    date: '2024-01-15 14:30:25'
  },
  {
    id: 2,
    transactionId: 'TRX-002',
    user: 'Jane Smith',
    game: 'Free Fire Diamond',
    amount: 'Rp 25,000',
    paymentMethod: 'OVO',
    status: 'Berhasil',
    date: '2024-01-15 13:45:10'
  },
  {
    id: 3,
    transactionId: 'TRX-003',
    user: 'Bob Johnson',
    game: 'PUBG Mobile UC',
    amount: 'Rp 100,000',
    paymentMethod: 'Dana',
    status: 'Menunggu',
    date: '2024-01-15 12:20:45'
  },
  {
    id: 4,
    transactionId: 'TRX-004',
    user: 'Alice Brown',
    game: 'Genshin Impact Genesis Crystal',
    amount: 'Rp 75,000',
    paymentMethod: 'Bank Transfer',
    status: 'Berhasil',
    date: '2024-01-15 11:15:30'
  },
  {
    id: 5,
    transactionId: 'TRX-005',
    user: 'Charlie Wilson',
    game: 'Valorant Points',
    amount: 'Rp 150,000',
    paymentMethod: 'Credit Card',
    status: 'Gagal',
    date: '2024-01-15 10:05:15'
  },
  {
    id: 6,
    transactionId: 'TRX-006',
    user: 'David Lee',
    game: 'Mobile Legends Diamond',
    amount: 'Rp 30,000',
    paymentMethod: 'ShopeePay',
    status: 'Berhasil',
    date: '2024-01-14 16:40:20'
  }
];

export function Dashboard({ onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [transactionStartDate, setTransactionStartDate] = useState<Date | undefined>();
  const [transactionEndDate, setTransactionEndDate] = useState<Date | undefined>();
  const [productStartDate, setProductStartDate] = useState<Date | undefined>();
  const [productEndDate, setProductEndDate] = useState<Date | undefined>();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCollapseChange = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return renderDashboardContent();
      case 'user':
        return renderUserContent();
      case 'product':
        return renderProductContent();
      case 'transaksi':
        return renderTransactionContent();
      default:
        return renderDashboardContent();
    }
  };

  const renderUserContent = () => {
    return (
      <>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Manajemen User</h1>
              <p className="text-muted-foreground">Kelola data pengguna platform top-up games Anda.</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card className="gaming-card">
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Tanggal Bergabung</TableHead>
                  <TableHead>Total Transaksi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="text-muted-foreground">{user.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{user.joinDate}</TableCell>
                    <TableCell className="text-center">{user.totalTransactions}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Aktif' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </>
    );
  };

  const filterProductsByDate = (data: any[]) => {
    if (!productStartDate && !productEndDate) {
      return data;
    }
    
    return data.filter(product => {
      const productDate = new Date(product.createdDate);
      
      if (productStartDate && productEndDate) {
        return productDate >= productStartDate && productDate <= productEndDate;
      } else if (productStartDate) {
        return productDate >= productStartDate;
      } else if (productEndDate) {
        return productDate <= productEndDate;
      }
      return true;
    });
  };

  const renderProductContent = () => {
    const filteredProducts = filterProductsByDate(productsData);
    
    return (
      <>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Manajemen Product</h1>
              <p className="text-muted-foreground">Kelola produk game dan layanan top-up Anda.</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Product
            </Button>
          </div>
        </div>

        {/* Date Filter */}
        <Card className="mb-6 gaming-card">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  <Filter className="h-4 w-4 inline mr-2" />
                  Filter Tanggal Dibuat
                </label>
                <DateRangePicker
                   startDate={productStartDate}
                   endDate={productEndDate}
                   onStartDateChange={setProductStartDate}
                   onEndDateChange={setProductEndDate}
                   startPlaceholder="Tanggal mulai"
                   endPlaceholder="Tanggal akhir"
                 />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setProductStartDate(undefined);
                    setProductEndDate(undefined);
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Products Table */}
        <Card className="gaming-card">
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama Product</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Penjualan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.price}</TableCell>
                    <TableCell className="text-center text-green-500 font-medium">{product.stock}</TableCell>
                    <TableCell className="text-center font-medium">{product.sales}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'Aktif' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{product.createdDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </>
    );
  };

  const filterTransactionsByDate = (data: any[]) => {
    if (!transactionStartDate && !transactionEndDate) {
      return data;
    }
    
    return data.filter(transaction => {
      const transactionDate = new Date(transaction.date.split(' ')[0]);
      
      if (transactionStartDate && transactionEndDate) {
        return transactionDate >= transactionStartDate && transactionDate <= transactionEndDate;
      } else if (transactionStartDate) {
        return transactionDate >= transactionStartDate;
      } else if (transactionEndDate) {
        return transactionDate <= transactionEndDate;
      }
      return true;
    });
  };

  const renderTransactionContent = () => {
    const filteredTransactions = filterTransactionsByDate(transactionsData);
    
    return (
      <>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Manajemen Transaksi</h1>
              <p className="text-muted-foreground">Kelola dan pantau semua transaksi top-up games.</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Transaksi
            </Button>
          </div>
        </div>

        {/* Date Filter */}
        <Card className="mb-6 gaming-card">
          <div className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filter Tanggal:</span>
              </div>
              <div className="flex items-center gap-2">
                <DateRangePicker
                   startDate={transactionStartDate}
                   endDate={transactionEndDate}
                   onStartDateChange={setTransactionStartDate}
                   onEndDateChange={setTransactionEndDate}
                   startPlaceholder="Tanggal mulai"
                   endPlaceholder="Tanggal akhir"
                 />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setTransactionStartDate(undefined);
                    setTransactionEndDate(undefined);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="gaming-card">
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaksi</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Metode Pembayaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium text-primary">{transaction.transactionId}</TableCell>
                    <TableCell className="font-medium text-foreground">{transaction.user}</TableCell>
                    <TableCell className="text-muted-foreground">{transaction.game}</TableCell>
                    <TableCell className="font-medium text-green-500">{transaction.amount}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500">
                        {transaction.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'Berhasil' 
                          ? 'bg-green-500/20 text-green-500' 
                          : transaction.status === 'Menunggu'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </>
    );
  };

  const renderDashboardContent = () => {
    return (
      <>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang kembali! Berikut adalah yang terjadi dengan platform top-up games Anda.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 gaming-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-green-500 mt-1">{stat.change} dari bulan lalu</p>
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
              <h2 className="text-xl font-semibold text-foreground">Transaksi Terbaru</h2>
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{transaction.user}</p>
                    <p className="text-sm text-muted-foreground">{transaction.game}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{transaction.amount}</p>
                    <p className={`text-sm ${
                      transaction.status === 'Berhasil' ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-xs text-muted-foreground">{transaction.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue Chart */}
          <Card className="p-6 gaming-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Grafik Pendapatan</h2>
              <div className="text-sm text-green-500">+15% dari bulan lalu</div>
            </div>
            <div className="h-64">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                  </pattern>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Y-axis labels */}
                <g className="text-xs fill-current text-muted-foreground">
                  <text x="10" y="15">50M</text>
                  <text x="10" y="55">40M</text>
                  <text x="10" y="95">30M</text>
                  <text x="10" y="135">20M</text>
                  <text x="10" y="175">10M</text>
                </g>
                
                {/* Chart area */}
                <g transform="translate(30, 10)">
                  {/* Chart background area */}
                  <path
                    d={`M 0 ${160 - (revenueData[0].revenue * 3)} ${revenueData.map((point, index) => 
                      `L ${index * 60} ${160 - (point.revenue * 3)}`
                    ).join(' ')} L ${(revenueData.length - 1) * 60} 160 L 0 160 Z`}
                    fill="url(#gradient)"
                  />
                  
                  {/* Chart line */}
                  <path
                    d={`M 0 ${160 - (revenueData[0].revenue * 3)} ${revenueData.map((point, index) => 
                      `L ${index * 60} ${160 - (point.revenue * 3)}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />
                  
                  {/* Data points */}
                  {revenueData.map((point, index) => (
                    <g key={index}>
                      <circle
                        cx={index * 60}
                        cy={160 - (point.revenue * 3)}
                        r="4"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={index * 60}
                        y={160 - (point.revenue * 3) - 10}
                        textAnchor="middle"
                        className="text-xs fill-current text-foreground font-medium"
                      >
                        {point.revenue}M
                      </text>
                    </g>
                  ))}
                  
                  {/* X-axis labels */}
                  {revenueData.map((point, index) => (
                    <text
                      key={index}
                      x={index * 60}
                      y="185"
                      textAnchor="middle"
                      className="text-xs fill-current text-muted-foreground"
                    >
                      {point.month}
                    </text>
                  ))}
                </g>
                
                {/* Legend */}
                <g transform="translate(30, 200)">
                  <circle cx="0" cy="-10" r="3" fill="#3b82f6" />
                  <text x="10" y="-6" className="text-xs fill-current text-muted-foreground">
                    Pendapatan Bulanan (dalam Jutaan IDR)
                  </text>
                </g>
              </svg>
            </div>
          </Card>
        </div>
       </>
     );
   };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        onLogout={onLogout}
        onCollapseChange={handleCollapseChange}
        onMenuClick={handleMenuClick}
        activeMenu={activeMenu}
      />
      
      {/* Main content */}
      <div className={`min-h-screen transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}