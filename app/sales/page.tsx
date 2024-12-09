import { AuthGuard } from "@/components/auth-guard";


export default function SalesPage() {
  return <AuthGuard><div>Sales</div></AuthGuard>;
}
