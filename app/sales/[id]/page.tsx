import { AuthGuard } from "@/components/auth-guard";
import { SalesRead } from "@/components/sales/sales-read";
import { idSchema } from "@/lib/schemas/id-schema";
import { redirect } from "next/navigation";

export default function SalePage({ params }: { params: { id: string } }) {
  const { data, success } = idSchema.safeParse(params);

  if (!success) {
    redirect("/sales");
    return null;
  }

  return (
    <AuthGuard>
      <SalesRead id={data.id} />
    </AuthGuard>
  );
}
