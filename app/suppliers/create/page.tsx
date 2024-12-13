import { AuthGuard } from "@/components/auth-guard";
import { SuppliersCreate } from "@/components/suppliers/suppliers-create";


export default function SuppliersCreatePage() {
  return (
    <AuthGuard>
      <SuppliersCreate />
    </AuthGuard>
  );
}
