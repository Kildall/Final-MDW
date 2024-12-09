
import { AuthGuard } from "@/components/auth-guard";
import { SalesList } from "@/components/sales/sales-list";

export default function SalesListPage() {
  return (
    <AuthGuard>
      <SalesList />
    </AuthGuard>
  );
}
