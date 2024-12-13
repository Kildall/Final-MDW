
import { AuthGuard } from "@/components/auth-guard";
import { ProductsCreate } from "@/components/products/products-create";

export default function ProductsCreatePage() {
  return (
    <AuthGuard>
      <ProductsCreate />
    </AuthGuard>
  );
}
