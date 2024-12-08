import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon } from "lucide-react";

function ProductsInStockCard(numberOfProducts: number, productWithMostStock: string) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Productos en Stock</CardTitle>
        <CardDescription>Cantidad total de productos en stock</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2"><ArrowUpIcon className="w-4 h-4" /> <span className="text-2xl font-bold">{numberOfProducts}</span></span>
      </CardContent>
      {
        productWithMostStock && (
          <CardFooter className="flex justify-center items-center text-background text-sm">
            <span>
              El producto con mas stock es <span className="font-bold inline">{productWithMostStock}</span>
            </span>
          </CardFooter>
        )
      }
    </Card>
  )
}

export { ProductsInStockCard };
