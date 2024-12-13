import { AuthGuard } from "@/components/auth-guard";
import { ProductsLanding } from "@/components/products/products-landing";
export default function ProductsPage() {
  return (
    <AuthGuard>
      <ProductsLanding />
    </AuthGuard>
  );
}