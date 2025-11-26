import React from "react";
import { useForm } from "react-hook-form";
import { useCreateProduct } from "../hooks/useProducts";
import { CreateProductPayload } from "../services/product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";

interface CreateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  open,
  onOpenChange,
}) => {
  const form = useForm<CreateProductPayload>({
    defaultValues: {
      name: "",
      price: 0,
      total_diamond: 0,
      discount: 0,
      is_populer: false,
      actual_price: 0,
    },
  });

  const createProductMutation = useCreateProduct();

  const onSubmit = async (data: CreateProductPayload) => {
    try {
      await createProductMutation.mutateAsync(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Product Baru</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk menambahkan product baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Product</Label>
            <Input
              id="name"
              placeholder="Masukkan nama product"
              {...form.register("name", {
                required: "Nama product wajib diisi",
              })}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Masukkan harga"
              {...form.register("price", {
                required: "Harga wajib diisi",
                min: { value: 1, message: "Harga harus lebih dari 0" },
                valueAsNumber: true,
              })}
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
              placeholder="Masukkan harga"
              {...form.register("actual_price", {
                required: "Harga wajib diisi",
                min: { value: 1, message: "Harga harus lebih dari 0" },
                valueAsNumber: true,
              })}
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
              placeholder="Masukkan total diamond"
              {...form.register("total_diamond", {
                required: "Total diamond wajib diisi",
                min: { value: 1, message: "Total diamond harus lebih dari 0" },
                valueAsNumber: true,
              })}
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
              placeholder="Masukkan discount (0-100)"
              {...form.register("discount", {
                min: { value: 0, message: "Discount tidak boleh negatif" },
                max: { value: 100, message: "Discount maksimal 100%" },
                valueAsNumber: true,
              })}
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
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_populer">Product Populer</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createProductMutation.isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={createProductMutation.isPending}>
              {createProductMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
