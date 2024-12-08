import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon } from "lucide-react";

function BrandsVarietyProductsCard(numberOfBrands: number, numberOfProducts: number) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Marcas y Variedades</CardTitle>
        <CardDescription>Diversidad de marcas en el inventario</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2"><ArrowUpIcon className="w-4 h-4" /> <span className="text-2xl font-bold">{numberOfBrands}</span></span>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-background text-sm">
        Para {numberOfProducts} productos
      </CardFooter>
    </Card>
  )
}

export { BrandsVarietyProductsCard };
