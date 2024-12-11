
import { AuthGuard } from "@/components/auth-guard";
import { SalesCreate } from "@/components/sales/sales-create";

export default function SalesCreatePage() {
  return (
    <AuthGuard>
      <SalesCreate />
    </AuthGuard>
  );
}

