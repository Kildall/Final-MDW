"use client";

import { AuthGuard } from "@/components/auth-guard";
import { ProductRead } from "@/components/products/products-read";
import { idSchema } from "@/lib/schemas/id-schema";
import { redirect } from "next/navigation";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { data, success } = idSchema.safeParse(params);

  if (!success) {
    redirect("/products");
    return null;
  }

  return (
    <AuthGuard>
      <ProductRead id={data.id} />
    </AuthGuard>
  )
}
