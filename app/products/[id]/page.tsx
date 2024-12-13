"use client";

import { AuthGuard } from "@/components/auth-guard";
import { ProductRead } from "@/components/products/products-read";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <AuthGuard>
      <ProductRead id={Number(id)} />
    </AuthGuard>
  )
}
