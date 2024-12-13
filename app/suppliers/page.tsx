import { AuthGuard } from "@/components/auth-guard";
import { SuppliersLanding } from "@/components/suppliers/suppliers-landing";

export default function SuppliersPage() {
  return (
    <AuthGuard>
      <SuppliersLanding />
    </AuthGuard>
  );
}
