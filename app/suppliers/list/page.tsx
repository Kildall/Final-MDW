import { AuthGuard } from "@/components/auth-guard";
import { SuppliersList } from "@/components/suppliers/suppliers-list";

export default function SuppliersListPage() {
  return (
    <AuthGuard>
      <SuppliersList />
    </AuthGuard>
  );
}
