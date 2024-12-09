
import { AuthGuard } from "@/components/auth-guard";

export default function SalesCreatePage() {
  return (
    <AuthGuard>
      <div>Sales Create</div>
    </AuthGuard>
  );
}
