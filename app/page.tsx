'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sale } from "@/lib/features/sales/sales-slice";
import { useAppSelector } from "@/lib/hooks";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

function generateSalesCards(sales: Sale[]): React.ReactNode[] {
  let total = 0;
  let cancelled = 0;
  let average = 0;

  for (const sale of sales) {
    if (sale.status === 'CANCELLED') cancelled++;
    for (const product of sale.products) {
      total += product.quantity * product.product.price;
    }
  }

  average = total / sales.length;

  return [
    (<Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Ingresos Totales</CardTitle>
        <CardDescription>Ingresos totales de las ventas</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2"><ArrowUpIcon className="w-4 h-4" /> <span className="text-2xl font-bold">$ {total}</span></span>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-background text-sm">
        En {sales.length} ventas
      </CardFooter>
    </Card>),
    (<Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Cancelaciones</CardTitle>
        <CardDescription>Cancelaciones totales</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2"><ArrowDownIcon className="w-4 h-4" /> <span className="text-2xl font-bold">{cancelled}</span></span>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-background text-sm">
        En {sales.filter(sale => sale.status === 'CANCELLED').length} ventas
      </CardFooter>
    </Card>),
    (<Card className="h-full flex flex-col">
      <CardHeader className="flex flex-1">
        <CardTitle>Valor Promedio</CardTitle>
        <CardDescription>Valor promedio de las ventas</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center py-4">
        <span className="flex flex-row items-center gap-2"><ArrowUpIcon className="w-4 h-4" /> <span className="text-2xl font-bold">$ {average}</span></span>
      </CardContent>
      <CardFooter className="flex justify-center items-center text-background text-sm">
        En {sales.length} ventas
      </CardFooter>
    </Card>)
  ];
}

export default function Home() {
  const sales = useAppSelector(state => state.sales.sales);
  const salesStats = generateSalesCards(sales);

  return (
    <div className="flex flex-col gap-4 py-20">
      <h1 className="text-6xl font-bold text-center font-doto">Estadisticas Generales</h1>
      <section className="flex flex-col gap-4 py-8">
        <h2 className="text-4xl font-bold text-left font-doto">Ventas</h2>
        <h3 className="text-2xl font-light text-left">Resumen de las ventas dadas, en el mejor detalle posible</h3>
        <div className="flex flex-row justify-center items-center">
          <div className="flex flex-row gap-5 max-w-4xl">
            {
              salesStats.map((cardStat, index) => (
                <div key={`sales-stat-${index}`} className="md:basis-1/2 lg:basis-1/3 p-2">
                  {cardStat}
                </div>
              ))
            }
          </div>
        </div>
      </section>
    </div>
  );
}
