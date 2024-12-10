import { AuthGuard } from "@/components/auth-guard";
import { SuppliersLanding } from "@/components/suppliers/suppliers-landing";

export default function SalesPage() {
  return (
    <AuthGuard>
      <SuppliersLanding />
    </AuthGuard>
  );
}
