import { AuthGuard } from "@/components/auth-guard";
import { SuppliersRead } from "@/components/suppliers/suppliers-read";
import { idSchema } from "@/lib/schemas/id-schema";
import { redirect } from "next/navigation";

export default function SupplierReadPage({ params }: { params: { id: string } }) {
  const { data, success } = idSchema.safeParse(params);

  if (!success) {
    redirect("/suppliers");
    return null;
  }

  return (
    <AuthGuard>
      <SuppliersRead id={data.id} />
    </AuthGuard>
  );
}
