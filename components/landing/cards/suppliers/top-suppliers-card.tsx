import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrophyIcon } from "lucide-react";

interface TopSupplier {
  name: string;
  purchaseCount: number;
}

interface TopSuppliersCardProps {
  topSuppliers: TopSupplier[];
}

function TopSuppliersCard({ topSuppliers }: TopSuppliersCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Top Proveedores</CardTitle>
        <CardDescription>Proveedores con más compras</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col py-4 gap-2">
        {topSuppliers.map((supplier, index) => (
          <div
            key={supplier.name}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <TrophyIcon
                className={`w-4 h-4 ${index === 0 ? "text-yellow-500" : ""}`}
              />
              <span className="font-medium">{supplier.name}</span>
            </span>
            <span className="text-sm font-bold">
              {supplier.purchaseCount} compras
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-background">
        Basado en el historial de compras
      </CardFooter>
    </Card>
  );
}

export { TopSuppliersCard };
