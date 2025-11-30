import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useUpdateProduct } from "../hooks/useProducts";
import { Product } from "../types/product";
import { UpdateProductPayload } from "../services/product";

interface UpdateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  open,
  onOpenChange,
  product,
}) => {
  const { mutateAsync: updateProduct, isPending } = useUpdateProduct();

  const form = useForm<UpdateProductPayload>({
    defaultValues: {
      name: "",
      price: 0,
      total_diamond: 0,
      discount: 0,
      is_populer: false,
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: product.price,
        total_diamond: product.total_diamond,
        discount: product.discount,
        is_populer: product.is_populer,
        actual_price: product.actual_price,
      });
    }
  }, [product, form]);

  const onSubmit = async (data: UpdateProductPayload) => {
    if (!product) return;

    try {
      await updateProduct({ id: product.id.toString(), payload: data });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Product</Label>
            <Input
              id="name"
              {...form.register("name", {
                required: "Nama product wajib diisi",
              })}
              placeholder="Masukkan nama product"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Harga</Label>
            <Input
              id="price"
              type="number"
              {...form.register("price", {
                required: "Harga wajib diisi",
                min: { value: 1, message: "Harga minimal 1" },
                valueAsNumber: true,
              })}
              placeholder="Masukkan harga"
            />
            {form.formState.errors.price && (
              <p className="text-sm text-red-500">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="actual_price">Actual Price</Label>
            <Input
              id="actual_price"
              type="number"
              {...form.register("actual_price", {
                required: "Actual price wajib diisi",
                min: { value: 1, message: "Actual price minimal 1" },
                valueAsNumber: true,
              })}
              placeholder="Masukkan actual price"
            />
            {form.formState.errors.actual_price && (
              <p className="text-sm text-red-500">
                {form.formState.errors.actual_price.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_diamond">Total Diamond</Label>
            <Input
              id="total_diamond"
              type="number"
              {...form.register("total_diamond", {
                required: "Total diamond wajib diisi",
                min: { value: 1, message: "Total diamond minimal 1" },
                valueAsNumber: true,
              })}
              placeholder="Masukkan total diamond"
            />
            {form.formState.errors.total_diamond && (
              <p className="text-sm text-red-500">
                {form.formState.errors.total_diamond.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              {...form.register("discount", {
                required: "Discount wajib diisi",
                min: { value: 0, message: "Discount minimal 0" },
                max: { value: 100, message: "Discount maksimal 100" },
                valueAsNumber: true,
              })}
              placeholder="Masukkan discount"
            />
            {form.formState.errors.discount && (
              <p className="text-sm text-red-500">
                {form.formState.errors.discount.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="is_populer"
              type="checkbox"
              {...form.register("is_populer")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <Label htmlFor="is_populer">Product Populer</Label>
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Mengupdate..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProductModal;
