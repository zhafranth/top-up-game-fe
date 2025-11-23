import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/DataTable";
import { Edit, Trash2, Plus } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types/product";
import { CreateProductModal } from "../components/CreateProductModal";
import { DeleteProductModal } from "../components/DeleteProductModal";
import { UpdateProductModal } from "../components/UpdateProductModal";

export function ProductPage() {
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);

  // Fetch products from API
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useProducts({
    page: currentPage,
    limit: pageSize,
  });

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateProduct = (product: Product) => {
    setProductToUpdate(product);
    setIsUpdateModalOpen(true);
  };

  const productColumns: Column<Product>[] = [
    {
      key: "id",
      header: "ID",
      className: "font-medium text-primary",
    },
    {
      key: "name",
      header: "Name",
      className: "font-medium text-foreground",
    },
    {
      key: "price",
      header: "Price",
      render: (value) => (
        <span className="font-medium text-green-500">
          Rp {value?.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      key: "discount",
      header: "Discount (%)",
      render: (value) => (
        <span className="font-medium text-red-500">{value}%</span>
      ),
    },
    {
      key: "total_diamond",
      header: "Total Diamond",
      render: (value) => (
        <span className="font-medium text-blue-500">
          {value?.toLocaleString()} 💎
        </span>
      ),
    },
    {
      key: "is_populer",
      header: "Popular",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value
              ? "bg-yellow-500/20 text-yellow-500"
              : "bg-gray-500/20 text-gray-500"
          }`}
        >
          {value ? "Ya" : "Tidak"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Tanggal Dibuat",
      render: (value) => (
        <span className="text-muted-foreground">
          {new Date(value as string).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: (_, product) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-600"
            onClick={() => handleUpdateProduct(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
            onClick={() => handleDeleteProduct(product)}
          >
            <Trash2 className="h-4 w-4" />
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
              Manajemen Product
            </h1>
            <p className="text-muted-foreground">
              Kelola produk game dan layanan top-up Anda.
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Product
          </Button>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <Card className="p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">
              Memuat data produk...
            </span>
          </div>
        </Card>
      ) : error ? (
        <Card className="p-8">
          <div className="text-center text-red-500">
            <p>Gagal memuat data produk. Silakan coba lagi.</p>
          </div>
        </Card>
      ) : (
        <DataTable
          columns={productColumns}
          data={productsResponse?.products || []}
          title="Daftar Product"
          totalCount={productsResponse?.pagination?.total || 0}
          emptyMessage="Tidak ada product yang ditemukan."
        />
      )}

      {/* Create Product Modal */}
      <CreateProductModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* Delete Product Modal */}
      <DeleteProductModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        product={productToDelete}
      />

      {/* Update Product Modal */}
      <UpdateProductModal
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        product={productToUpdate}
      />
    </>
  );
}
