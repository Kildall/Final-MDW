import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon } from "lucide-react";

function InventoryValueProductsCard(inventoryValue: number, numberOfProducts: number) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Valor del Inventario</CardTitle>
        <CardDescription>Valor monetario de los productos en stock</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2"><ArrowUpIcon className="w-4 h-4" /> <span className="text-2xl font-bold">{inventoryValue.toFixed(2)}</span></span>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-background text-sm">
        En {numberOfProducts} productos
      </CardFooter>
    </Card>
  )
}

export { InventoryValueProductsCard };
