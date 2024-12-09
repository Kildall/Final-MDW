import { AuthGuard } from "@/components/auth-guard";
import { SalesRead } from "@/components/sales/sales-read";


export default function SalePage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <AuthGuard>
      <SalesRead id={Number(id)} />
    </AuthGuard>
  );
}
