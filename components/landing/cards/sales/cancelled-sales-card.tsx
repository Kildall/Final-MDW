import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowDownIcon } from "lucide-react";


function CancelledSalesCard(cancelled: number, numberOfSales: number) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Cancelaciones</CardTitle>
        <CardDescription>Cancelaciones totales</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2"><ArrowDownIcon className="w-4 h-4" /> <span className="text-2xl font-bold">{cancelled}</span></span>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-background text-sm">
        En {numberOfSales} ventas
      </CardFooter>
    </Card>
  )
}

export { CancelledSalesCard };