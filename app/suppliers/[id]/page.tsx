import { AuthGuard } from "@/components/auth-guard";
import { SuppliersRead } from "@/components/suppliers/suppliers-read";

export default function SupplierReadPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <SuppliersRead id={Number(params.id)} />
    </AuthGuard>
  );
}
