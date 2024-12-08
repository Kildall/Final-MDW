import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon } from "lucide-react";



function InTransitDeliveriesCard(inTransit: number, numberOfDeliveries: number) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Entregas En Curso</CardTitle>
        <CardDescription>Pedidos en curso de entrega</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2"><ArrowUpIcon className="w-4 h-4" /> <span className="text-2xl font-bold">{inTransit}</span></span>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-background text-sm">
        En {numberOfDeliveries} entregas
      </CardFooter>
    </Card>
  )
}

export { InTransitDeliveriesCard };