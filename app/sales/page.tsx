import { AuthGuard } from "@/components/auth-guard";
import { SalesLanding } from "@/components/sales/sales-landing";


export default function SalesPage() {
  return (
    <AuthGuard>
      <SalesLanding />
    </AuthGuard>
  );
}
