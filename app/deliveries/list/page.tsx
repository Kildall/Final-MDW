import { AuthGuard } from "@/components/auth-guard";
import { DeliveriesList } from "@/components/deliveries/deliveries-list";


export default function DeliveriesListPage() {
  return (
    <AuthGuard>
      <DeliveriesList />
    </AuthGuard>
  );
}
