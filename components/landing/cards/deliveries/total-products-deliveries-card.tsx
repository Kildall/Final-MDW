import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon } from "lucide-react";



function TotalProductsDeliveriesCard(total: number, numberOfDeliveriesInTransit: number) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Total de Productos En Transito</CardTitle>
        <CardDescription>Cantidad total de productos que estan en transito</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2"><ArrowUpIcon className="w-4 h-4" /> <span className="text-2xl font-bold">{total}</span></span>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-background text-sm">
        En {numberOfDeliveriesInTransit} entregas en curso
      </CardFooter>
    </Card>
  )
}

export { TotalProductsDeliveriesCard };