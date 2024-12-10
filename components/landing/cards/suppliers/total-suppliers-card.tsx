import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpIcon } from "lucide-react";

interface TotalSuppliersCardProps {
  totalPurchases: number;
  enabledSuppliers: number;
}

function TotalSuppliersCard({
  totalPurchases,
  enabledSuppliers,
}: TotalSuppliersCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Proveedores</CardTitle>
        <CardDescription>
          Información sobre proveedores habilitados
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2">
          <ArrowUpIcon className="w-4 h-4" />
          <span className="text-2xl font-bold">{enabledSuppliers}</span>
        </span>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-background text-sm">
        Total de compras: {totalPurchases}
      </CardFooter>
    </Card>
  );
}

export { TotalSuppliersCard };
