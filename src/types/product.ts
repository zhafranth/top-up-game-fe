export interface Product {
  id: number;
  name: string;
  price: number;
  actual_price: number;
  discount: number;
  is_populer: boolean;
  total_diamond: number;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  is_populer?: boolean;
  isSortedPrice?: boolean;
}
