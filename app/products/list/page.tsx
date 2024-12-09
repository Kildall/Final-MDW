"use client";

import { AuthGuard } from "@/components/auth-guard";
import { ProductsList } from "@/components/products/products-list";

export default function ProductList() {
  return (
    <AuthGuard>
      <ProductsList />
    </AuthGuard>
  );
}
