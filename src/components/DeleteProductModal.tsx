import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { useDeleteProduct } from '../hooks/useProducts';
import { Product } from '../types/product';

interface DeleteProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  open,
  onOpenChange,
  product,
}) => {
  const { mutateAsync: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      await deleteProduct(product.id.toString());
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus Product</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus product{' '}
            <span className="font-semibold">{product?.name}</span>?
          </p>
          <p className="text-sm text-red-600 mt-2">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductModal;