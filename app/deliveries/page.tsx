import { AuthGuard } from "@/components/auth-guard";
import { DeliveriesLanding } from "@/components/deliveries/deliveries-landing";

export default function DeliveriesPage() {
  return (
    <AuthGuard>
      <DeliveriesLanding />
    </AuthGuard>
  );
}
