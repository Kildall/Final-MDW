import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ArrowUpIcon } from "lucide-react";

interface TotalSuppliersCardProps {
  totalSuppliers: number;
}

function TotalSuppliersCard({
  totalSuppliers,
}: TotalSuppliersCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Cantidad de proveedores</CardTitle>
        <CardDescription>
          Información sobre proveedores
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2">
          <ArrowUpIcon className="w-4 h-4" />
          <span className="text-2xl font-bold">{totalSuppliers}</span>
        </span>
      </CardContent>
    </Card>
  );
}

export { TotalSuppliersCard };
