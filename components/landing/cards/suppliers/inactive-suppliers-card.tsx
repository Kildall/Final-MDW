import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InactiveSuppliersCardProps {
  inactiveSuppliers: number;
}

function InactiveSuppliersCard({
  inactiveSuppliers,
}: InactiveSuppliersCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Proveedores Inactivos</CardTitle>
        <CardDescription>Proveedores no habilitados</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="text-2xl font-bold">{inactiveSuppliers}</span>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-background">
        Verifica proveedores pendientes de reactivar
      </CardFooter>
    </Card>
  );
}

export { InactiveSuppliersCard };
