import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DataTable, Column } from '@/components/DataTable';
import {
  Edit,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react';

// Data dummy untuk Product
const productsData = [
  {
    id: 1,
    name: 'Mobile Legends Diamond',
    price: 15000,
    discountPrice: 2000,
    totalDiamond: 500
  },
  {
    id: 2,
    name: 'Free Fire Diamond',
    price: 10000,
    discountPrice: 1500,
    totalDiamond: 250
  },
  {
    id: 3,
    name: 'PUBG Mobile UC',
    price: 20000,
    discountPrice: 3000,
    totalDiamond: 1000
  },
  {
    id: 4,
    name: 'Genshin Impact Genesis Crystal',
    price: 25000,
    discountPrice: 5000,
    totalDiamond: 750
  },
  {
    id: 5,
    name: 'Valorant Points',
    price: 12000,
    discountPrice: 1800,
    totalDiamond: 300
  },
  {
    id: 6,
    name: 'Clash of Clans Gems',
    price: 8000,
    discountPrice: 1200,
    totalDiamond: 200
  }
];

export function ProductPage() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filterProductsByDate = (products: typeof productsData) => {
    // Since we removed date fields, return all products
    return products;
  };

  const filterProductsBySearch = (products: typeof productsData) => {
    if (!searchTerm) {
      return products;
    }
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filterProductsByCategory = (products: typeof productsData) => {
    // Since we removed category field, return all products
    return products;
  };

  const filteredProducts = filterProductsByCategory(
    filterProductsBySearch(
      filterProductsByDate(productsData)
    )
  );

  const getStatusBadge = (status: string) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'Aktif' 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }`}>
        {status}
      </span>
    );
  };

  const categories: string[] = []; // No categories in new structure

  const productColumns: Column<typeof productsData[0]>[] = [
    {
      key: 'id',
      header: 'ID',
      className: 'font-medium text-primary'
    },
    {
      key: 'name',
      header: 'Name',
      className: 'font-medium text-foreground'
    },
    {
      key: 'price',
      header: 'Price',
      render: (value) => (
        <span className="font-medium text-green-500">
          Rp {value?.toLocaleString('id-ID')}
        </span>
      )
    },
    {
      key: 'discountPrice',
      header: 'Diskon Price',
      render: (value) => (
        <span className="font-medium text-red-500">
          Rp {value?.toLocaleString('id-ID')}
        </span>
      )
    },
    {
      key: 'totalDiamond',
      header: 'Total Diamond',
      render: (value) => (
        <span className="font-medium text-blue-500">
          {value?.toLocaleString()} 💎
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Action',
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

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

          {/* Filters */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <Search className="h-4 w-4 inline mr-2" />
                    Cari Product
                  </label>
                  <Input
                    placeholder="Cari berdasarkan nama atau kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <Filter className="h-4 w-4 inline mr-2" />
                    Kategori
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* Reset Button */}
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setStartDate(undefined);
                      setEndDate(undefined);
                      setSearchTerm('');
                      setCategoryFilter('');
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
              
              {/* Date Filter - Separate row for better spacing */}
              <div className="mt-4 pt-4 border-t border-border">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  <Filter className="h-4 w-4 inline mr-2" />
                  Filter Tanggal Dibuat
                </label>
                <div className="max-w-md">
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    startPlaceholder="Pilih tanggal mulai"
                    endPlaceholder="Pilih tanggal akhir"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Products Table */}
          <DataTable
            columns={productColumns}
            data={filteredProducts}
            title="Daftar Product"
            totalCount={productsData.length}
            emptyMessage="Tidak ada product yang ditemukan."
          />
    </>
  );
}